/**
 * A player currently connected to a room.
 *
 * @typedef {Object} Player
 * @property {string} id
 * @property {string} roomId
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

export {};
