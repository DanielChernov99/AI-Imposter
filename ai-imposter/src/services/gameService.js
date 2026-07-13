/**
 * Game service contract.
 *
 * Every Game Service implementation should expose these async methods:
 *
 * createGame({ roomId, currentQuestionId })
 * getGameById(gameId)
 *
 */

export const GAME_SERVICE_ERRORS = Object.freeze({
  INVALID_ROOM_ID: "INVALID_ROOM_ID",
  INVALID_QUESTION_ID: "INVALID_QUESTION_ID",
  GAME_NOT_FOUND: "GAME_NOT_FOUND",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class GameServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "GameServiceError";
    this.code = code;
  }
}
