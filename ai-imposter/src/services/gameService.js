/**
 * Game service contract.
 *
 * Every Game Service implementation should expose these async methods:
 *
 * getGameById(gameId)
 * advancePhase(gameId)
 *   -> { phase, round, advanced } — idempotent; safe to call from every
 *      client when a phase timer expires (server no-ops if it's too early
 *      or someone else advanced first).
 * submitAnswer({ gameId, roundNumber, questionId, playerId, text })
 * getVotingAnswers(gameId)
 *   -> [{ id, text }] — current round's answers, shuffled server-side,
 *      without any hint of which one is the AI's.
 * castVote({ gameId, roundNumber, voterPlayerId, answerId })
 * getRoundResults({ gameId, roundNumber })
 *   -> [{ id, text, isAi, isValid, playerId, voterPlayerIds }]
 * subscribeToGame({ gameId, onGameChange }) -> unsubscribe  (optional,
 *   Realtime-only)
 *
 * (createGame was removed from the contract: with Supabase, games are
 * created server-side by the start_game RPC — see roomService.startGame.
 * mockGameService still has it for legacy reasons.)
 */

export const GAME_SERVICE_ERRORS = Object.freeze({
  INVALID_ROOM_ID: "INVALID_ROOM_ID",
  INVALID_GAME_ID: "INVALID_GAME_ID",
  INVALID_QUESTION_ID: "INVALID_QUESTION_ID",
  INVALID_GAME_PHASE: "INVALID_GAME_PHASE",
  INVALID_PHASE_TRANSITION: "INVALID_PHASE_TRANSITION",
  GAME_NOT_FOUND: "GAME_NOT_FOUND",
  NOT_A_MEMBER: "NOT_A_MEMBER",
  ANSWER_ALREADY_SUBMITTED: "ANSWER_ALREADY_SUBMITTED",
  ALREADY_VOTED: "ALREADY_VOTED",
  INVALID_VOTE: "INVALID_VOTE",
  WRONG_PHASE: "WRONG_PHASE",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class GameServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "GameServiceError";
    this.code = code;
  }
}
