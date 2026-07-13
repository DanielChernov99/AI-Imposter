import { createGame as createGameSession } from "../domain/models.js";
import { GAME_PHASE } from "../domain/constants.js";
import { GAME_SERVICE_ERRORS, GameServiceError } from "./gameService.js";

export default function createMockGameService() {
  const games = [];

  async function createGame({ roomId, currentQuestionId }) {
    const cleanRoomId = typeof roomId === "string" ? roomId.trim() : "";
    const cleanQuestionId =
      typeof currentQuestionId === "string" ? currentQuestionId.trim() : "";

    if (!cleanRoomId) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_ROOM_ID,
        "Room ID must be a non-empty string.",
      );
    }

    if (!cleanQuestionId) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_QUESTION_ID,
        "Question ID must be a non-empty string.",
      );
    }

    const game = createGameSession({
      id: crypto.randomUUID(),
      roomId: cleanRoomId,
      currentQuestionId: cleanQuestionId,
    });

    games.push(game);

    return game;
  }

  async function getGameById(gameId) {
    const game = games.find((game) => game.id === gameId);

    if (!game) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.GAME_NOT_FOUND,
        `Could not find game with ID: ${gameId}`,
      );
    }

    return game;
  }

  async function transitionGamePhase({ gameId, expectedPhase, nextPhase }) {
    const cleanGameId = typeof gameId === "string" ? gameId.trim() : "";

    if (!cleanGameId) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_GAME_ID,
        "Game ID must be a non-empty string.",
      );
    }

    const gamePhases = Object.values(GAME_PHASE);

    if (
      !gamePhases.includes(expectedPhase) ||
      !gamePhases.includes(nextPhase)
    ) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_GAME_PHASE,
        "Expected phase and next phase must be valid game phases.",
      );
    }

    const isSupportedTransition =
      (expectedPhase === GAME_PHASE.ANSWERING &&
        nextPhase === GAME_PHASE.VOTING) ||
      (expectedPhase === GAME_PHASE.VOTING &&
        nextPhase === GAME_PHASE.REVEAL);

    if (!isSupportedTransition) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_PHASE_TRANSITION,
        "This game phase transition is not supported.",
      );
    }

    const game = games.find((game) => game.id === cleanGameId);

    if (!game) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.GAME_NOT_FOUND,
        `Could not find game with ID: ${cleanGameId}`,
      );
    }

    if (game.phase === nextPhase) {
      return game;
    }

    if (game.phase !== expectedPhase) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_PHASE_TRANSITION,
        "The game is not in the expected phase.",
      );
    }

    game.phase = nextPhase;

    return game;
  }

  return {
    createGame,
    getGameById,
    transitionGamePhase,
  };
}
