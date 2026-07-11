import { runInAction, action, makeObservable, observable } from "mobx";
import {
  RoomServiceError,
  ROOM_SERVICE_ERRORS,
} from "../services/roomService.js";

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
      createRoom: action,
      clearError: action,
    });
  }

  clearError() {
    this.error = null;
  }

  async createRoom({ nickname, capacity }) {
    if (this.isLoading) {
      return false;
    }
    this.isLoading = true;
    this.error = null;

    try {
      const result = await this.roomService.createRoom({ nickname, capacity });
      runInAction(() => {
        this.currentRoom = result.room;
        this.currentPlayer = result.player;
        this.players = result.players;
      });
      return true;
    } catch (caughtError) {
      runInAction(() => {
        if (caughtError instanceof RoomServiceError) {
          this.error = {
            code: caughtError.code,
            message: caughtError.message,
          };
        } else {
          this.error = {
            code: ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
            message: "Failed to create room",
          };
        }
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
