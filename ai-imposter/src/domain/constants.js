export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 5;

export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 16;
export const MAX_ANSWER_LENGTH = 120;

export const ROOM_CODE_LENGTH = 6;

export const GAME_START_COUNTDOWN_SECONDS = 5;
export const ANSWERING_DURATION_SECONDS = 20;
export const VOTING_DURATION_SECONDS = 20;
export const ROUND_RESULTS_DURATION_SECONDS = 10;

export const TOTAL_ROUNDS = 5;

// Values must match the CHECK constraint on rooms.status in the database.
export const ROOM_STATUS = Object.freeze({
  WAITING: "waiting",
  COUNTDOWN: "countdown",
  PLAYING: "playing",
  FINISHED: "finished",
});

// Values must match the CHECK constraint on games.phase in the database.
export const GAME_PHASE = Object.freeze({
  COUNTDOWN: "countdown",
  ANSWERING: "answering",
  VOTING: "voting",
  REVEAL: "reveal",
  FINISHED: "finished",
});
