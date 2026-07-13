/**
 * Room service contract.
 *
 * Every Room Service implementation should expose these async methods:
 *
 * createRoom({ nickname, capacity })
 * joinRoom({ nickname, roomCode })
 * getRoomById(roomId)
 * getPlayersByRoomId(roomId)
 * setPlayerReady({ roomId, playerId, isReady })
 * cancelGameCountdown({ roomId, playerId }) -> { room, player }
 * leaveRoom({ roomId, playerId })
 * startGame({ roomId, totalRounds? }) -> { gameId }
 *   With Supabase this calls the start_game RPC: the server creates the
 *   game in its countdown phase and flips rooms.status to "countdown".
 * subscribeToRoom({ roomId, onPlayersChange, onRoomChange }) -> unsubscribe
 *
 */

export const ROOM_SERVICE_ERRORS = Object.freeze({
  INVALID_NICKNAME: "INVALID_NICKNAME",
  INVALID_CAPACITY: "INVALID_CAPACITY",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ROOM_NOT_FULL: "ROOM_NOT_FULL",
  ROOM_ALREADY_STARTED: "ROOM_ALREADY_STARTED",
  PLAYERS_NOT_READY: "PLAYERS_NOT_READY",
  NICKNAME_TAKEN: "NICKNAME_TAKEN",
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
  INVALID_READY_STATE: "INVALID_READY_STATE",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INVALID_GAME_ID: "INVALID_GAME_ID",
});

export class RoomServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "RoomServiceError";
    this.code = code;
  }
}
