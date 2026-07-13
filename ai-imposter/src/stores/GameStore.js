import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";

import {
  GameServiceError,
  GAME_SERVICE_ERRORS,
} from "../services/gameService.js";
import { GAME_PHASE } from "../domain/constants.js";

/**
 * Random extra wait (ms) before calling advancePhase, so five clients whose
 * timers expire together don't all hit the server in the same millisecond.
 * advance_game_phase is idempotent, so this is purely about being polite.
 */
const ADVANCE_JITTER_MS = 400;

/**
 * If the server says "not time yet" (client clock slightly ahead of the
 * server's phase_ends_at), retry after this long.
 */
const ADVANCE_RETRY_MS = 500;

export default class GameStore {
  currentGame = null;
  votingAnswers = [];
  roundResults = [];
  hasSubmittedAnswer = false;
  hasVoted = false;
  /** The id of the answer the current player submitted this round (if any). */
  myAnswerId = null;
  /** The id of the answer the current player voted for this round (if any). */
  myVoteAnswerId = null;
  isLoading = false;
  error = null;

  gameSubscription = null;
  phaseTimeoutId = null;
  phaseReactionDisposer = null;

  constructor(gameService) {
    this.gameService = gameService;

    makeObservable(this, {
      currentGame: observable,
      votingAnswers: observable,
      roundResults: observable,
      hasSubmittedAnswer: observable,
      hasVoted: observable,
      myAnswerId: observable,
      myVoteAnswerId: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      loadGameById: action,
      submitAnswer: action,
      loadVotingAnswers: action,
      castVote: action,
      loadRoundResults: action,
      resetGame: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof GameServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  /**
   * Starts following one game: loads it, subscribes to Realtime updates,
   * and keeps the phase machine moving (see #schedulePhaseAdvance).
   * Pair with stopGameSync. Safe to call repeatedly for the same game.
   */
  startGameSync(gameId) {
    if (this.gameSubscription || !gameId) {
      return;
    }

    this.loadGameById(gameId);

    if (this.gameService.subscribeToGame) {
      this.gameSubscription = this.gameService.subscribeToGame({
        gameId,
        onGameChange: (game) => {
          runInAction(() => {
            this.currentGame = game;
          });
        },
      });
    }

    // React to every phase/round change: reset per-round state and
    // (re)schedule the next advance call.
    this.phaseReactionDisposer = reaction(
      () => ({
        phase: this.currentGame?.phase,
        round: this.currentGame?.currentRound,
        endsAt: this.currentGame?.phaseEndsAt,
      }),
      ({ phase, round }, previous) => {
        if (phase !== previous?.phase || round !== previous?.round) {
          this.#onPhaseChanged();
        }

        this.#schedulePhaseAdvance();
      },
    );
  }

  stopGameSync() {
    if (this.gameSubscription) {
      this.gameSubscription();
      this.gameSubscription = null;
    }

    if (this.phaseReactionDisposer) {
      this.phaseReactionDisposer();
      this.phaseReactionDisposer = null;
    }

    this.#clearPhaseTimeout();
  }

  resetGame() {
    this.stopGameSync();
    this.currentGame = null;
    this.votingAnswers = [];
    this.roundResults = [];
    this.hasSubmittedAnswer = false;
    this.hasVoted = false;
    this.myAnswerId = null;
    this.myVoteAnswerId = null;
    this.error = null;
  }

  #onPhaseChanged() {
    const phase = this.currentGame?.phase;

    runInAction(() => {
      if (phase === GAME_PHASE.ANSWERING) {
        this.hasSubmittedAnswer = false;
        this.hasVoted = false;
        this.myAnswerId = null;
        this.myVoteAnswerId = null;
        this.votingAnswers = [];
        this.roundResults = [];
      }
    });

    if (phase === GAME_PHASE.VOTING) {
      this.loadVotingAnswers();
    } else if (phase === GAME_PHASE.REVEAL) {
      this.loadRoundResults();
    }
  }

  /**
   * The client half of the phase machine: wait until phase_ends_at (plus a
   * little jitter), then ask the server to advance. Every client does this;
   * the first call wins and the rest no-op, so the game keeps moving as
   * long as at least one player has the page open.
   */
  #schedulePhaseAdvance() {
    this.#clearPhaseTimeout();

    const game = this.currentGame;

    if (!game?.phaseEndsAt || game.phase === GAME_PHASE.FINISHED) {
      return;
    }

    const millisecondsLeft =
      new Date(game.phaseEndsAt).getTime() - Date.now();
    const delay =
      Math.max(0, millisecondsLeft) + Math.random() * ADVANCE_JITTER_MS;

    this.phaseTimeoutId = window.setTimeout(() => {
      this.#tryAdvancePhase();
    }, delay);
  }

  async #tryAdvancePhase() {
    const game = this.currentGame;

    if (!game || game.phase === GAME_PHASE.FINISHED) {
      return;
    }

    try {
      const result = await this.gameService.advancePhase(game.id);

      const serverSaysTooEarly =
        result &&
        result.advanced === false &&
        result.phase === this.currentGame?.phase;

      if (serverSaysTooEarly) {
        this.#clearPhaseTimeout();
        this.phaseTimeoutId = window.setTimeout(() => {
          this.#tryAdvancePhase();
        }, ADVANCE_RETRY_MS);
      }
      // On success the games row updates, Realtime delivers it, and the
      // reaction in startGameSync schedules the next phase. Nothing to do.
    } catch {
      // Another client will advance, or our next Realtime update will
      // reschedule. Advancing is best-effort per client by design.
    }
  }

