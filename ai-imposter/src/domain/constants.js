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

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 5;

export const MIN_NICKNAME_LENGTH = 2;
export const MAX_NICKNAME_LENGTH = 16;
export const MAX_ANSWER_LENGTH = 120;
export const MISSING_ANSWER_TEXT = "No valid answer submitted";

export const ROOM_CODE_LENGTH = 6;
export const TOTAL_ROUNDS = 5;

export const PHASE_DURATION_SECONDS = Object.freeze({
  [GAME_PHASE.COUNTDOWN]: 5,
  [GAME_PHASE.ANSWERING]: 20,
  [GAME_PHASE.VOTING]: 20,
  [GAME_PHASE.REVEAL]: 10,
});

// Preserve the existing public constants as aliases to the canonical map.
export const GAME_START_COUNTDOWN_SECONDS =
  PHASE_DURATION_SECONDS[GAME_PHASE.COUNTDOWN];
export const ANSWERING_DURATION_SECONDS =
  PHASE_DURATION_SECONDS[GAME_PHASE.ANSWERING];
export const VOTING_DURATION_SECONDS =
  PHASE_DURATION_SECONDS[GAME_PHASE.VOTING];
export const ROUND_RESULTS_DURATION_SECONDS =
  PHASE_DURATION_SECONDS[GAME_PHASE.REVEAL];

export const SCORING_POINTS = Object.freeze({
  CORRECT_AI_GUESS: 2,
  HUMAN_ANSWER_FOOLED_VOTER: 1,
});
