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
import { ROOM_STATUS } from "../domain/constants.js";

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
      isRoomFull: computed,
      areAllPlayersReady: computed,
      canStartGame: computed,

      createRoom: action,
      clearError: action,
      setCurrentPlayerReady: action,
      joinRoom: action,
      leaveRoom: action,
      loadCurrentRoomPlayers: action,
    });
  }

  get joinedPlayersCount() {
    return this.currentRoomPlayers.length;
  }

  get isRoomFull() {
    return (
      Boolean(this.currentRoom) &&
      this.currentRoomPlayers.length === this.currentRoom.capacity
    );
  }

  get areAllPlayersReady() {
    return (
      this.currentRoomPlayers.length > 0 &&
      this.currentRoomPlayers.every((player) => player.isReady)
    );
  }

  get canStartGame() {
    return (
      this.currentRoom?.status === ROOM_STATUS.WAITING &&
      this.isRoomFull &&
      this.areAllPlayersReady
    );
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

  async leaveRoom() {
    if (this.isLoading || !this.currentRoom || !this.currentPlayer) {
      return false;
    }

    this.isLoading = true;
    this.error = null;

    try {
      await this.roomService.leaveRoom({
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer.id,
      });

      runInAction(() => {
        this.currentRoom = null;
        this.currentPlayer = null;
        this.currentRoomPlayers = [];
        this.error = null;
      });

      return true;
    } catch (caughtError) {
      runInAction(() => {
        if (caughtError instanceof RoomServiceError) {
          this.error = {
            source: "leave",
            code: caughtError.code,
            message: caughtError.message,
          };
        } else {
          this.error = {
            source: "leave",
            code: ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
            message: "Failed to leave room",
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

  async loadCurrentRoomPlayers() {
    if (this.isLoading || !this.currentRoom) {
      return false;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const players = await this.roomService.getPlayersByRoomId(
        this.currentRoom.id,
      );

      runInAction(() => {
        this.currentRoomPlayers = players;
      });

      return true;
    } catch (caughtError) {
      runInAction(() => {
        if (caughtError instanceof RoomServiceError) {
          this.error = {
            source: "loadPlayers",
            code: caughtError.code,
            message: caughtError.message,
          };
        } else {
          this.error = {
            source: "loadPlayers",
            code: ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
            message: "Failed to load room players",
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
