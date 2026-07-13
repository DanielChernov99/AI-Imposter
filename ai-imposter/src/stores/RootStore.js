import GameStore from "./GameStore.js";
import QuestionStore from "./QuestionStore.js";
import RoomStore from "./RoomStore.js";

export default class RootStore {
  constructor({ roomService, gameService, questionService }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
    this.questionStore = new QuestionStore(questionService);
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
}
