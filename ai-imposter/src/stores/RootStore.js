import AnswerStore from "./AnswerStore.js";
import GameStore from "./GameStore.js";
import QuestionStore from "./QuestionStore.js";
import RoomStore from "./RoomStore.js";
import VoteStore from "./VoteStore.js";
import { GAME_PHASE } from "../domain/constants.js";
import { ANSWER_SERVICE_ERRORS } from "../services/answerService.js";

export default class RootStore {
  constructor({
    roomService,
    gameService,
    questionService,
    answerService,
    voteService,
  }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
    this.questionStore = new QuestionStore(questionService);
    this.answerStore = new AnswerStore(answerService);
    this.voteStore = new VoteStore(voteService);
    this.answerSubmissionPromise = null;
    this.finishAnsweringPromise = null;
    this.voteSubmissionPromise = null;
    this.finishVotingPromise = null;
  }

  async startCurrentRoomGame() {
    const room = this.roomStore.currentRoom;

    if (!room || !this.roomStore.canStartGame) {
      return false;
    }

    const question = await this.questionStore.loadRandomQuestion();

    if (!question) {
      return false;
    }

    const game = await this.gameStore.createGame({
      roomId: room.id,
      currentQuestionId: question.id,
    });

    if (!game) {
      return false;
    }

    return this.roomStore.startCurrentGame(game.id);
  }

  async submitCurrentPlayerAnswer(text) {
    const currentPlayer = this.roomStore.currentPlayer;
    const currentGame = this.gameStore.currentGame;
    const currentQuestion = this.questionStore.currentQuestion;

    if (
      !currentPlayer ||
      !currentGame ||
      !currentQuestion ||
      this.answerSubmissionPromise ||
      currentGame.phase !== GAME_PHASE.ANSWERING ||
      currentGame.currentQuestionId !== currentQuestion.id
    ) {
      return null;
    }

    const submitAnswer = async () => {
      const answer = await this.answerStore.submitPlayerAnswer({
        gameId: currentGame.id,
        roundNumber: currentGame.currentRound,
        questionId: currentQuestion.id,
        playerId: currentPlayer.id,
        text,
      });

      if (!answer) {
        return null;
      }

      await this.answerStore.loadAnswersByRound({
        gameId: currentGame.id,
        roundNumber: currentGame.currentRound,
      });

      await this._finishCurrentAnsweringPhase({ force: false });

      return answer;
    };

    const submissionPromise = submitAnswer();
    this.answerSubmissionPromise = submissionPromise;

    try {
      return await submissionPromise;
    } finally {
      if (this.answerSubmissionPromise === submissionPromise) {
        this.answerSubmissionPromise = null;
      }
    }
  }

  async finishCurrentAnsweringPhase({ force = false } = {}) {
    if (this.answerSubmissionPromise) {
      await this.answerSubmissionPromise;

      return this.finishCurrentAnsweringPhase({ force });
    }

    if (this.finishAnsweringPromise) {
      const didFinish = await this.finishAnsweringPromise;

      if (didFinish || !force) {
        return didFinish;
      }

      return this.finishCurrentAnsweringPhase({ force: true });
    }

    const finishPromise = this._finishCurrentAnsweringPhase({ force });
    this.finishAnsweringPromise = finishPromise;

    try {
      return await finishPromise;
    } finally {
      if (this.finishAnsweringPromise === finishPromise) {
        this.finishAnsweringPromise = null;
      }
    }
  }

