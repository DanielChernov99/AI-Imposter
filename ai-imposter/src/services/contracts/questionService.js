/**
 * Question service contract.
 *
 * Every Question Service implementation should expose these async methods:
 *
 * getQuestionById(questionId)
 * getRandomQuestion({ excludedQuestionIds })
 *   -> display-safe Question objects containing only id and text
 *
 */

export const QUESTION_SERVICE_ERRORS = Object.freeze({
  INVALID_QUESTION_ID: "INVALID_QUESTION_ID",
  QUESTION_NOT_FOUND: "QUESTION_NOT_FOUND",
  NO_AVAILABLE_QUESTIONS: "NO_AVAILABLE_QUESTIONS",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class QuestionServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "QuestionServiceError";
    this.code = code;
  }
}
