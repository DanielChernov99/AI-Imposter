import { supabase } from "./supabaseClient.js";
import {
  REVEAL_SERVICE_ERRORS,
  RevealServiceError,
} from "./revealService.js";

async function getRoundResults({ gameId, roundNumber }) {
  const [answersResult, votesResult] = await Promise.all([
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
  ]);

  if (answersResult.error || votesResult.error) {
    throw new RevealServiceError(
      REVEAL_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to load the round results.",
    );
  }

  const votes = votesResult.data ?? [];

  return (answersResult.data ?? []).map((answer) => ({
    id: answer.id,
    text: answer.text,
    isAi: answer.is_ai,
    isValid: answer.is_valid,
    playerId: answer.player_id,
    voterPlayerIds: votes
      .filter((vote) => vote.answer_id === answer.id)
      .map((vote) => vote.voter_player_id),
  }));
}

export default function createSupabaseRevealService() {
  return { getRoundResults };
}
