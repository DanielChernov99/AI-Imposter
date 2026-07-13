import { action, makeObservable, observable } from "mobx";

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
}
