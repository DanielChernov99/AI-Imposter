import { supabase } from "./supabaseClient.js";
import {
  GAME_SERVICE_ERRORS,
  GameServiceError,
} from "../contracts/gameService.js";

function mapStanding(entry) {
  return {
    playerId: entry.player_id,
    nickname: entry.nickname,
    avatarUrl: entry.avatar_url,
    totalScore: entry.total_score,
  };
}

function mapGame(dbGame) {
  return {
    id: dbGame.id,
    roomId: dbGame.room_id,
    phase: dbGame.phase,
    currentRound: dbGame.current_round,
    totalRounds: dbGame.total_rounds,
    currentQuestionId: dbGame.current_question_id,
    phaseStartedAt: dbGame.phase_started_at,
    phaseEndsAt: dbGame.phase_ends_at,
    finalStandings: Array.isArray(dbGame.final_standings)
      ? dbGame.final_standings.map(mapStanding)
      : null,
  };
}

function toGameServiceError(error, fallbackMessage) {
  const message = error?.message ?? "";

  if (message.startsWith("GAME_NOT_FOUND")) {
    return new GameServiceError(
      GAME_SERVICE_ERRORS.GAME_NOT_FOUND,
      "Could not find that game.",
    );
  }

  if (message.startsWith("NOT_A_MEMBER")) {
    return new GameServiceError(
      GAME_SERVICE_ERRORS.NOT_A_MEMBER,
      "You are not a member of this game's room.",
    );
  }

  return new GameServiceError(
    GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
    fallbackMessage,
  );
}

async function getGameById(gameId) {
  const { data, error } = await supabase
    .from("games")
    .select()
    .eq("id", gameId)
    .maybeSingle();

  if (error || !data) {
    throw new GameServiceError(
      GAME_SERVICE_ERRORS.GAME_NOT_FOUND,
      `Could not find game with ID: ${gameId}`,
    );
  }

  return mapGame(data);
}

async function advancePhase(gameId) {
  const { data, error } = await supabase.rpc("advance_game_phase", {
    p_game_id: gameId,
  });

  if (error) {
    throw toGameServiceError(error, "Failed to advance the game phase.");
  }

  return data;
}

function subscribeToGame({ gameId, onGameChange }) {
  const channel = supabase
    .channel(`game:${gameId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "games",
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        if (payload.new?.id) {
          onGameChange?.(mapGame(payload.new));
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export default function createSupabaseGameService() {
  return {
    getGameById,
    advancePhase,
    subscribeToGame,
  };
}
