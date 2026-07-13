import GameStore from "./GameStore.js";
import RoomStore from "./RoomStore.js";

export default class RootStore {
  constructor({ roomService, gameService }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
  }

  async startCurrentRoomGame() {
    const room = this.roomStore.currentRoom;

    if (!room || !this.roomStore.canStartGame) {
      return false;
    }

    const game = await this.gameStore.createGame({
      roomId: room.id,
    });

    if (!game) {
      return false;
    }

    return this.roomStore.startCurrentGame(game.id);
  }
}
