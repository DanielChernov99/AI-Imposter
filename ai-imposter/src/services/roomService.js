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
 *
 * createRoom and joinRoom should return:
 *
 * {
 *   room,
 *   player,
 *   players
 * }
 */

export const ROOM_SERVICE_ERRORS = Object.freeze({
  INVALID_NICKNAME: "INVALID_NICKNAME",
  INVALID_CAPACITY: "INVALID_CAPACITY",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ROOM_ALREADY_STARTED: "ROOM_ALREADY_STARTED",
  NICKNAME_TAKEN: "NICKNAME_TAKEN",
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
});

export class RoomServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "RoomServiceError";
    this.code = code;
  }
}
