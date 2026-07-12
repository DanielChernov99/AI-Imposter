import { createGame as createGameSession } from "../domain/models.js";
import { GAME_SERVICE_ERRORS, GameServiceError } from "./gameService.js";

export default function createMockGameService() {
  const games = [];

  async function createGame({ roomId }) {
    const cleanRoomId = typeof roomId === "string" ? roomId.trim() : "";

    if (!cleanRoomId) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.INVALID_ROOM_ID,
        "Room ID must be a non-empty string.",
      );
    }

    const game = createGameSession({
      id: crypto.randomUUID(),
      roomId: cleanRoomId,
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

  return {
    createGame,
    getGameById,
  };
}
