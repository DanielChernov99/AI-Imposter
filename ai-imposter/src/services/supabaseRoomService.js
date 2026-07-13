import { supabase, ensureAnonymousSession } from "./supabaseClient.js";
import {
  MAX_NICKNAME_LENGTH,
  MAX_PLAYERS,
  MIN_NICKNAME_LENGTH,
  MIN_PLAYERS,
  ROOM_CODE_LENGTH,
  ROOM_STATUS,
} from "../domain/constants.js";
import { ROOM_SERVICE_ERRORS, RoomServiceError } from "./roomService.js";

const UNIQUE_VIOLATION = "23505";
const MAX_ROOM_CODE_ATTEMPTS = 5;

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

function validateCapacity(capacity) {
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
}

function generateRoomCode() {
  let code = "";

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += Math.floor(Math.random() * 10);
  }

  return code;
}

function mapRoom(dbRoom) {
  return {
    id: dbRoom.id,
    code: dbRoom.code,
    capacity: dbRoom.max_players,
    status: dbRoom.status,
    activeGameId: dbRoom.active_game_id,
  };
}

function mapPlayer(dbPlayer) {
  return {
    id: dbPlayer.id,
    roomId: dbPlayer.room_id,
    nickname: dbPlayer.nickname,
    avatarUrl: dbPlayer.avatar_url,
    isReady: dbPlayer.is_ready,
  };
}

