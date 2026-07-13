import GameStore from "./GameStore.js";
import RoomStore from "./RoomStore.js";

export default class RootStore {
  constructor({ roomService, gameService }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
  }
}