  #clearPhaseTimeout() {
    if (this.phaseTimeoutId !== null) {
      window.clearTimeout(this.phaseTimeoutId);
      this.phaseTimeoutId = null;
    }
  }

  async loadGameById(gameId) {
    this.error = null;

    try {
      const game = await this.gameService.getGameById(gameId);

      runInAction(() => {
        this.currentGame = game;
      });

      return true;
    } catch (caughtError) {
      this.setServiceError("load", caughtError, "Failed to load the game");

      return false;
    }
  }

  async submitAnswer({ playerId, text }) {
    const game = this.currentGame;

    if (
      !game ||
      game.phase !== GAME_PHASE.ANSWERING ||
      this.hasSubmittedAnswer
    ) {
      return false;
    }

    this.error = null;

    try {
      const submitted = await this.gameService.submitAnswer({
        gameId: game.id,
        roundNumber: game.currentRound,
        questionId: game.currentQuestionId,
        playerId,
        text,
      });

      runInAction(() => {
        this.hasSubmittedAnswer = true;
        this.myAnswerId = submitted?.id ?? null;
      });

      return true;
    } catch (caughtError) {
      if (
        caughtError instanceof GameServiceError &&
        caughtError.code === GAME_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED
      ) {
        runInAction(() => {
          this.hasSubmittedAnswer = true;
        });

        return true;
      }

      this.setServiceError(
        "submitAnswer",
        caughtError,
        "Failed to submit your answer",
      );

      return false;
    }
  }

  async loadVotingAnswers() {
    const game = this.currentGame;

    if (!game) {
      return false;
    }

    this.error = null;

    try {
      const answers = await this.gameService.getVotingAnswers(game.id);

      runInAction(() => {
        this.votingAnswers = answers;
      });

      return true;
    } catch (caughtError) {
      this.setServiceError(
        "loadVotingAnswers",
        caughtError,
        "Failed to load the answers for voting",
      );

      return false;
    }
  }

  async castVote({ voterPlayerId, answerId }) {
    const game = this.currentGame;

    if (!game || game.phase !== GAME_PHASE.VOTING || this.hasVoted) {
      return false;
    }

    this.error = null;

    try {
      await this.gameService.castVote({
        gameId: game.id,
        roundNumber: game.currentRound,
        voterPlayerId,
        answerId,
      });

      runInAction(() => {
        this.hasVoted = true;
        this.myVoteAnswerId = answerId;
      });

      return true;
    } catch (caughtError) {
      if (
        caughtError instanceof GameServiceError &&
        caughtError.code === GAME_SERVICE_ERRORS.ALREADY_VOTED
      ) {
        runInAction(() => {
          this.hasVoted = true;
        });

        return true;
      }

      this.setServiceError("castVote", caughtError, "Failed to cast your vote");

      return false;
    }
  }

  async loadRoundResults() {
    const game = this.currentGame;

    if (!game) {
      return false;
    }

    this.error = null;

    try {
      const results = await this.gameService.getRoundResults({
        gameId: game.id,
        roundNumber: game.currentRound,
      });

      runInAction(() => {
        this.roundResults = results;
      });

      return true;
    } catch (caughtError) {
      this.setServiceError(
        "loadRoundResults",
        caughtError,
        "Failed to load the round results",
      );

      return false;
    }
  }
}
