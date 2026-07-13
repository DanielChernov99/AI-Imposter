import { action, makeObservable, observable, runInAction } from "mobx";

import {
  VOTE_SERVICE_ERRORS,
  VoteServiceError,
} from "../services/voteService.js";

export default class VoteStore {
  currentPlayerVote = null;
  currentRoundVotes = [];
  isLoading = false;
  error = null;

  constructor(voteService) {
    this.voteService = voteService;

    makeObservable(this, {
      currentPlayerVote: observable,
      currentRoundVotes: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      submitVote: action,
      loadVotesByRound: action,
      resetRoundVotes: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof VoteServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: VOTE_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  async submitVote({ gameId, roundNumber, voterPlayerId, answerId }) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const vote = await this.voteService.submitVote({
        gameId,
        roundNumber,
        voterPlayerId,
        answerId,
      });

      runInAction(() => {
        this.currentPlayerVote = vote;

        if (
          !this.currentRoundVotes.some(
            (roundVote) => roundVote.id === vote.id,
          )
        ) {
          this.currentRoundVotes = [...this.currentRoundVotes, vote];
        }
      });

      return vote;
    } catch (caughtError) {
      this.setServiceError("submit", caughtError, "Failed to submit the vote");

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadVotesByRound({ gameId, roundNumber }) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const votes = await this.voteService.getVotesByRound({
        gameId,
        roundNumber,
      });

      runInAction(() => {
        this.currentRoundVotes = votes;
      });

      return votes;
    } catch (caughtError) {
      this.setServiceError(
        "loadRound",
        caughtError,
        "Failed to load round votes",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  resetRoundVotes() {
    this.currentPlayerVote = null;
    this.currentRoundVotes = [];
    this.error = null;
  }
}
