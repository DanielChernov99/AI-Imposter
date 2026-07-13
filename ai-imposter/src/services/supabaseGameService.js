import { supabase } from "./supabaseClient.js";
import { GAME_SERVICE_ERRORS, GameServiceError } from "./gameService.js";

const UNIQUE_VIOLATION = "23505";

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
    // Scoreboard frozen at the moment the game finished (null until then).
    // Survives players leaving the room afterwards.
    finalStandings: Array.isArray(dbGame.final_standings)
      ? dbGame.final_standings.map(mapStanding)
      : null,
  };
}

function toGameServiceError(error, fallbackCode, fallbackMessage) {
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

  if (message.startsWith("NOT_VOTING_PHASE")) {
    return new GameServiceError(
      GAME_SERVICE_ERRORS.WRONG_PHASE,
      "This action is not available in the current phase.",
    );
  }

  // check_vote_validity trigger errors (self-vote / invalid answer)
  if (
    message.includes("Cannot vote for your own answer") ||
    message.includes("Cannot vote for an invalid answer")
  ) {
    return new GameServiceError(
      GAME_SERVICE_ERRORS.INVALID_VOTE,
      "That vote is not allowed.",
    );
  }

  return new GameServiceError(fallbackCode, fallbackMessage);
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

/**
 * Asks the server to advance the game's phase state machine. Idempotent:
 * before phase_ends_at (or when another client already advanced) the server
 * answers { advanced: false } and changes nothing.
 */
async function advancePhase(gameId) {
  const { data, error } = await supabase.rpc("advance_game_phase", {
    p_game_id: gameId,
  });

  if (error) {
    throw toGameServiceError(
      error,
      GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to advance the game phase.",
    );
  }

  return data; // { phase, round, advanced }
}

async function submitAnswer({ gameId, roundNumber, questionId, playerId, text }) {
  const cleanText = typeof text === "string" ? text.trim() : "";

  if (!cleanText) {
    throw new GameServiceError(
      GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Answer text must be a non-empty string.",
    );
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({
      game_id: gameId,
      round_number: roundNumber,
      question_id: questionId,
      player_id: playerId,
      text: cleanText,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED,
        "You already submitted an answer this round.",
      );
    }

    throw toGameServiceError(
      error,
      GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to submit your answer.",
    );
  }

  return { id: data.id, text: cleanText };
}

/**
 * The current round's answers for the voting screen: [{ id, text }] only,
 * shuffled server-side with the same order for every player. Never exposes
 * is_ai / player_id (that's the whole game).
 */
async function getVotingAnswers(gameId) {
  const { data, error } = await supabase.rpc("get_voting_answers", {
    p_game_id: gameId,
  });

  if (error) {
    throw toGameServiceError(
      error,
      GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to load the answers for voting.",
    );
  }

  return (data ?? []).map((row) => ({
    id: row.answer_id,
    text: row.answer_text,
  }));
}

async function castVote({ gameId, roundNumber, voterPlayerId, answerId }) {
  const { error } = await supabase.from("votes").insert({
    game_id: gameId,
    round_number: roundNumber,
    voter_player_id: voterPlayerId,
    answer_id: answerId,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new GameServiceError(
        GAME_SERVICE_ERRORS.ALREADY_VOTED,
        "You already voted this round.",
      );
    }

    throw toGameServiceError(
      error,
      GAME_SERVICE_ERRORS.INVALID_VOTE,
      "Failed to cast your vote.",
    );
  }

  return true;
}

/**
 * Full reveal data for a round. Only readable once the round is in reveal
 * (RLS enforces this — earlier calls return an empty list, not an error).
 */
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
    throw toGameServiceError(
      answersResult.error ?? votesResult.error,
      GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
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

/**
 * Realtime updates for one game row. Returns an unsubscribe function.
 */
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
    submitAnswer,
    getVotingAnswers,
    castVote,
    getRoundResults,
    subscribeToGame,
  };
}
