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
  isRequestingPlayAgain = false;
  playAgainRequested = false;
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
      isRequestingPlayAgain: observable,
      playAgainRequested: observable,
      error: observable,

      joinedPlayersCount: computed,
      isRoomFull: computed,
      areAllPlayersReady: computed,
      canStartGame: computed,
      hasRequestedPlayAgain: computed,

      createRoom: action,
      joinRoom: action,
      clearError: action,
      setServiceError: action,
      setCurrentPlayerReady: action,
      leaveRoom: action,
      loadCurrentRoomPlayers: action,
      startCurrentGame: action,
      requestPlayAgain: action,
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

  get hasRequestedPlayAgain() {
    return (
      this.currentRoom?.status === ROOM_STATUS.FINISHED &&
      this.playAgainRequested
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
        this.playAgainRequested = false;
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

    const roomId = this.currentRoom.id;
    let isActive = true;
    const isCurrentRoomSync = () =>
      isActive && this.currentRoom?.id === roomId;
    const subscriptionOptions = {
      roomId,
      onPlayersChange: ({ eventType, newPlayer, oldPlayer }) => {
        if (!isCurrentRoomSync()) {
          return;
        }

        runInAction(() => {
          if (this.error?.source === "realtime") {
            this.error = null;
          }

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

              if (this.error?.source === "ready") {
                this.error = null;
              }
            }
          } else if (eventType === "DELETE" && oldPlayer) {
            this.currentRoomPlayers = this.currentRoomPlayers.filter(
              (player) => player.id !== oldPlayer.id,
            );
          }
        });
      },
      onRoomChange: (updatedRoom) => {
        if (!isCurrentRoomSync()) {
          return;
        }

        runInAction(() => {
          if (this.error?.source === "realtime") {
            this.error = null;
          }

          if (
            this.error?.source === "startGame" &&
            updatedRoom.status !== ROOM_STATUS.WAITING
          ) {
            this.error = null;
          }

          const returnedToWaiting =
            this.currentRoom?.status === ROOM_STATUS.FINISHED &&
            updatedRoom.status === ROOM_STATUS.WAITING;

          if (returnedToWaiting) {
            this.currentRoomPlayers = this.currentRoomPlayers.map((player) => ({
              ...player,
              isReady: false,
              totalScore: 0,
            }));
            this.currentPlayer =
              this.currentRoomPlayers.find(
                (player) => player.id === this.currentPlayer?.id,
              ) ?? this.currentPlayer;
            this.playAgainRequested = false;
            this.isRequestingPlayAgain = false;

            if (this.error?.source === "playAgain") {
              this.error = null;
            }
          }

          this.currentRoom = updatedRoom;
        });
      },
      onSubscribed: () => {
        if (!isCurrentRoomSync()) {
          return;
        }

        runInAction(() => {
          if (this.error?.source === "realtime") {
            this.error = null;
          }
        });
      },
      onError: (caughtError) => {
        if (!isCurrentRoomSync()) {
          return;
        }

        this.setServiceError(
          "realtime",
          caughtError,
          "The live room connection was interrupted. Reconnecting...",
        );
      },
    };

    try {
      const unsubscribe = this.roomService.subscribeToRoom(subscriptionOptions);

      this.roomSubscription = () => {
        isActive = false;
        unsubscribe();
      };
    } catch (caughtError) {
      isActive = false;

      if (this.currentRoom?.id === roomId) {
        this.setServiceError(
          "realtime",
          caughtError,
          "Could not start live room updates. Please refresh.",
        );
      }
    }
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

    if (this.error?.source === "ready") {
      this.error = null;
    }
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
      if (this.currentPlayer?.isReady === isReady) {
        if (this.error?.source === "ready") {
          this.error = null;
        }
        return true;
      }

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
        this.playAgainRequested = false;
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

    if (this.error?.source === "leave") {
      this.error = null;
    }

    try {
      await this.roomService.leaveRoom({
        roomId: this.currentRoom.id,
        playerId: this.currentPlayer.id,
      });

      runInAction(() => {
        this.currentRoom = null;
        this.currentPlayer = null;
        this.currentRoomPlayers = [];
        this.playAgainRequested = false;
        this.isRequestingPlayAgain = false;
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

    if (this.error?.source === "loadPlayers") {
      this.error = null;
    }

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

    const roomId = this.currentRoom.id;
    this.isStartingGame = true;

    if (this.error?.source === "startGame") {
      this.error = null;
    }

    try {
      await this.roomService.startGame({ roomId });

      return true;
    } catch (caughtError) {
      if (this.currentRoom?.id !== roomId) {
        return false;
      }

      if (this.currentRoom.status !== ROOM_STATUS.WAITING) {
        if (this.error?.source === "startGame") {
          this.error = null;
        }
        return true;
      }

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

  async requestPlayAgain() {
    if (
      this.isRequestingPlayAgain ||
      this.isLoading ||
      this.hasRequestedPlayAgain ||
      this.currentRoom?.status !== ROOM_STATUS.FINISHED ||
      !this.currentPlayer
    ) {
      return null;
    }

    const roomId = this.currentRoom.id;
    const playerId = this.currentPlayer.id;
    this.isRequestingPlayAgain = true;

    if (this.error?.source === "playAgain") {
      this.error = null;
    }

    try {
      const result = await this.roomService.requestPlayAgain({
        roomId,
        playerId,
      });

      runInAction(() => {
        const roomIsStillFinished =
          this.currentRoom?.status === ROOM_STATUS.FINISHED;

        this.playAgainRequested =
          roomIsStillFinished && result.optedIn === true;

        if (roomIsStillFinished && result.optedIn && !result.reset) {
          this.currentPlayer = { ...this.currentPlayer, isReady: true };
          this.currentRoomPlayers = this.currentRoomPlayers.map((player) =>
            player.id === this.currentPlayer.id
              ? this.currentPlayer
              : player,
          );
        }
      });

      return result;
    } catch (caughtError) {
      if (
        this.currentRoom?.id !== roomId ||
        this.currentRoom.status !== ROOM_STATUS.FINISHED
      ) {
        return null;
      }

      this.setServiceError(
        "playAgain",
        caughtError,
        "Failed to request Play Again",
      );

      return null;
    } finally {
      runInAction(() => {
        this.isRequestingPlayAgain = false;
      });
    }
  }
}
