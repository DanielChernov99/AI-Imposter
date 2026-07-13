import { action, makeObservable, observable, runInAction } from "mobx";

import {
  GameServiceError,
  GAME_SERVICE_ERRORS,
} from "../services/gameService.js";

export default class GameStore {
  currentGame = null;
  isLoading = false;
  error = null;

  constructor(gameService) {
    this.gameService = gameService;

    makeObservable(this, {
      currentGame: observable,
      isLoading: observable,
      error: observable,

      clearError: action,
      setServiceError: action,
      createGame: action,
      loadGameById: action,
    });
  }

  clearError() {
    this.error = null;
  }

  setServiceError(source, caughtError, fallbackMessage) {
    if (caughtError instanceof GameServiceError) {
      this.error = {
        source,
        code: caughtError.code,
        message: caughtError.message,
      };
    } else {
      this.error = {
        source,
        code: GAME_SERVICE_ERRORS.UNKNOWN_ERROR,
        message: fallbackMessage,
      };
    }
  }

  async createGame({ roomId, currentQuestionId }) {
    if (this.isLoading) {
      return null;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const game = await this.gameService.createGame({
        roomId,
        currentQuestionId,
      });

      runInAction(() => {
        this.currentGame = game;
      });

      return game;
    } catch (caughtError) {
      this.setServiceError("create", caughtError, "Failed to create the game");

      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadGameById(gameId) {
    if (this.isLoading) {
      return false;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const game = await this.gameService.getGameById(gameId);

      runInAction(() => {
        this.currentGame = game;
      });

      return true;
    } catch (caughtError) {
      this.setServiceError("load", caughtError, "Failed to load the game");

      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
