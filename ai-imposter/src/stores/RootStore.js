import { reaction } from "mobx";

import { GAME_PHASE, ROOM_STATUS } from "../domain/constants.js";
import AnswerStore from "./AnswerStore.js";
import GameStore from "./GameStore.js";
import QuestionStore from "./QuestionStore.js";
import RevealStore from "./RevealStore.js";
import RoomStore from "./RoomStore.js";
import VoteStore from "./VoteStore.js";

const GAME_ACTIVE_ROOM_STATUSES = [ROOM_STATUS.COUNTDOWN, ROOM_STATUS.PLAYING];

export default class RootStore {
  constructor({
    roomService,
    gameService,
    questionService,
    answerService,
    voteService,
    revealService,
  }) {
    this.roomStore = new RoomStore(roomService);
    this.gameStore = new GameStore(gameService);
    this.questionStore = new QuestionStore(questionService);
    this.answerStore = new AnswerStore(answerService);
    this.voteStore = new VoteStore(voteService);
    this.revealStore = new RevealStore(revealService);

    this.#wireCrossStoreReactions();
  }

  /** Cross-store coordination for the server-driven room and game flow. */
  #wireCrossStoreReactions() {
    reaction(
      () => this.roomStore.canStartGame,
      (canStart) => {
        if (canStart) {
          void this.startCurrentRoomGame();
        }
      },
    );

    reaction(
      () => ({
        gameId: this.roomStore.currentRoom?.activeGameId,
        status: this.roomStore.currentRoom?.status,
      }),
      ({ gameId, status }, previousRoomGameState) => {
        if (gameId && GAME_ACTIVE_ROOM_STATUSES.includes(status)) {
          this.gameStore.startGameSync(gameId);
        } else if (status === ROOM_STATUS.FINISHED) {
          // Room and game updates use separate Realtime channels. Stop the
          // deadline callback even if the room's finished event arrives first.
          this.gameStore.clearScheduledPhaseAdvance();
        } else if (
          [ROOM_STATUS.COUNTDOWN, ROOM_STATUS.FINISHED].includes(
            previousRoomGameState?.status,
          ) &&
          status === ROOM_STATUS.WAITING &&
          !gameId
        ) {
          this.gameStore.resetGame();

          if (previousRoomGameState?.status === ROOM_STATUS.FINISHED) {
            this.questionStore.resetQuestions();
            this.answerStore.reset();
            this.voteStore.reset();
            this.revealStore.reset();
          }
        }
      },
    );

    reaction(
      () => ({
        gameId: this.gameStore.gameId,
        roundNumber: this.gameStore.currentRound,
        phase: this.gameStore.currentPhase,
        questionId: this.gameStore.currentQuestionId,
        finalStandings: this.gameStore.currentGame?.finalStandings,
      }),
      (gameState, previousGameState) => {
        const {
          gameId,
          roundNumber,
          phase,
          questionId,
          finalStandings,
        } = gameState;

        if (!gameId) {
          return;
        }

        const isNewGame = gameId !== previousGameState?.gameId;
        const isNewRound =
          isNewGame || roundNumber !== previousGameState?.roundNumber;

        // One reset per game/round identity change. A normal
        // countdown -> answering transition does not reset the same round twice.
        if (isNewGame) {
          this.answerStore.reset();
          this.voteStore.reset();
          this.revealStore.reset();
          this.questionStore.resetQuestions();
        } else if (isNewRound) {
          this.questionStore.resetForRound();
          this.answerStore.resetForRound();
          this.voteStore.resetForRound();
          this.revealStore.resetForRound();
        } else if (
          phase === GAME_PHASE.FINISHED &&
          previousGameState?.phase !== GAME_PHASE.FINISHED
        ) {
          this.answerStore.resetForRound();
          this.voteStore.resetForRound();
          this.revealStore.resetForRound();
        } else if (
          previousGameState?.phase === GAME_PHASE.REVEAL &&
          phase !== GAME_PHASE.REVEAL
        ) {
          this.revealStore.resetForRound();
        }

        if (
          questionId &&
          (isNewRound || questionId !== previousGameState?.questionId)
        ) {
          void this.questionStore.loadQuestionById(questionId);
        }

        const enteredPhase =
          isNewRound || phase !== previousGameState?.phase;

        if (enteredPhase && phase === GAME_PHASE.VOTING) {
          void this.voteStore.loadVotingOptions({
            gameId,
            roundNumber,
            playerId: this.roomStore.currentPlayer?.id,
            humanPlayerCount: this.roomStore.currentRoomPlayers.length,
          });
        }

        if (enteredPhase && phase === GAME_PHASE.REVEAL) {
          void this.revealStore.loadRoundReveal({
            gameId,
            roundNumber,
            roomId: this.roomStore.currentRoom?.id,
          });
        }

        const finalStandingsChanged =
          finalStandings !== previousGameState?.finalStandings;

        if (
          phase === GAME_PHASE.FINISHED &&
          (enteredPhase || finalStandingsChanged)
        ) {
          this.revealStore.setFinalStandings(finalStandings);
        }
      },
    );

    reaction(
      () => this.roomStore.currentRoom?.id ?? null,
      (roomId) => {
        if (roomId) {
          // Keep room Realtime alive across lobby, game and result routes.
          this.roomStore.startRoomRealtimeSync();
        } else {
          this.roomStore.stopRoomRealtimeSync();
          this.gameStore.resetGame();
          this.questionStore.resetQuestions();
          this.answerStore.reset();
          this.voteStore.reset();
          this.revealStore.reset();
        }
      },
    );
  }

  async startCurrentRoomGame() {
    return this.roomStore.startCurrentGame();
  }

  /** Coordinate the current room player and game round for AnswerStore. */
  async submitCurrentAnswer(text) {
    const playerId = this.roomStore.currentPlayer?.id;
    const gameId = this.gameStore.gameId;
    const roundNumber = this.gameStore.currentRound;
    const questionId = this.gameStore.currentQuestionId;

    if (!playerId || !gameId || !roundNumber || !questionId) {
      return false;
    }

    return this.answerStore.submitAnswer({
      gameId,
      roundNumber,
      questionId,
      playerId,
      text,
    });
  }

  /** Coordinate the current room player and game round for VoteStore. */
  async castCurrentVote(answerId) {
    const voterPlayerId = this.roomStore.currentPlayer?.id;
    const gameId = this.gameStore.gameId;
    const roundNumber = this.gameStore.currentRound;

    if (!voterPlayerId || !gameId || !roundNumber || !answerId) {
      return false;
    }

    return this.voteStore.castVote({
      gameId,
      roundNumber,
      voterPlayerId,
      answerId,
    });
  }
}
