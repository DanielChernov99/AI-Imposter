import { action, makeObservable, observable, runInAction } from "mobx";

import {
  GAME_SERVICE_ERRORS,
  GameServiceError,
} from "../services/gameService.js";

export default class VoteStore {
  votingOptions = [];
  selectedAnswerId = null;
  hasVoted = false;
  submittedVoteAnswerId = null;
  isLoadingOptions = false;
  isSubmitting = false;
  error = null;

  optionsRequestId = 0;
  submissionRequestId = 0;

  constructor(gameService) {
    this.gameService = gameService;

    makeObservable(this, {
      votingOptions: observable,
      selectedAnswerId: observable,
      hasVoted: observable,
      submittedVoteAnswerId: observable,
      isLoadingOptions: observable,
      isSubmitting: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      loadVotingOptions: action,
      selectAnswer: action,
      castVote: action,
      resetForRound: action,
      reset: action,
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

  async loadVotingOptions({ gameId }) {
    if (this.isLoadingOptions || !gameId) {
      return false;
    }

    const requestId = ++this.optionsRequestId;
    this.isLoadingOptions = true;
    this.error = null;

    try {
      const votingOptions = await this.gameService.getVotingAnswers(gameId);

      if (requestId === this.optionsRequestId) {
        runInAction(() => {
          this.votingOptions = votingOptions;
        });
      }

      return true;
    } catch (caughtError) {
      if (requestId === this.optionsRequestId) {
        this.setServiceError(
          "loadVotingOptions",
          caughtError,
          "Failed to load the answers for voting",
        );
      }

      return false;
    } finally {
      if (requestId === this.optionsRequestId) {
        runInAction(() => {
          this.isLoadingOptions = false;
        });
      }
    }
  }

  selectAnswer(answerId) {
    const isVotingOption = this.votingOptions.some(
      (option) => option.id === answerId,
    );

    if (this.hasVoted || this.isSubmitting || !isVotingOption) {
      return false;
    }

    this.selectedAnswerId = answerId;

    return true;
  }

  async castVote({ gameId, roundNumber, voterPlayerId, answerId }) {
    const selectedAnswerId = answerId ?? this.selectedAnswerId;
    const isVotingOption = this.votingOptions.some(
      (option) => option.id === selectedAnswerId,
    );

    if (
      this.isSubmitting ||
      this.hasVoted ||
      !selectedAnswerId ||
      !isVotingOption
    ) {
      return false;
    }

    const requestId = ++this.submissionRequestId;
    this.isSubmitting = true;
    this.error = null;

    try {
      await this.gameService.castVote({
        gameId,
        roundNumber,
        voterPlayerId,
        answerId: selectedAnswerId,
      });

      if (requestId === this.submissionRequestId) {
        runInAction(() => {
          this.selectedAnswerId = selectedAnswerId;
          this.hasVoted = true;
          this.submittedVoteAnswerId = selectedAnswerId;
        });
      }

      return true;
    } catch (caughtError) {
      if (
        caughtError instanceof GameServiceError &&
        caughtError.code === GAME_SERVICE_ERRORS.ALREADY_VOTED
      ) {
        if (requestId === this.submissionRequestId) {
          runInAction(() => {
            // The service confirms that a vote exists, but it does not return
            // which answer was selected in the earlier submission.
            this.selectedAnswerId = null;
            this.hasVoted = true;
            this.submittedVoteAnswerId = null;
          });
        }

        return true;
      }

      if (requestId === this.submissionRequestId) {
        this.setServiceError(
          "castVote",
          caughtError,
          "Failed to cast your vote",
        );
      }

      return false;
    } finally {
      if (requestId === this.submissionRequestId) {
        runInAction(() => {
          this.isSubmitting = false;
        });
      }
    }
  }

  resetForRound() {
    this.optionsRequestId += 1;
    this.submissionRequestId += 1;
    this.votingOptions = [];
    this.selectedAnswerId = null;
    this.hasVoted = false;
    this.submittedVoteAnswerId = null;
    this.isLoadingOptions = false;
    this.isSubmitting = false;
    this.error = null;
  }

  reset() {
    this.resetForRound();
  }
}
