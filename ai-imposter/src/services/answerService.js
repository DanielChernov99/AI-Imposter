/**
 * Answer service contract.
 *
 * Every Answer Service implementation should expose these async methods:
 *
 * submitPlayerAnswer({ gameId, roundNumber, questionId, playerId, text })
 * submitAiAnswer({ gameId, roundNumber, questionId, text })
 * createMissingPlayerAnswer({ gameId, roundNumber, questionId, playerId })
 * getAnswerById(answerId)
 * getAnswersByRound({ gameId, roundNumber })
 * getPlayerAnswerByRound({ gameId, roundNumber, playerId })
 *
 * getPlayerAnswerByRound throws ANSWER_NOT_FOUND when no answer exists.
 */

export const ANSWER_SERVICE_ERRORS = Object.freeze({
  INVALID_GAME_ID: "INVALID_GAME_ID",
  INVALID_ROUND_NUMBER: "INVALID_ROUND_NUMBER",
  INVALID_QUESTION_ID: "INVALID_QUESTION_ID",
  INVALID_PLAYER_ID: "INVALID_PLAYER_ID",
  INVALID_ANSWER_ID: "INVALID_ANSWER_ID",
  INVALID_ANSWER_TEXT: "INVALID_ANSWER_TEXT",
  ANSWER_ALREADY_SUBMITTED: "ANSWER_ALREADY_SUBMITTED",
  AI_ANSWER_ALREADY_EXISTS: "AI_ANSWER_ALREADY_EXISTS",
  ANSWER_NOT_FOUND: "ANSWER_NOT_FOUND",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class AnswerServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "AnswerServiceError";
    this.code = code;
  }
}
