import { supabase } from "./supabaseClient.js";
import { VOTE_SERVICE_ERRORS, VoteServiceError } from "./voteService.js";

const UNIQUE_VIOLATION = "23505";

function toVoteServiceError(error, fallbackCode, fallbackMessage) {
  const message = error?.message ?? "";

  if (message.startsWith("NOT_A_MEMBER")) {
    return new VoteServiceError(
      VOTE_SERVICE_ERRORS.NOT_A_MEMBER,
      "You are not a member of this game's room.",
    );
  }

  if (message.startsWith("NOT_VOTING_PHASE")) {
    return new VoteServiceError(
      VOTE_SERVICE_ERRORS.WRONG_PHASE,
      "This action is not available in the current phase.",
    );
  }

  if (message.includes("Cannot vote for your own answer")) {
    return new VoteServiceError(
      VOTE_SERVICE_ERRORS.CANNOT_VOTE_FOR_OWN_ANSWER,
      "Cannot vote for your own answer.",
    );
  }

  if (message.includes("Cannot vote for an invalid answer")) {
    return new VoteServiceError(
      VOTE_SERVICE_ERRORS.CANNOT_VOTE_FOR_INVALID_ANSWER,
      "Cannot vote for an invalid answer.",
    );
  }

  return new VoteServiceError(fallbackCode, fallbackMessage);
}

async function getVotingAnswers({ gameId }) {
  const { data, error } = await supabase.rpc("get_voting_answers", {
    p_game_id: gameId,
  });

  if (error) {
    throw toVoteServiceError(
      error,
      VOTE_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to load the answers for voting.",
    );
  }

  return (data ?? []).map((row) => ({
    id: row.answer_id,
    text: row.answer_text,
  }));
}

async function submitVote({
  gameId,
  roundNumber,
  voterPlayerId,
  answerId,
}) {
  const { error } = await supabase.from("votes").insert({
    game_id: gameId,
    round_number: roundNumber,
    voter_player_id: voterPlayerId,
    answer_id: answerId,
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.VOTE_ALREADY_SUBMITTED,
        "You already voted this round.",
      );
    }

    throw toVoteServiceError(
      error,
      VOTE_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to cast your vote.",
    );
  }

  return true;
}

export default function createSupabaseVoteService() {
  return { getVotingAnswers, submitVote };
}
