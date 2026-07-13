import { GAME_PHASE, TOTAL_ROUNDS } from "./constants.js";

/**
 * A player currently connected to a room.
 *
 * @typedef {Object} Player
 * @property {string} id
 * @property {string} roomId
 * @property {string} nickname
 * @property {string | null} avatarUrl
 * @property {boolean} isReady
 * @property {number} totalScore
 */

/**
 * A multiplayer room.
 *
 * Players are stored separately and connected through player.roomId.
 *
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} code
 * @property {number} capacity
 * @property {string} status
 * @property {string | null} activeGameId
 */

/**
 * One game session belonging to a room.
 *
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} roomId
 * @property {string} phase
 * @property {number} currentRound
 * @property {number} totalRounds
 * @property {string | null} currentQuestionId
 * @property {string | null} phaseStartedAt
 * @property {string | null} phaseEndsAt
 * @property {Array<Object> | null} finalStandings
 */

/**
 * A display-safe question. Prepared AI-answer data is deliberately excluded.
 *
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 */

/**
 * A player answer submitted during a game round.
 *
 * @typedef {Object} Answer
 * @property {string} id
 * @property {string} gameId
 * @property {number} roundNumber
 * @property {string} questionId
 * @property {string | null} playerId
 * @property {string} text
 * @property {boolean} isValid
 * @property {boolean} isAi
 */

/**
 * A player's vote for an answer during a game round.
 *
 * @typedef {Object} Vote
 * @property {string} id
 * @property {string} gameId
 * @property {number} roundNumber
 * @property {string} voterPlayerId
 * @property {string} answerId
 */

export function createGame({
  id,
  roomId,
  phase = GAME_PHASE.ANSWERING,
  currentRound = 1,
  totalRounds = TOTAL_ROUNDS,
  currentQuestionId = null,
  phaseStartedAt = null,
  phaseEndsAt = null,
  finalStandings = null,
}) {
  return {
    id,
    roomId,
    phase,
    currentRound,
    totalRounds,
    currentQuestionId,
    phaseStartedAt,
    phaseEndsAt,
    finalStandings,
  };
}
