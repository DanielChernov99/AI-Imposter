import { supabase } from "./supabaseClient.js";
import { buildRoundResult } from "../../domain/roundResult.js";
import {
  REVEAL_SERVICE_ERRORS,
  RevealServiceError,
} from "../contracts/revealService.js";

async function getRoundResults({ gameId, roundNumber, roomId }) {
  const [answersResult, votesResult, playersResult] = await Promise.all([
    supabase
      .from("answers")
      .select("id, text, is_ai, is_valid, player_id")
      .eq("game_id", gameId)
      .eq("round_number", roundNumber),
    supabase
      .from("votes")
      .select("answer_id, voter_player_id")
      .eq("game_id", gameId)
      .eq("round_number", roundNumber),
    supabase
      .from("players")
      .select("id, nickname, avatar_url, total_score, joined_at")
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true }),
  ]);

  if (answersResult.error || votesResult.error || playersResult.error) {
    throw new RevealServiceError(
      REVEAL_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to load the round results.",
    );
  }

  const votes = votesResult.data ?? [];

  const roundAnswers = (answersResult.data ?? []).map((answer) => ({
    id: answer.id,
    text: answer.text,
    isAi: answer.is_ai,
    isValid: answer.is_valid,
    playerId: answer.player_id,
    voterPlayerIds: votes
      .filter((vote) => vote.answer_id === answer.id)
      .map((vote) => vote.voter_player_id),
  }));
  const players = (playersResult.data ?? []).map((player) => ({
    id: player.id,
    nickname: player.nickname,
    avatarUrl: player.avatar_url,
    totalScore: player.total_score ?? 0,
    joinedAt: player.joined_at ?? null,
  }));

  return buildRoundResult({ answers: roundAnswers, players });
}

export default function createSupabaseRevealService() {
  return { getRoundResults };
}
