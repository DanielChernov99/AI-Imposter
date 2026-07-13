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
} from "../services/contracts/roomService.js";
import { ROOM_STATUS } from "../domain/constants.js";

export default class RoomStore {
  currentRoom = null;
  currentPlayer = null;
  currentRoomPlayers = [];
  isLoading = false;
  isStartingGame = false;
  error = null;

  roomSubscription = null;

  constructor(roomService) {
    this.roomService = roomService;

    makeObservable(this, {
      currentRoom: observable,
      currentPlayer: observable,
      currentRoomPlayers: observable,
      isLoading: observable,
      isStartingGame: observable,
      error: observable,

      joinedPlayersCount: computed,
      isRoomFull: computed,
      areAllPlayersReady: computed,
      canStartGame: computed,

      createRoom: action,
      joinRoom: action,
      clearError: action,
      setServiceError: action,
      setCurrentPlayerReady: action,
      leaveRoom: action,
      loadCurrentRoomPlayers: action,
      startCurrentGame: action,
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

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof RoomServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: ROOM_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
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
      this.setServiceError("create", caughtError, "Failed to create room");

      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  /**
   * Starts syncing currentRoom/currentRoomPlayers/currentPlayer with live
   * changes from the backend (Realtime), if the service supports it.
   * Call from a component's mount effect; pair with stopRoomRealtimeSync
   * on unmount.
   */
  startRoomRealtimeSync() {
    if (
      !this.currentRoom ||
      this.roomSubscription ||
      !this.roomService.subscribeToRoom
    ) {
      return;
    }

    this.roomSubscription = this.roomService.subscribeToRoom({
      roomId: this.currentRoom.id,
      onPlayersChange: ({ eventType, newPlayer, oldPlayer }) => {
        runInAction(() => {
          if (eventType === "INSERT" && newPlayer) {
            if (
              !this.currentRoomPlayers.some(
                (player) => player.id === newPlayer.id,
              )
            ) {
              this.currentRoomPlayers = [...this.currentRoomPlayers, newPlayer];
            }
          } else if (eventType === "UPDATE" && newPlayer) {
            this.currentRoomPlayers = this.currentRoomPlayers.map((player) =>
              player.id === newPlayer.id ? newPlayer : player,
            );

            if (this.currentPlayer?.id === newPlayer.id) {
              this.currentPlayer = newPlayer;
            }
          } else if (eventType === "DELETE" && oldPlayer) {
            this.currentRoomPlayers = this.currentRoomPlayers.filter(
              (player) => player.id !== oldPlayer.id,
            );
          }
        });
      },
      onRoomChange: (updatedRoom) => {
        runInAction(() => {
          this.currentRoom = updatedRoom;
        });
      },
    });
  }

  stopRoomRealtimeSync() {
    if (this.roomSubscription) {
      this.roomSubscription();
      this.roomSubscription = null;
    }
  }

  async setCurrentPlayerReady(isReady) {
    if (this.isLoading || !this.currentRoom || !this.currentPlayer) {
      return false;
    }
    this.isLoading = true;
    this.error = null;
    try {
      if (
        this.currentRoom.status === ROOM_STATUS.COUNTDOWN &&
        isReady === false
      ) {
        const result = await this.roomService.cancelGameCountdown({
          roomId: this.currentRoom.id,
          playerId: this.currentPlayer.id,
        });

        runInAction(() => {
          this.currentRoom = result.room;
          this.currentPlayer = result.player;
          this.currentRoomPlayers = this.currentRoomPlayers.map((player) =>
            player.id === result.player.id ? result.player : player,
          );
        });

        return true;
      }

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
      this.setServiceError(
        "ready",
        caughtError,
        this.currentRoom?.status === ROOM_STATUS.COUNTDOWN
          ? "Failed to cancel the countdown"
          : "Failed to update ready state",
      );
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
      this.setServiceError("join", caughtError, "Failed to join room");

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
      this.setServiceError("leave", caughtError, "Failed to leave room");

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
      this.setServiceError(
        "loadPlayers",
        caughtError,
        "Failed to load room players",
      );

      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  /**
   * Asks the server to start the game (start_game RPC). Every client whose
   * canStartGame turns true calls this; the server accepts exactly one and
   * rejects the rest with ROOM_ALREADY_STARTED, which we treat as success —
   * the game did start, just not by us. Room status/activeGameId updates
   * arrive through the room Realtime subscription.
   */
  async startCurrentGame() {
    if (this.isStartingGame || !this.currentRoom || !this.canStartGame) {
      return false;
    }

    this.isStartingGame = true;
    this.error = null;

    try {
      await this.roomService.startGame({ roomId: this.currentRoom.id });

      return true;
    } catch (caughtError) {
      if (
        caughtError instanceof RoomServiceError &&
        caughtError.code === ROOM_SERVICE_ERRORS.ROOM_ALREADY_STARTED
      ) {
        return true;
      }

      this.setServiceError("startGame", caughtError, "Failed to start game");

      return false;
    } finally {
      runInAction(() => {
        this.isStartingGame = false;
      });
    }
  }
}
