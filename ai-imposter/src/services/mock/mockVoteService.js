import { TOTAL_ROUNDS } from "../../domain/constants.js";
import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "../contracts/answerService.js";
import {
  VOTE_SERVICE_ERRORS,
  VoteServiceError,
} from "../contracts/voteService.js";

export default function createMockVoteService({ answerService }) {
  const votes = [];

  function validateId(value, errorCode, label) {
    const cleanValue = typeof value === "string" ? value.trim() : "";

    if (!cleanValue) {
      throw new VoteServiceError(
        errorCode,
        `${label} must be a non-empty string.`,
      );
    }

    return cleanValue;
  }

  function validateGameId(gameId) {
    return validateId(
      gameId,
      VOTE_SERVICE_ERRORS.INVALID_GAME_ID,
      "Game ID",
    );
  }

  function validatePlayerId(playerId) {
    return validateId(
      playerId,
      VOTE_SERVICE_ERRORS.INVALID_PLAYER_ID,
      "Player ID",
    );
  }

  function validateAnswerId(answerId) {
    return validateId(
      answerId,
      VOTE_SERVICE_ERRORS.INVALID_ANSWER_ID,
      "Answer ID",
    );
  }

  function validateRoundNumber(roundNumber) {
    if (
      !Number.isInteger(roundNumber) ||
      roundNumber < 1 ||
      roundNumber > TOTAL_ROUNDS
    ) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.INVALID_ROUND_NUMBER,
        `Round number must be an integer between 1 and ${TOTAL_ROUNDS}.`,
      );
    }

    return roundNumber;
  }

  async function findAnswerOrThrow(answerId) {
    try {
      return await answerService.getAnswerById(answerId);
    } catch (caughtError) {
      if (
        caughtError instanceof AnswerServiceError &&
        caughtError.code === ANSWER_SERVICE_ERRORS.ANSWER_NOT_FOUND
      ) {
        throw new VoteServiceError(
          VOTE_SERVICE_ERRORS.ANSWER_NOT_FOUND,
          `Could not find answer with ID: ${answerId}`,
        );
      }

      throw caughtError;
    }
  }

  async function submitVote({
    gameId,
    roundNumber,
    voterPlayerId,
    answerId,
  }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanVoterPlayerId = validatePlayerId(voterPlayerId);
    const cleanAnswerId = validateAnswerId(answerId);
    const answer = await findAnswerOrThrow(cleanAnswerId);

    if (
      answer.gameId !== cleanGameId ||
      answer.roundNumber !== validRoundNumber
    ) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.ANSWER_NOT_FOUND,
        "The answer does not belong to this game and round.",
      );
    }

    if (!answer.isValid) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.CANNOT_VOTE_FOR_INVALID_ANSWER,
        "Cannot vote for an invalid answer.",
      );
    }

    if (answer.playerId === cleanVoterPlayerId) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.CANNOT_VOTE_FOR_OWN_ANSWER,
        "Players cannot vote for their own answer.",
      );
    }

    const hasVoted = votes.some(
      (vote) =>
        vote.gameId === cleanGameId &&
        vote.roundNumber === validRoundNumber &&
        vote.voterPlayerId === cleanVoterPlayerId,
    );

    if (hasVoted) {
      throw new VoteServiceError(
        VOTE_SERVICE_ERRORS.VOTE_ALREADY_SUBMITTED,
        "This player has already voted in this round.",
      );
    }

    const vote = {
      id: crypto.randomUUID(),
      gameId: cleanGameId,
      roundNumber: validRoundNumber,
      voterPlayerId: cleanVoterPlayerId,
      answerId: cleanAnswerId,
    };

    votes.push(vote);

    return true;
  }

  async function getVotingAnswers({ gameId, roundNumber }) {
    const roundAnswers = await answerService.getAnswersByRound({
      gameId,
      roundNumber,
    });

    return roundAnswers
      .filter((answer) => answer.isValid)
      .map((answer) => ({ id: answer.id, text: answer.text }));
  }

  async function getVotesByRound({ gameId, roundNumber }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);

    return votes.filter(
      (vote) =>
        vote.gameId === cleanGameId &&
        vote.roundNumber === validRoundNumber,
    );
  }

  async function getPlayerVoteByRound({
    gameId,
    roundNumber,
    voterPlayerId,
  }) {
    const cleanGameId = validateGameId(gameId);
    const validRoundNumber = validateRoundNumber(roundNumber);
    const cleanVoterPlayerId = validatePlayerId(voterPlayerId);

    return (
      votes.find(
        (vote) =>
          vote.gameId === cleanGameId &&
          vote.roundNumber === validRoundNumber &&
          vote.voterPlayerId === cleanVoterPlayerId,
      ) ?? null
    );
  }

  return {
    getVotingAnswers,
    submitVote,
    getVotesByRound,
    getPlayerVoteByRound,
  };
}
