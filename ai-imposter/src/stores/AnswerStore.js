import { action, makeObservable, observable, runInAction } from "mobx";

import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "../services/answerService.js";

export default class AnswerStore {
  currentPlayerAnswer = null;
  currentRoundAnswers = [];
  isLoading = false;
  error = null;

  constructor(answerService) {
    this.answerService = answerService;

    makeObservable(this, {
      currentPlayerAnswer: observable,
      currentRoundAnswers: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      submitPlayerAnswer: action,
      loadAnswersByRound: action,
      resetRoundAnswers: action,
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

  async submitPlayerAnswer({
    gameId,
    roundNumber,
    questionId,
    playerId,
    text,
  }) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const answer = await this.answerService.submitPlayerAnswer({
        gameId,
        roundNumber,
        questionId,
        playerId,
        text,
      });

      runInAction(() => {
        this.currentPlayerAnswer = answer;

        if (
          !this.currentRoundAnswers.some(
            (roundAnswer) => roundAnswer.id === answer.id,
          )
        ) {
          this.currentRoundAnswers = [...this.currentRoundAnswers, answer];
        }
      });

      return answer;
    } catch (caughtError) {
      this.setServiceError(
        "submit",
        caughtError,
        "Failed to submit the answer",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadAnswersByRound({ gameId, roundNumber }) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const answers = await this.answerService.getAnswersByRound({
        gameId,
        roundNumber,
      });

      runInAction(() => {
        this.currentRoundAnswers = answers;
      });

      return answers;
    } catch (caughtError) {
      this.setServiceError(
        "loadRound",
        caughtError,
        "Failed to load round answers",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  resetRoundAnswers() {
    this.currentPlayerAnswer = null;
    this.currentRoundAnswers = [];
    this.error = null;
  }
}
