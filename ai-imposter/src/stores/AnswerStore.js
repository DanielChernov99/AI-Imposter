import { action, makeObservable, observable, runInAction } from "mobx";

import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "../services/answerService.js";

export default class AnswerStore {
  hasSubmittedAnswer = false;
  submittedAnswerId = null;
  isSubmitting = false;
  error = null;

  submissionRequestId = 0;

  constructor(answerService) {
    this.answerService = answerService;

    makeObservable(this, {
      hasSubmittedAnswer: observable,
      submittedAnswerId: observable,
      isSubmitting: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      submitAnswer: action,
      resetForRound: action,
      reset: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof AnswerServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: ANSWER_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  async submitAnswer({ gameId, roundNumber, questionId, playerId, text }) {
    if (this.isSubmitting || this.hasSubmittedAnswer) {
      return false;
    }

    const requestId = ++this.submissionRequestId;
    this.isSubmitting = true;
    this.error = null;

    try {
      const submittedAnswer = await this.answerService.submitPlayerAnswer({
        gameId,
        roundNumber,
        questionId,
        playerId,
        text,
      });

      if (requestId === this.submissionRequestId) {
        runInAction(() => {
          this.hasSubmittedAnswer = true;
          this.submittedAnswerId = submittedAnswer?.id ?? null;
        });
      }

      return true;
    } catch (caughtError) {
      if (
        caughtError instanceof AnswerServiceError &&
        caughtError.code === ANSWER_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED
      ) {
        if (requestId === this.submissionRequestId) {
          runInAction(() => {
            this.hasSubmittedAnswer = true;
          });
        }

        return true;
      }

      if (requestId === this.submissionRequestId) {
        this.setServiceError(
          "submitAnswer",
          caughtError,
          "Failed to submit your answer",
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
    this.submissionRequestId += 1;
    this.hasSubmittedAnswer = false;
    this.submittedAnswerId = null;
    this.isSubmitting = false;
    this.error = null;
  }

  reset() {
    this.resetForRound();
  }
}
