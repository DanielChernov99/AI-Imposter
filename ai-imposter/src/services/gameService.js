/**
 * Game service contract.
 *
 * Every Game Service implementation should expose these async methods:
 *
 * createGame({ roomId, currentQuestionId })
 * getGameById(gameId)
 * transitionGamePhase({ gameId, expectedPhase, nextPhase })
 *
 */

export const GAME_SERVICE_ERRORS = Object.freeze({
  INVALID_ROOM_ID: "INVALID_ROOM_ID",
  INVALID_GAME_ID: "INVALID_GAME_ID",
  INVALID_QUESTION_ID: "INVALID_QUESTION_ID",
  INVALID_GAME_PHASE: "INVALID_GAME_PHASE",
  INVALID_PHASE_TRANSITION: "INVALID_PHASE_TRANSITION",
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
