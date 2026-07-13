import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";

import { GAME_PHASE } from "../domain/constants.js";
import {
  GAME_SERVICE_ERRORS,
  GameServiceError,
} from "../services/contracts/gameService.js";

/**
 * Random extra wait (ms) before calling advancePhase, so clients whose
 * timers expire together do not all hit the server in the same millisecond.
 */
const ADVANCE_JITTER_MS = 400;

/** Retry delay when the client clock reaches the deadline before the server. */
const ADVANCE_RETRY_MS = 500;
const MAX_ADVANCE_RETRIES = 2;

export default class GameStore {
  currentGame = null;
  isLoading = false;
  error = null;

  syncedGameId = null;
  gameSubscription = null;
  phaseTimeoutId = null;
  phaseReactionDisposer = null;
  gameLoadRequestId = 0;
  phaseAdvanceGeneration = 0;
  activePhaseAdvanceKeys = new Set();

  constructor(gameService) {
    this.gameService = gameService;

    makeObservable(this, {
      currentGame: observable,
      isLoading: observable,
      error: observable,

      gameId: computed,
      currentPhase: computed,
      currentRound: computed,
      totalRounds: computed,
      currentQuestionId: computed,
      phaseStartedAt: computed,
      phaseEndsAt: computed,

      clearError: action,
      setServiceError: action,
      loadGameById: action,
      clearScheduledPhaseAdvance: action,
      resetGame: action,
    });
  }

  get gameId() {
    return this.currentGame?.id ?? null;
  }

  get currentPhase() {
    return this.currentGame?.phase ?? null;
  }

  get currentRound() {
    return this.currentGame?.currentRound ?? null;
  }

  get totalRounds() {
    return this.currentGame?.totalRounds ?? null;
  }

  get currentQuestionId() {
    return this.currentGame?.currentQuestionId ?? null;
  }

  get phaseStartedAt() {
    return this.currentGame?.phaseStartedAt ?? null;
  }

  get phaseEndsAt() {
    return this.currentGame?.phaseEndsAt ?? null;
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
   * Follow one game through its initial load, Realtime updates and phase
   * deadline. Repeated calls for the same game are ignored; switching to a
   * different game first closes the previous subscription and timer.
   */
  startGameSync(gameId) {
    if (!gameId || this.syncedGameId === gameId) {
      return;
    }

    this.stopGameSync();
    this.syncedGameId = gameId;
    void this.loadGameById(gameId);

    if (this.gameService.subscribeToGame) {
      this.gameSubscription = this.gameService.subscribeToGame({
        gameId,
        onGameChange: (game) => {
          if (this.syncedGameId !== gameId) {
            return;
          }

          runInAction(() => {
            // A Realtime update is newer than any initial fetch still in
            // flight, so prevent that fetch from restoring an older phase.
            this.gameLoadRequestId += 1;
            this.isLoading = false;
            this.currentGame = game;
          });
        },
      });
    }

    this.phaseReactionDisposer = reaction(
      () => ({
        phase: this.currentPhase,
        round: this.currentRound,
        endsAt: this.phaseEndsAt,
      }),
      () => {
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

    this.phaseAdvanceGeneration += 1;
    this.#clearPhaseTimeout();
    this.syncedGameId = null;
  }

  resetGame() {
    this.stopGameSync();
    this.gameLoadRequestId += 1;
    this.currentGame = null;
    this.isLoading = false;
    this.error = null;
  }

  clearScheduledPhaseAdvance() {
    this.phaseAdvanceGeneration += 1;
    this.#clearPhaseTimeout();
  }

  /**
   * Wait until phaseEndsAt (plus a small jitter), then ask the server to
   * advance its idempotent phase state machine.
   */
  #schedulePhaseAdvance() {
    this.#clearPhaseTimeout();

    if (this.error?.source === "advance") {
      this.clearError();
    }

    if (!this.phaseEndsAt || this.currentPhase === GAME_PHASE.FINISHED) {
      return;
    }

    const millisecondsLeft =
      new Date(this.phaseEndsAt).getTime() - Date.now();
    const delay =
      Math.max(0, millisecondsLeft) + Math.random() * ADVANCE_JITTER_MS;
    const phaseIdentity = {
      gameId: this.gameId,
      phase: this.currentPhase,
      round: this.currentRound,
      endsAt: this.phaseEndsAt,
      generation: this.phaseAdvanceGeneration,
    };

    this.phaseTimeoutId = window.setTimeout(() => {
      this.phaseTimeoutId = null;
      void this.advancePhase(phaseIdentity);
    }, delay);
  }

  #isCurrentPhase({ gameId, phase, round, endsAt, generation }) {
    return (
      gameId === this.gameId &&
      gameId === this.syncedGameId &&
      phase === this.currentPhase &&
      round === this.currentRound &&
      endsAt === this.phaseEndsAt &&
      generation === this.phaseAdvanceGeneration
    );
  }

  #schedulePhaseRetry(phaseIdentity, retryAttempt) {
    this.#clearPhaseTimeout();
    this.phaseTimeoutId = window.setTimeout(() => {
      this.phaseTimeoutId = null;
      void this.advancePhase({ ...phaseIdentity, retryAttempt });
    }, ADVANCE_RETRY_MS);
  }

