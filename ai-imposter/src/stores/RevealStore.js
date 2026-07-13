import { action, makeObservable, observable, runInAction } from "mobx";

import { MISSING_ANSWER_TEXT } from "../domain/constants.js";
import {
  REVEAL_SERVICE_ERRORS,
  RevealServiceError,
} from "../services/contracts/revealService.js";

function buildRevealAnswerSlots({
  answers,
  humanPlayerCount,
  gameId,
  roundNumber,
}) {
  const validHumanPlayerIds = new Set();
  let hasAiAnswer = false;

  const displayAnswers = answers.filter((answer) => {
    if (answer.isAi) {
      if (hasAiAnswer) {
        return false;
      }

      hasAiAnswer = true;
      return true;
    }

    if (
      answer.isValid !== true ||
      !answer.playerId ||
      validHumanPlayerIds.has(answer.playerId)
    ) {
      return false;
    }

    validHumanPlayerIds.add(answer.playerId);
    return true;
  });
  const missingCount = Math.max(
    0,
    humanPlayerCount - validHumanPlayerIds.size,
  );
  const placeholders = Array.from({ length: missingCount }, (_, index) => ({
    id: `placeholder:${gameId}:${roundNumber}:reveal:${index + 1}`,
    text: MISSING_ANSWER_TEXT,
    isPlaceholder: true,
    isValid: false,
    isAi: false,
    isDisabled: true,
    playerId: null,
    voterPlayerIds: [],
  }));

  return [...displayAnswers, ...placeholders];
}

function collectVotes(roundAnswers) {
  return roundAnswers.flatMap((answer) =>
    (answer.voterPlayerIds ?? []).map((voterPlayerId) => ({
      answerId: answer.id,
      voterPlayerId,
    })),
  );
}

export default class RevealStore {
  roundAnswers = [];
  votes = [];
  roundPoints = [];
  leaderboard = [];
  finalStandings = [];
  isLoading = false;
  error = null;

  revealRequestId = 0;
  activeRevealLoadKey = null;
  loadedRevealKey = null;

  constructor(revealService) {
    this.revealService = revealService;

    makeObservable(this, {
      roundAnswers: observable,
      votes: observable,
      roundPoints: observable,
      leaderboard: observable,
      finalStandings: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      loadRoundReveal: action,
      setFinalStandings: action,
      resetForRound: action,
      reset: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof RevealServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: REVEAL_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  async loadRoundReveal({ gameId, roundNumber, roomId }) {
    const loadKey = `${gameId}:${roundNumber}:reveal`;

    if (
      this.isLoading ||
      !gameId ||
      !roomId ||
      this.activeRevealLoadKey === loadKey ||
      this.loadedRevealKey === loadKey
    ) {
      return false;
    }

    const requestId = ++this.revealRequestId;
    this.activeRevealLoadKey = loadKey;
    this.isLoading = true;
    this.error = null;
    this.roundAnswers = [];
    this.votes = [];
    this.roundPoints = [];
    this.leaderboard = [];

    try {
      const roundResult = await this.revealService.getRoundResults({
        gameId,
        roundNumber,
        roomId,
      });

      if (requestId === this.revealRequestId) {
        const roundAnswers = buildRevealAnswerSlots({
          answers: roundResult.answers,
          humanPlayerCount: roundResult.roundPoints.length,
          gameId,
          roundNumber,
        });

        runInAction(() => {
          this.roundAnswers = roundAnswers;
          this.votes = collectVotes(roundAnswers);
          this.roundPoints = [...roundResult.roundPoints];
          this.leaderboard = [...roundResult.leaderboard];
          this.loadedRevealKey = loadKey;
        });
      }

      return true;
    } catch (caughtError) {
      if (requestId === this.revealRequestId) {
        this.setServiceError(
          "loadRoundReveal",
          caughtError,
          "Failed to load the round results",
        );
      }

      return false;
    } finally {
      if (requestId === this.revealRequestId) {
        runInAction(() => {
          this.activeRevealLoadKey = null;
          this.isLoading = false;
        });
      }
    }
  }

  setFinalStandings(finalStandings) {
    this.finalStandings = Array.isArray(finalStandings)
      ? [...finalStandings]
      : [];
  }

  resetForRound() {
    this.revealRequestId += 1;
    this.activeRevealLoadKey = null;
    this.loadedRevealKey = null;
    this.roundAnswers = [];
    this.votes = [];
    this.roundPoints = [];
    this.isLoading = false;
    this.error = null;
  }

  reset() {
    this.resetForRound();
    this.leaderboard = [];
    this.finalStandings = [];
  }
}
