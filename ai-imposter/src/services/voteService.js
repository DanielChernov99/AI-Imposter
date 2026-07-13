/**
 * Vote service contract.
 *
 * Every Vote Service implementation should expose these async methods:
 *
 * submitVote({ gameId, roundNumber, voterPlayerId, answerId })
 * getVotesByRound({ gameId, roundNumber })
 * getPlayerVoteByRound({ gameId, roundNumber, voterPlayerId })
 *
 * getPlayerVoteByRound returns null when no vote exists.
 */

export const VOTE_SERVICE_ERRORS = Object.freeze({
  INVALID_GAME_ID: "INVALID_GAME_ID",
  INVALID_ROUND_NUMBER: "INVALID_ROUND_NUMBER",
  INVALID_PLAYER_ID: "INVALID_PLAYER_ID",
  INVALID_ANSWER_ID: "INVALID_ANSWER_ID",
  ANSWER_NOT_FOUND: "ANSWER_NOT_FOUND",
  CANNOT_VOTE_FOR_OWN_ANSWER: "CANNOT_VOTE_FOR_OWN_ANSWER",
  CANNOT_VOTE_FOR_INVALID_ANSWER: "CANNOT_VOTE_FOR_INVALID_ANSWER",
  VOTE_ALREADY_SUBMITTED: "VOTE_ALREADY_SUBMITTED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class VoteServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "VoteServiceError";
    this.code = code;
  }
}
