import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  RoomServiceError,
  ROOM_SERVICE_ERRORS,
} from "../services/roomService.js";

export default class RoomStore {
  currentRoom = null;
  currentPlayer = null;
  currentRoomPlayers = [];
  isLoading = false;
  error = null;

  constructor(roomService) {
    this.roomService = roomService;

    makeObservable(this, {
      currentRoom: observable,
      currentPlayer: observable,
      currentRoomPlayers: observable,
      isLoading: observable,
      error: observable,

      joinedPlayersCount: computed,

      createRoom: action,
      clearError: action,
      setCurrentPlayerReady: action,
      joinRoom: action,
    });
  }

  get joinedPlayersCount() {
    return this.currentRoomPlayers.length;
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
      const result = await this.roomService.createRoom({
        nickname,
        capacity,
      });

      runInAction(() => {
        this.currentRoom = result.room;
        this.currentPlayer = result.player;
        this.currentRoomPlayers = result.players;
      });

      return true;
    } catch (caughtError) {
      runInAction(() => {
        if (caughtError instanceof RoomServiceError) {
          this.error = {
            source: "create",
            code: caughtError.code,
            message: caughtError.message,
          };
        } else {
          this.error = {
            source: "create",
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
  async setCurrentPlayerReady(isReady) {
    if (this.isLoading || !this.currentRoom || !this.currentPlayer) {
      return false;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const updatedPlayer = await this.roomService.setPlayerReady({
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer.id,
        isReady,
      });

      runInAction(() => {
        this.currentPlayer = updatedPlayer;
        this.currentRoomPlayers = this.currentRoomPlayers.map((player) =>
          player.id === updatedPlayer.id ? updatedPlayer : player,
        );
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
            message: "Failed to update ready state",
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
  async joinRoom({ nickname, roomCode }) {
    if (this.isLoading) {
      return false;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const result = await this.roomService.joinRoom({
        nickname,
        roomCode,
      });

      runInAction(() => {
        this.currentRoom = result.room;
        this.currentPlayer = result.player;
        this.currentRoomPlayers = result.players;
      });

      return true;
    } catch (caughtError) {
      runInAction(() => {
        if (caughtError instanceof RoomServiceError) {
          this.error = {
            source: "join",
            code: caughtError.code,
            message: caughtError.message,
          };
        } else {
          this.error = {
            source: "join",
            code: ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
            message: "Failed to join room",
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
