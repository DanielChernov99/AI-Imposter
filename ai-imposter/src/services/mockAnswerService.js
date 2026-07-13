import { MAX_ANSWER_LENGTH, TOTAL_ROUNDS } from "../domain/constants.js";
import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "./answerService.js";

export default function createMockAnswerService() {
  const answers = [];

  function validateId(value, errorCode, label) {
    const cleanValue = typeof value === "string" ? value.trim() : "";

    if (!cleanValue) {
      throw new AnswerServiceError(
        errorCode,
        `${label} must be a non-empty string.`,
      );
    }

    return cleanValue;
  }

  function validateRoundNumber(roundNumber) {
    if (
      !Number.isInteger(roundNumber) ||
      roundNumber < 1 ||
      roundNumber > TOTAL_ROUNDS
    ) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.INVALID_ROUND_NUMBER,
        `Round number must be an integer between 1 and ${TOTAL_ROUNDS}.`,
      );
    }

    return roundNumber;
  }

  function validateGameId(gameId) {
    return validateId(
      gameId,
      ANSWER_SERVICE_ERRORS.INVALID_GAME_ID,
      "Game ID",
    );
  }

  function validateQuestionId(questionId) {
    return validateId(
      questionId,
      ANSWER_SERVICE_ERRORS.INVALID_QUESTION_ID,
      "Question ID",
    );
  }

  function validatePlayerId(playerId) {
    return validateId(
      playerId,
      ANSWER_SERVICE_ERRORS.INVALID_PLAYER_ID,
      "Player ID",
    );
  }

  async function submitPlayerAnswer({
    gameId,
    roundNumber,
    questionId,
    playerId,
    text,
  }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanQuestionId = validateQuestionId(questionId);
    const cleanPlayerId = validatePlayerId(playerId);
    const cleanText = typeof text === "string" ? text.trim() : "";

    if (!cleanText || cleanText.length > MAX_ANSWER_LENGTH) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.INVALID_ANSWER_TEXT,
        `Answer must contain between 1 and ${MAX_ANSWER_LENGTH} characters.`,
      );
    }

    const hasSubmitted = answers.some(
      (answer) =>
        answer.gameId === cleanGameId &&
        answer.roundNumber === validRoundNumber &&
        answer.playerId === cleanPlayerId,
    );

    if (hasSubmitted) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED,
        "This player has already submitted an answer for this round.",
      );
    }

    const answer = {
      id: crypto.randomUUID(),
      gameId: cleanGameId,
      roundNumber: validRoundNumber,
      questionId: cleanQuestionId,
      playerId: cleanPlayerId,
      text: cleanText,
      isValid: true,
      isAi: false,
    };

    answers.push(answer);

    return answer;
  }

  async function submitAiAnswer({ gameId, roundNumber, questionId, text }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanQuestionId = validateQuestionId(questionId);
    const cleanText = typeof text === "string" ? text.trim() : "";

    if (!cleanText || cleanText.length > MAX_ANSWER_LENGTH) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.INVALID_ANSWER_TEXT,
        `Answer must contain between 1 and ${MAX_ANSWER_LENGTH} characters.`,
      );
    }

    const hasAiAnswer = answers.some(
      (answer) =>
        answer.gameId === cleanGameId &&
        answer.roundNumber === validRoundNumber &&
        answer.isAi,
    );

    if (hasAiAnswer) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.AI_ANSWER_ALREADY_EXISTS,
        "An AI answer already exists for this round.",
      );
    }

    const answer = {
      id: crypto.randomUUID(),
      gameId: cleanGameId,
      roundNumber: validRoundNumber,
      questionId: cleanQuestionId,
      playerId: null,
      text: cleanText,
      isValid: true,
      isAi: true,
    };

    answers.push(answer);

    return answer;
  }

  async function createMissingPlayerAnswer({
    gameId,
    roundNumber,
    questionId,
    playerId,
  }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanQuestionId = validateQuestionId(questionId);
    const cleanPlayerId = validatePlayerId(playerId);
    const hasPlayerAnswer = answers.some(
      (answer) =>
        answer.gameId === cleanGameId &&
        answer.roundNumber === validRoundNumber &&
        answer.playerId === cleanPlayerId,
    );

    if (hasPlayerAnswer) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED,
        "This player already has an answer for this round.",
      );
    }

    const answer = {
      id: crypto.randomUUID(),
      gameId: cleanGameId,
      roundNumber: validRoundNumber,
      questionId: cleanQuestionId,
      playerId: cleanPlayerId,
      text: "",
      isValid: false,
      isAi: false,
    };

    answers.push(answer);

    return answer;
  }

  async function getAnswerById(answerId) {
    const cleanAnswerId = validateId(
      answerId,
      ANSWER_SERVICE_ERRORS.INVALID_ANSWER_ID,
      "Answer ID",
    );
    const answer = answers.find((answer) => answer.id === cleanAnswerId);

    if (!answer) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.ANSWER_NOT_FOUND,
        `Could not find answer with ID: ${cleanAnswerId}`,
      );
    }

    return answer;
  }

  async function getAnswersByRound({ gameId, roundNumber }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);

    return answers.filter(
      (answer) =>
        answer.gameId === cleanGameId &&
        answer.roundNumber === validRoundNumber,
    );
  }

  async function getPlayerAnswerByRound({ gameId, roundNumber, playerId }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanPlayerId = validatePlayerId(playerId);
    const answer = answers.find(
      (answer) =>
        answer.gameId === cleanGameId &&
        answer.roundNumber === validRoundNumber &&
        answer.playerId === cleanPlayerId,
    );

    if (!answer) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.ANSWER_NOT_FOUND,
        "Could not find an answer for this player and round.",
      );
    }

    return answer;
  }

  return {
    submitPlayerAnswer,
    submitAiAnswer,
    createMissingPlayerAnswer,
    getAnswerById,
    getAnswersByRound,
    getPlayerAnswerByRound,
  };
}
