import { action, makeObservable, observable, runInAction } from "mobx";

import {
  QUESTION_SERVICE_ERRORS,
  QuestionServiceError,
} from "../services/questionService.js";

export default class QuestionStore {
  currentQuestion = null;
  usedQuestionIds = [];
  isLoading = false;
  error = null;

  constructor(questionService) {
    this.questionService = questionService;

    makeObservable(this, {
      currentQuestion: observable,
      usedQuestionIds: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      loadQuestionById: action,
      loadRandomQuestion: action,
      resetQuestions: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof QuestionServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: QUESTION_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  async loadQuestionById(questionId) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const question = await this.questionService.getQuestionById(questionId);

      runInAction(() => {
        this.currentQuestion = question;

        if (!this.usedQuestionIds.includes(question.id)) {
          this.usedQuestionIds = [...this.usedQuestionIds, question.id];
        }
      });

      return question;
    } catch (caughtError) {
      this.setServiceError(
        "loadById",
        caughtError,
        "Failed to load the question",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadRandomQuestion() {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const question = await this.questionService.getRandomQuestion({
        excludedQuestionIds: this.usedQuestionIds,
      });

      runInAction(() => {
        this.currentQuestion = question;
        this.usedQuestionIds = [...this.usedQuestionIds, question.id];
      });

      return question;
    } catch (caughtError) {
      this.setServiceError(
        "loadRandom",
        caughtError,
        "Failed to load a random question",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  resetQuestions() {
    this.currentQuestion = null;
    this.usedQuestionIds = [];
    this.error = null;
  }
}
