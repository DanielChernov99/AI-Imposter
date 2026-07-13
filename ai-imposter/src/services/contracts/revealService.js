/**
 * Reveal service contract.
 *
 * Every Reveal Service implementation should expose:
 *
 * getRoundResults({ gameId, roundNumber, roomId })
 *   -> {
 *     answers: [{ id, text, isAi, isValid, playerId, voterPlayerIds }],
 *     roundPoints: [{ playerId, nickname, avatarUrl, pointsEarned }],
 *     leaderboard: [{ playerId, nickname, avatarUrl, totalScore, rank }]
 *   }
 */

export const REVEAL_SERVICE_ERRORS = Object.freeze({
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class RevealServiceError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "RevealServiceError";
    this.code = code;
  }
}
