import {
  MAX_NICKNAME_LENGTH,
  MAX_PLAYERS,
  MIN_NICKNAME_LENGTH,
  MIN_PLAYERS,
  ROOM_CODE_LENGTH,
  ROOM_STATUS,
} from "../domain/constants.js";

import { ROOM_SERVICE_ERRORS, RoomServiceError } from "./roomService.js";

export default function createMockRoomService() {
  const rooms = [];
  const players = [];

  function generateRoomCode() {
    let roomCode;

    do {
      roomCode = "";

      for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
        roomCode += Math.floor(Math.random() * 10);
      }
    } while (rooms.some((room) => room.code === roomCode));

    return roomCode;
  }

  async function createRoom({ nickname, capacity }) {
    const cleanNickname = typeof nickname === "string" ? nickname.trim() : "";

    if (
      cleanNickname.length < MIN_NICKNAME_LENGTH ||
      cleanNickname.length > MAX_NICKNAME_LENGTH
    ) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.INVALID_NICKNAME,
        `Nickname must be between ${MIN_NICKNAME_LENGTH} and ${MAX_NICKNAME_LENGTH} characters.`,
      );
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < MIN_PLAYERS ||
      capacity > MAX_PLAYERS
    ) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.INVALID_CAPACITY,
        `Capacity must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}.`,
      );
    }

    const room = {
      id: crypto.randomUUID(),
      code: generateRoomCode(),
      capacity: capacity,
      status: ROOM_STATUS.WAITING,
      activeGameId: null,
    };

    const player = {
      id: crypto.randomUUID(),
      roomID: room.id,
      nickname: cleanNickname,
      avatarUrl: `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(
        cleanNickname,
      )}`,
      isReady: false,
    };

    rooms.push(room);
    players.push(player);

    return {
      room,
      player,
      players: [player],
    };
  }

  async function getRoomById(roomID) {
    const room = rooms.find((room) => room.id === roomID);
    if (!room) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND,
        `Couldnt find room with this id : ${rommId}`,
      );
    }
    return room;
  }

  async function getPlayersByRoomId(roomID) {
    const room = await getRoomById(roomID);
    return players.filter((player) => player.roomID === roomID);
  }

  return {
    createRoom,
    getRoomById,
    getPlayersByRoomId,
  };
}
