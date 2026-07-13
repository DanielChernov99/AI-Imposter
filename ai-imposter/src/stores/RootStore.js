import AnswerStore from "./AnswerStore.js";
import GameStore from "./GameStore.js";
import QuestionStore from "./QuestionStore.js";
import RoomStore from "./RoomStore.js";
import { GAME_PHASE } from "../domain/constants.js";

export default class RootStore {
  constructor({ roomService, gameService, questionService, answerService }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
    this.questionStore = new QuestionStore(questionService);
    this.answerStore = new AnswerStore(answerService);
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
      currentGame.phase !== GAME_PHASE.ANSWERING ||
      currentGame.currentQuestionId !== currentQuestion.id
    ) {
      return null;
    }

    return this.answerStore.submitPlayerAnswer({
      gameId: currentGame.id,
      roundNumber: currentGame.currentRound,
      questionId: currentQuestion.id,
      playerId: currentPlayer.id,
      text,
    });
  }
}
