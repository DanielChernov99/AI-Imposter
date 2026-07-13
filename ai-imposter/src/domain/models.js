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
 * @property {"waiting" | "in_game"} status
 * @property {string | null} activeGameId
 */

/**
 * One five-round game session belonging to a room.
 *
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} roomId
 * @property {"answering" | "voting" | "reveal" | "finished"} phase
 * @property {number} currentRound
 * @property {number} totalRounds
 * @property {string | null} currentQuestionId
 */

export function createGame({ id, roomId }) {
  return {
    id,
    roomId,
    phase: GAME_PHASE.ANSWERING,
    currentRound: 1,
    totalRounds: TOTAL_ROUNDS,
    currentQuestionId: null,
  };
}