  async _finishCurrentAnsweringPhase({ force }) {
    const currentGame = this.gameStore.currentGame;
    const currentQuestion = this.questionStore.currentQuestion;
    const roomPlayers = this.roomStore.currentRoomPlayers;

    if (!currentGame || !currentQuestion) {
      return false;
    }

    if (currentGame.phase === GAME_PHASE.VOTING) {
      return true;
    }

    if (
      currentGame.phase !== GAME_PHASE.ANSWERING ||
      currentGame.currentQuestionId !== currentQuestion.id ||
      roomPlayers.length === 0
    ) {
      return false;
    }

    const roundDetails = {
      gameId: currentGame.id,
      roundNumber: currentGame.currentRound,
    };
    const answers = await this.answerStore.loadAnswersByRound(roundDetails);

    if (!answers) {
      return false;
    }

    const answeredPlayerIds = new Set(
      answers
        .filter((answer) => !answer.isAi && answer.playerId)
        .map((answer) => answer.playerId),
    );
    const missingPlayers = roomPlayers.filter(
      (player) => !answeredPlayerIds.has(player.id),
    );

    if (!force && missingPlayers.length > 0) {
      return false;
    }

    if (force) {
      for (const player of missingPlayers) {
        const missingAnswer =
          await this.answerStore.createMissingPlayerAnswer({
            ...roundDetails,
            questionId: currentQuestion.id,
            playerId: player.id,
          });

        if (
          !missingAnswer &&
          this.answerStore.error?.code !==
            ANSWER_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED
        ) {
          return false;
        }
      }
    }

    const hasAiAnswer = this.answerStore.currentRoundAnswers.some(
      (answer) => answer.isAi,
    );

    if (!hasAiAnswer) {
      const aiAnswer = await this.answerStore.submitAiAnswer({
        ...roundDetails,
        questionId: currentQuestion.id,
        text: currentQuestion.aiAnswer,
      });

      if (
        !aiAnswer &&
        this.answerStore.error?.code !==
          ANSWER_SERVICE_ERRORS.AI_ANSWER_ALREADY_EXISTS
      ) {
        return false;
      }
    }

    const finalAnswers =
      await this.answerStore.loadAnswersByRound(roundDetails);

    if (!finalAnswers) {
      return false;
    }

    const finalPlayerIds = new Set(
      finalAnswers
        .filter((answer) => !answer.isAi && answer.playerId)
        .map((answer) => answer.playerId),
    );
    const allPlayersHaveAnswers = roomPlayers.every((player) =>
      finalPlayerIds.has(player.id),
    );
    const finalHasAiAnswer = finalAnswers.some((answer) => answer.isAi);

    if (!allPlayersHaveAnswers || !finalHasAiAnswer) {
      return false;
    }

    await this.gameStore.transitionPhase({
      expectedPhase: GAME_PHASE.ANSWERING,
      nextPhase: GAME_PHASE.VOTING,
    });

    return this.gameStore.currentGame?.phase === GAME_PHASE.VOTING;
  }

  async submitCurrentPlayerVote(answerId) {
    if (this.finishVotingPromise) {
      await this.finishVotingPromise;
    }

    const currentPlayer = this.roomStore.currentPlayer;
    const currentGame = this.gameStore.currentGame;
    const isRoundAnswer = this.answerStore.currentRoundAnswers.some(
      (answer) => answer.id === answerId,
    );

    if (
      !currentPlayer ||
      !currentGame ||
      !answerId ||
      !isRoundAnswer ||
      this.voteSubmissionPromise ||
      currentGame.phase !== GAME_PHASE.VOTING
    ) {
      return null;
    }

    const submitVote = async () => {
      const roundDetails = {
        gameId: currentGame.id,
        roundNumber: currentGame.currentRound,
      };
      const vote = await this.voteStore.submitVote({
        ...roundDetails,
        voterPlayerId: currentPlayer.id,
        answerId,
      });

      if (!vote) {
        return null;
      }

      await this.voteStore.loadVotesByRound(roundDetails);
      await this._finishCurrentVotingPhase({ force: false });

      return vote;
    };

    const submissionPromise = submitVote();
    this.voteSubmissionPromise = submissionPromise;

    try {
      return await submissionPromise;
    } finally {
      if (this.voteSubmissionPromise === submissionPromise) {
        this.voteSubmissionPromise = null;
      }
    }
  }

  async finishCurrentVotingPhase({ force = false } = {}) {
    if (this.voteSubmissionPromise) {
      await this.voteSubmissionPromise;

      return this.finishCurrentVotingPhase({ force });
    }

    if (this.finishVotingPromise) {
      const didFinish = await this.finishVotingPromise;

      if (didFinish || !force) {
        return didFinish;
      }

      return this.finishCurrentVotingPhase({ force: true });
    }

    const finishPromise = this._finishCurrentVotingPhase({ force });
    this.finishVotingPromise = finishPromise;

    try {
      return await finishPromise;
    } finally {
      if (this.finishVotingPromise === finishPromise) {
        this.finishVotingPromise = null;
      }
    }
  }

  async _finishCurrentVotingPhase({ force }) {
    const currentGame = this.gameStore.currentGame;
    const roomPlayers = this.roomStore.currentRoomPlayers;

    if (!currentGame) {
      return false;
    }

    if (currentGame.phase === GAME_PHASE.REVEAL) {
      return true;
    }

    if (
      currentGame.phase !== GAME_PHASE.VOTING ||
      roomPlayers.length === 0
    ) {
      return false;
    }

    const roundDetails = {
      gameId: currentGame.id,
      roundNumber: currentGame.currentRound,
    };
    const votes = await this.voteStore.loadVotesByRound(roundDetails);

    if (!votes) {
      return false;
    }

    const voterPlayerIds = new Set(
      votes.map((vote) => vote.voterPlayerId),
    );
    const allPlayersVoted = roomPlayers.every((player) =>
      voterPlayerIds.has(player.id),
    );

    if (!force && !allPlayersVoted) {
      return false;
    }

    await this.gameStore.transitionPhase({
      expectedPhase: GAME_PHASE.VOTING,
      nextPhase: GAME_PHASE.REVEAL,
    });

    return this.gameStore.currentGame?.phase === GAME_PHASE.REVEAL;
  }
}
