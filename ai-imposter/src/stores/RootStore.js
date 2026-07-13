import { reaction } from "mobx";

import { ROOM_STATUS } from "../domain/constants.js";
import GameStore from "./GameStore.js";
import QuestionStore from "./QuestionStore.js";
import RoomStore from "./RoomStore.js";

const GAME_ACTIVE_ROOM_STATUSES = [
  ROOM_STATUS.COUNTDOWN,
  ROOM_STATUS.PLAYING,
];

export default class RootStore {
  constructor({ roomService, gameService, questionService }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
    this.questionStore = new QuestionStore(questionService);

    this.#wireCrossStoreReactions();
  }

  /**
   * The cross-store glue for the server-driven game flow:
   *
   * 1. Everyone in the room is ready -> ask the server to start the game.
   *    All clients race; the server accepts one (see RoomStore.startCurrentGame).
   * 2. The room gets an active game (countdown begins) -> start following
   *    that game (Realtime + the phase machine in GameStore).
   * 3. The game's current question changes -> load its text.
   * 4. The room goes away (player left / reset) -> stop following the game.
   */
  #wireCrossStoreReactions() {
    reaction(
      () => this.roomStore.canStartGame,
      (canStart) => {
        if (canStart) {
          this.startCurrentRoomGame();
        }
      },
    );

    reaction(
      () => ({
        gameId: this.roomStore.currentRoom?.activeGameId,
        status: this.roomStore.currentRoom?.status,
      }),
      ({ gameId, status }) => {
        if (gameId && GAME_ACTIVE_ROOM_STATUSES.includes(status)) {
          this.gameStore.startGameSync(gameId);
        }
      },
    );

    reaction(
      () => this.gameStore.currentGame?.currentQuestionId,
      (questionId) => {
        if (questionId) {
          this.questionStore.loadQuestionById(questionId);
        }
      },
    );

    reaction(
      () => this.roomStore.currentRoom?.id ?? null,
      (roomId) => {
        if (roomId) {
          // Keep the room subscription alive across page transitions
          // (lobby -> game -> results), not tied to any component's mount.
          this.roomStore.startRoomRealtimeSync();
        } else {
          this.roomStore.stopRoomRealtimeSync();
          this.gameStore.resetGame();
          this.questionStore.resetQuestions();
        }
      },
    );
  }

  async startCurrentRoomGame() {
    return this.roomStore.startCurrentGame();
  }

  /** Convenience: submit the current player's answer for the current round. */
  async submitCurrentAnswer(text) {
    const player = this.roomStore.currentPlayer;

    if (!player) {
      return false;
    }

    return this.gameStore.submitAnswer({ playerId: player.id, text });
  }

  /** Convenience: cast the current player's vote for an answer. */
  async castCurrentVote(answerId) {
    const player = this.roomStore.currentPlayer;

    if (!player) {
      return false;
    }

    return this.gameStore.castVote({ voterPlayerId: player.id, answerId });
  }
}
