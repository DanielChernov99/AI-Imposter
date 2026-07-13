import { GAME_PHASE, TOTAL_ROUNDS } from "./constants.js";

/**
 * A player currently connected to a room.
 *
 * @typedef {Object} Player
 * @property {string} id
 * @property {string} roomID
 * @property {string} nickname
 * @property {string} avatarUrl
 * @property {boolean} isReady
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
 * @property {string} status - One of the ROOM_STATUS values.
 * @property {string | null} activeGameId
 */

/**
 * One game session belonging to a room.
 *
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} roomId
 * @property {string} phase - One of the GAME_PHASE values.
 * @property {number} currentRound
 * @property {number} totalRounds
 * @property {string} currentQuestionId
 */

/**
 * A question and its prepared AI answer.
 *
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {string} aiAnswer
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

export function createGame({ id, roomId, currentQuestionId }) {
  return {
    id,
    roomId,
    phase: GAME_PHASE.ANSWERING,
    currentRound: 1,
    totalRounds: TOTAL_ROUNDS,
    currentQuestionId,
  };
}