  /**
   * Canonical client entry point for phase advancement. The service remains
   * responsible for deciding whether the deadline was reached and whether
   * another client already advanced the game.
   */
  async advancePhase({
    gameId = this.gameId,
    phase = this.currentPhase,
    round = this.currentRound,
    endsAt = this.phaseEndsAt,
    generation = this.phaseAdvanceGeneration,
    retryAttempt = 0,
  } = {}) {
    const phaseIdentity = { gameId, phase, round, endsAt, generation };
    const advanceKey = `${gameId}:${round}:${phase}:${endsAt}:${generation}`;

    if (
      !gameId ||
      phase === GAME_PHASE.FINISHED ||
      !this.#isCurrentPhase(phaseIdentity) ||
      this.activePhaseAdvanceKeys.has(advanceKey)
    ) {
      return null;
    }

    this.activePhaseAdvanceKeys.add(advanceKey);

    try {
      const result = await this.gameService.advancePhase(gameId);

      if (!this.#isCurrentPhase(phaseIdentity)) {
        return result;
      }

      const serverSaysTooEarly =
        result &&
        result.advanced === false &&
        result.phase === phase;

      if (serverSaysTooEarly) {
        if (retryAttempt < MAX_ADVANCE_RETRIES) {
          this.#schedulePhaseRetry(phaseIdentity, retryAttempt + 1);
        } else {
          this.setServiceError(
            "advance",
            new GameServiceError(
              GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
              "The server did not advance the expired game phase.",
            ),
            "Failed to advance the game phase",
          );
        }
      }

      return result;
    } catch (caughtError) {
      const didReload = await this.loadGameById(gameId);

      if (!didReload || !this.#isCurrentPhase(phaseIdentity)) {
        if (!didReload && this.#isCurrentPhase(phaseIdentity)) {
          this.setServiceError(
            "advance",
            caughtError,
            "Failed to advance the game phase",
          );
        }

        return null;
      }

      const deadlineHasExpired =
        new Date(endsAt).getTime() <= Date.now();

      if (
        deadlineHasExpired &&
        retryAttempt < MAX_ADVANCE_RETRIES
      ) {
        this.#schedulePhaseRetry(phaseIdentity, retryAttempt + 1);
      } else {
        this.setServiceError(
          "advance",
          caughtError,
          "Failed to advance the game phase",
        );
      }

      return null;
    } finally {
      this.activePhaseAdvanceKeys.delete(advanceKey);
    }
  }

  #clearPhaseTimeout() {
    if (this.phaseTimeoutId !== null) {
      window.clearTimeout(this.phaseTimeoutId);
      this.phaseTimeoutId = null;
    }
  }

  async loadGameById(gameId) {
    const requestId = ++this.gameLoadRequestId;
    this.isLoading = true;
    this.error = null;

    try {
      const game = await this.gameService.getGameById(gameId);

      if (requestId === this.gameLoadRequestId) {
        runInAction(() => {
          this.currentGame = game;
        });
      }

      return true;
    } catch (caughtError) {
      if (requestId === this.gameLoadRequestId) {
        this.setServiceError("load", caughtError, "Failed to load the game");
      }

      return false;
    } finally {
      if (requestId === this.gameLoadRequestId) {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  }
}
