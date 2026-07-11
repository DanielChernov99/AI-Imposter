import { makeObservable, observable } from "mobx";

export default class RoomStore {
  currentRoom = null;
  currentPlayer = null;
  players = [];
  isLoading = false;
  error = null;

  constructor(roomService) {
    this.roomService = roomService;

    makeObservable(this, {
      currentRoom: observable,
      currentPlayer: observable,
      players: observable,
      isLoading: observable,
      error: observable,
    });
  }
}