function avatarUrlFor(playerId) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${playerId}`;
}

/**
 * Translates a Postgres/PostgREST error into a RoomServiceError. The
 * `players_enforce_join_rules` trigger (see migration 006) raises plain
 * exceptions prefixed with a known code, which we recognize by message
 * prefix; genuine unique-constraint violations are recognized by SQLSTATE.
 */
function toRoomServiceError(error, fallbackMessage) {
  const message = error?.message ?? "";

  if (error?.code === UNIQUE_VIOLATION && message.includes("players_room_nickname_unique")) {
    return new RoomServiceError(
      ROOM_SERVICE_ERRORS.NICKNAME_TAKEN,
      "That nickname is already taken in this room.",
    );
  }

  if (message.startsWith("ROOM_FULL")) {
    return new RoomServiceError(ROOM_SERVICE_ERRORS.ROOM_FULL, "This room is full.");
  }

  if (message.startsWith("ROOM_ALREADY_STARTED")) {
    return new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_ALREADY_STARTED,
      "Game already started in this room.",
    );
  }

  if (message.startsWith("ROOM_NOT_FOUND")) {
    return new RoomServiceError(ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND, "Could not find that room.");
  }

  if (message.startsWith("PLAYERS_NOT_READY")) {
    return new RoomServiceError(
      ROOM_SERVICE_ERRORS.PLAYERS_NOT_READY,
      "All players must be ready before the game can start.",
    );
  }

  if (message.startsWith("NOT_ENOUGH_PLAYERS")) {
    return new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_NOT_FULL,
      "Not enough players to start the game.",
    );
  }

  if (message.startsWith("NOT_A_MEMBER")) {
    return new RoomServiceError(
      ROOM_SERVICE_ERRORS.PLAYER_NOT_FOUND,
      "You are not a member of this room.",
    );
  }

  return new RoomServiceError(ROOM_SERVICE_ERRORS.UNKNOWN_ERROR, fallbackMessage);
}

async function insertRoomWithUniqueCode(capacity) {
  for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from("rooms")
      .insert({ code: generateRoomCode(), max_players: capacity })
      .select()
      .single();

    if (!error) {
      return data;
    }

    const isCodeCollision =
      error.code === UNIQUE_VIOLATION && error.message?.includes("rooms_code_active_unique");

    if (!isCodeCollision) {
      throw toRoomServiceError(error, "Failed to create room.");
    }
    // otherwise loop and try a new code
  }

  throw new RoomServiceError(
    ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
    "Could not generate a unique room code. Please try again.",
  );
}

async function insertPlayer({ roomId, authUserId, nickname, fallbackMessage }) {
  const playerId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("players")
    .insert({
      id: playerId,
      room_id: roomId,
      auth_user_id: authUserId,
      nickname,
      avatar_url: avatarUrlFor(playerId),
    })
    .select()
    .single();

  if (error) {
    throw toRoomServiceError(error, fallbackMessage);
  }

  return data;
}

async function createRoom({ nickname, capacity }) {
  const cleanNickname = validateNickname(nickname);
  validateCapacity(capacity);

  const authUserId = await ensureAnonymousSession();

  const room = await insertRoomWithUniqueCode(capacity);

  let player;
  try {
    player = await insertPlayer({
      roomId: room.id,
      authUserId,
      nickname: cleanNickname,
      fallbackMessage: "Failed to create room.",
    });
  } catch (playerError) {
    // Best-effort cleanup so we don't leave an empty, orphaned room behind.
    await supabase.from("rooms").delete().eq("id", room.id);
    throw playerError;
  }

  const mappedPlayer = mapPlayer(player);

  return {
    room: mapRoom(room),
    player: mappedPlayer,
    players: [mappedPlayer],
  };
}

async function getRoomById(roomId) {
  const { data, error } = await supabase
    .from("rooms")
    .select()
    .eq("id", roomId)
    .maybeSingle();

  if (error || !data) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND,
      `Could not find room with ID: ${roomId}`,
    );
  }

  return mapRoom(data);
}

async function getPlayersByRoomId(roomId) {
  await getRoomById(roomId);

  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (error) {
    throw toRoomServiceError(error, "Failed to load players.");
  }

  return data.map(mapPlayer);
}

async function joinRoom({ nickname, roomCode }) {
  const cleanNickname = validateNickname(nickname);
  const cleanRoomCode = typeof roomCode === "string" ? roomCode.trim() : "";

  const authUserId = await ensureAnonymousSession();

  const { data: roomRow, error: roomError } = await supabase
    .from("rooms")
    .select()
    .eq("code", cleanRoomCode)
    .maybeSingle();

  if (roomError || !roomRow) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_NOT_FOUND,
      `No such room with code ${cleanRoomCode}`,
    );
  }

  if (roomRow.status !== ROOM_STATUS.WAITING) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_ALREADY_STARTED,
      "Game already started in this room.",
    );
  }

  const player = await insertPlayer({
    roomId: roomRow.id,
    authUserId,
    nickname: cleanNickname,
    fallbackMessage: "Failed to join room.",
  });

  const players = await getPlayersByRoomId(roomRow.id);

  return {
    room: mapRoom(roomRow),
    player: mapPlayer(player),
    players,
  };
}

async function setPlayerReady({ roomId, playerId, isReady }) {
  if (typeof isReady !== "boolean") {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.INVALID_READY_STATE,
      "The Ready state must be true or false",
    );
  }

  const room = await getRoomById(roomId);

  if (room.status !== ROOM_STATUS.WAITING) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.ROOM_ALREADY_STARTED,
      "Cannot change ready state after the game has started",
    );
  }

  const { data, error } = await supabase
    .from("players")
    .update({ is_ready: isReady })
    .eq("id", playerId)
    .eq("room_id", roomId)
    .select()
    .maybeSingle();

  if (error || !data) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.PLAYER_NOT_FOUND,
      `player with id: ${playerId} in roomID: ${roomId} was not found`,
    );
  }

  return mapPlayer(data);
}

async function leaveRoom({ roomId, playerId }) {
  const { data, error } = await supabase
    .from("players")
    .delete()
    .eq("id", playerId)
    .eq("room_id", roomId)
    .select()
    .maybeSingle();

  if (error || !data) {
    throw new RoomServiceError(
      ROOM_SERVICE_ERRORS.PLAYER_NOT_FOUND,
      `player with id: ${playerId} in roomID: ${roomId} was not found`,
    );
  }

  return mapPlayer(data);
}

/**
 * Starts the game via the start_game RPC. The server validates everything
 * atomically (room is waiting, caller is a member, >= 2 players, everyone
 * ready), creates the game in its countdown phase and flips rooms.status
 * to "countdown" — which reaches all clients through Realtime.
 *
 * @returns {Promise<{gameId: string}>}
 */
async function startGame({ roomId, totalRounds } = {}) {
  const params = { p_room_id: roomId };

  if (Number.isInteger(totalRounds) && totalRounds > 0) {
    params.p_total_rounds = totalRounds;
  }

  const { data, error } = await supabase.rpc("start_game", params);

  if (error) {
    throw toRoomServiceError(error, "Failed to start the game.");
  }

  return { gameId: data };
}

/**
 * Opens a Realtime channel for one room: player joins/leaves/ready-state
 * changes, and room status changes. Returns an unsubscribe function.
 *
 * @param {Object} params
 * @param {string} params.roomId
 * @param {(change: {eventType: "INSERT"|"UPDATE"|"DELETE", newPlayer: object|null, oldPlayer: object|null}) => void} [params.onPlayersChange]
 * @param {(room: object) => void} [params.onRoomChange]
 * @returns {() => void} unsubscribe
 */
function subscribeToRoom({ roomId, onPlayersChange, onRoomChange }) {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onPlayersChange?.({
          eventType: payload.eventType,
          newPlayer: payload.new?.id ? mapPlayer(payload.new) : null,
          oldPlayer: payload.old?.id ? mapPlayer(payload.old) : null,
        });
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        if (payload.new?.id) {
          onRoomChange?.(mapRoom(payload.new));
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export default function createSupabaseRoomService() {
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
