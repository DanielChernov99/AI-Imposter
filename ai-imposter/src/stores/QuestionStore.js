import { action, makeObservable, observable, runInAction } from "mobx";

import {
  QUESTION_SERVICE_ERRORS,
  QuestionServiceError,
} from "../services/contracts/questionService.js";

function toDisplayQuestion(question) {
  return {
    id: question.id,
    text: question.text,
  };
}

export default class QuestionStore {
  currentQuestion = null;
  usedQuestionIds = [];
  isLoading = false;
  error = null;

  questionRequestId = 0;

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
    const requestId = ++this.questionRequestId;
    this.isLoading = true;
    this.error = null;

    try {
      const question = toDisplayQuestion(
        await this.questionService.getQuestionById(questionId),
      );

      if (requestId === this.questionRequestId) {
        runInAction(() => {
          this.currentQuestion = question;

          if (!this.usedQuestionIds.includes(question.id)) {
            this.usedQuestionIds = [...this.usedQuestionIds, question.id];
          }
        });
      }

      return question;
    } catch (caughtError) {
      if (requestId === this.questionRequestId) {
        this.setServiceError(
          "loadById",
          caughtError,
          "Failed to load the question",
        );
      }

      return null;
    } finally {
      if (requestId === this.questionRequestId) {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  }

  async loadRandomQuestion() {
    const requestId = ++this.questionRequestId;
    this.isLoading = true;
    this.error = null;

    try {
      const question = toDisplayQuestion(
        await this.questionService.getRandomQuestion({
          excludedQuestionIds: this.usedQuestionIds,
        }),
      );

      if (requestId === this.questionRequestId) {
        runInAction(() => {
          this.currentQuestion = question;
          this.usedQuestionIds = [...this.usedQuestionIds, question.id];
        });
      }

      return question;
    } catch (caughtError) {
      if (requestId === this.questionRequestId) {
        this.setServiceError(
          "loadRandom",
          caughtError,
          "Failed to load a random question",
        );
      }

      return null;
    } finally {
      if (requestId === this.questionRequestId) {
        runInAction(() => {
          this.isLoading = false;
        });
      }
    }
  }

  resetQuestions() {
    this.questionRequestId += 1;
    this.currentQuestion = null;
    this.usedQuestionIds = [];
    this.isLoading = false;
    this.error = null;
  }
}
