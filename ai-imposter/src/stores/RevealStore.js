import { action, makeObservable, observable, runInAction } from "mobx";

import {
  REVEAL_SERVICE_ERRORS,
  RevealServiceError,
} from "../services/contracts/revealService.js";

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
    if (this.isLoading || !gameId || !roomId) {
      return false;
    }

    const requestId = ++this.revealRequestId;
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
        runInAction(() => {
          this.roundAnswers = [...roundResult.answers];
          this.votes = collectVotes(roundResult.answers);
          this.roundPoints = [...roundResult.roundPoints];
          this.leaderboard = [...roundResult.leaderboard];
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
    this.roundAnswers = [];
    this.votes = [];
    this.roundPoints = [];
    this.leaderboard = [];
    this.isLoading = false;
    this.error = null;
  }

  reset() {
    this.resetForRound();
    this.finalStandings = [];
  }
}
