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

  function findPlayersByRoomId(roomId) {
    return players.filter((player) => player.roomId === roomId);
  }

  function assertRoomWaiting(room, errorMessage) {
    if (room.status !== ROOM_STATUS.WAITING) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_ALREADY_STARTED,
        errorMessage,
      );
    }
  }

  function findPlayerIndexOrThrow({ roomId, playerId }) {
    const playerIndex = players.findIndex(
      (player) => player.id === playerId && player.roomId === roomId,
    );

    if (playerIndex === -1) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.PLAYER_NOT_FOUND,
        `player with id: ${playerId} in roomID: ${roomId} was not found`,
      );
    }

    return playerIndex;
  }

  function validateNickname(nickname) {
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

    return cleanNickname;
  }

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
    const cleanNickname = validateNickname(nickname);

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
      capacity,
      status: ROOM_STATUS.WAITING,
      activeGameId: null,
    };

    const playerId = crypto.randomUUID();

    const player = {
      id: playerId,
      roomId: room.id,
      nickname: cleanNickname,
      avatarUrl: `https://api.dicebear.com/9.x/bottts/svg?seed=${playerId}`,
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

  async function getRoomById(roomId) {
    const room = rooms.find((room) => room.id === roomId);

    if (!room) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND,
        `Could not find room with ID: ${roomId}`,
      );
    }

    return room;
  }

  async function getPlayersByRoomId(roomId) {
    await getRoomById(roomId);

    return findPlayersByRoomId(roomId);
  }

  async function joinRoom({ nickname, roomCode }) {
    const cleanNickname = validateNickname(nickname);
    const cleanRoomCode = typeof roomCode === "string" ? roomCode.trim() : "";

    const room = rooms.find((room) => room.code === cleanRoomCode);

    if (!room) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND,
        `No such room with code ${cleanRoomCode}`,
      );
    }
    assertRoomWaiting(room, "Game already started in this room");

    const roomPlayers = findPlayersByRoomId(room.id);

    if (roomPlayers.length >= room.capacity) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_FULL,
        "This room is full.",
      );
    }
    if (
      roomPlayers.some(
        (player) =>
          player.nickname.toLowerCase() === cleanNickname.toLowerCase(),
      )
    ) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.NICKNAME_TAKEN,
        `${cleanNickname} is already taken`,
      );
    }

    const playerId = crypto.randomUUID();
    const newPlayer = {
      id: playerId,
      roomId: room.id,
      nickname: cleanNickname,
      avatarUrl: `https://api.dicebear.com/9.x/bottts/svg?seed=${playerId}`,
      isReady: false,
    };
    players.push(newPlayer);
    return {
      room,
      player: newPlayer,
      players: [...roomPlayers, newPlayer],
    };
  }

  async function setPlayerReady({ roomId, playerId, isReady }) {
    const room = await getRoomById(roomId);

    assertRoomWaiting(
      room,
      "Cannot change ready state after the game has started",
    );

    if (typeof isReady !== "boolean") {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.INVALID_READY_STATE,
        "The Ready state must be true or false",
      );
    }

    const playerIndex = findPlayerIndexOrThrow({ roomId, playerId });
    players[playerIndex].isReady = isReady;

    return players[playerIndex];
  }

  async function leaveRoom({ roomId, playerId }) {
    await getRoomById(roomId);

    const playerIndex = findPlayerIndexOrThrow({ roomId, playerId });

    const [removedPlayer] = players.splice(playerIndex, 1);

    return removedPlayer;
  }

  async function startGame({ roomId }) {
    const room = await getRoomById(roomId);

    assertRoomWaiting(room, "The game has already started in this room.");

    const roomPlayers = findPlayersByRoomId(roomId);

    if (roomPlayers.length !== room.capacity) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.ROOM_NOT_FULL,
        "The room must be full before the game can start.",
      );
    }

    const areAllPlayersReady = roomPlayers.every(
      (player) => player.isReady === true,
    );

    if (!areAllPlayersReady) {
      throw new RoomServiceError(
        ROOM_SERVICE_ERRORS.PLAYERS_NOT_READY,
        "All players must be ready before the game can start.",
      );
    }

    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Mock game startup is intentionally deferred to the complete Mock gameplay stage.",
    );
  }

  function subscribeToRoom() {
    return () => {};
  }

  return {
    createRoom,
    getRoomById,
    getPlayersByRoomId,
    joinRoom,
    setPlayerReady,
    leaveRoom,
    startGame,
    subscribeToRoom,
  };
}
