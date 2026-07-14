import { ActionIcon, Flex, Text } from "@mantine/core";
import { Copy, LogOut, UsersRound } from "lucide-react";
import { observer } from "mobx-react-lite";

import logo from "../../../assets/images/AI-Imposter_logo.png";
import { useStores } from "../../../context/StoreContext.jsx";
import { GAME_PHASE, ROOM_STATUS } from "../../../domain/constants.js";
import { parseTimestampMs } from "../../../domain/time.js";
import GameRoundStatus from "./components/gameRoundStatus/GameRoundStatus";
import Timer from "./components/timer/Timer";
import Classes from "./Header.module.css";

const PHASE_TIMER_LABELS = {
  [GAME_PHASE.ANSWERING]: "TIME TO ANSWER",
  [GAME_PHASE.VOTING]: "VOTING ENDS IN",
  [GAME_PHASE.REVEAL]: "NEXT ROUND IN",
};

const PHASE_LABELS = {
  [GAME_PHASE.ANSWERING]: "ANSWERING",
  [GAME_PHASE.VOTING]: "VOTING",
  [GAME_PHASE.REVEAL]: "ROUND RESULTS",
  [GAME_PHASE.FINISHED]: "FINAL RESULTS",
};

const Header = observer(function Header({ onLeaveRoom }) {
  const { roomStore, gameStore } = useStores();
  const { currentRoom } = roomStore;
  const { currentGame } = gameStore;

  const roomCode = currentRoom?.code ?? "------";
  const roomStatus = currentRoom?.status;

  const isWaitingRoom = roomStatus === ROOM_STATUS.WAITING;
  const isCountdown = roomStatus === ROOM_STATUS.COUNTDOWN;
  const isGameInProgress = roomStatus === ROOM_STATUS.PLAYING;
  const isFinished = roomStatus === ROOM_STATUS.FINISHED;
  const phaseDeadlineMs = parseTimestampMs(currentGame?.phaseEndsAt);
  const hasValidPhaseDeadline = phaseDeadlineMs !== null;
  const showWaitingContext = isWaitingRoom || isCountdown;
  const showRoundStatus = (isGameInProgress || isFinished) && currentGame;
  const phaseLabel = isFinished
    ? PHASE_LABELS[GAME_PHASE.FINISHED]
    : isGameInProgress
      ? PHASE_LABELS[currentGame?.phase]
      : null;
  const layoutClass = isCountdown
    ? Classes["countdown-layout"]
    : isWaitingRoom
      ? Classes["waiting-layout"]
      : isFinished
        ? Classes["finished-layout"]
        : isGameInProgress
          ? Classes["game-layout"]
          : Classes["compact-layout"];

  const handleCopyRoomCode = async () => {
    if (!navigator.clipboard || roomCode === "------") {
      return;
    }

    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {
      // Clipboard access can be denied by the browser or page permissions.
    }
  };

  return (
    <header className={Classes["header-wrapper"]}>
      <div className={`${Classes["header-inner"]} ${layoutClass}`}>
        <Flex className={Classes["logo-slot"]}>
          <img
            className={Classes["header-logo"]}
            src={logo}
            alt="AI Imposter"
          />
        </Flex>

        <Flex className={Classes["room-slot"]}>
          <Flex className={Classes["room-info"]}>
            <Text span className={Classes["room-label"]}>
              Room Code
            </Text>

            <Text span className={Classes["room-code"]}>
              {roomCode}
            </Text>
          </Flex>

          <Flex className={Classes["room-actions"]}>
            <ActionIcon
              className={Classes["room-action"]}
              variant="transparent"
              color="gray"
              size={44}
              aria-label={`Copy room code ${roomCode}`}
              onClick={handleCopyRoomCode}
              disabled={roomCode === "------"}
            >
              <Copy className={Classes["room-icon"]} aria-hidden="true" />
            </ActionIcon>

            <ActionIcon
              className={Classes["room-action"]}
              variant="transparent"
              color="gray"
              size={44}
              aria-label="Leave room"
              onClick={onLeaveRoom}
              loading={roomStore.isLoading}
            >
              <LogOut className={Classes["room-icon"]} aria-hidden="true" />
            </ActionIcon>
          </Flex>
        </Flex>

        {showWaitingContext && (
          <Flex className={Classes["waiting-slot"]}>
            <Flex className={Classes["waiting-title"]}>
              <UsersRound
                className={Classes["waiting-icon"]}
                stroke="var(--primary)"
                aria-hidden="true"
              />

              <Text className={Classes["waiting-heading"]}>Waiting Room</Text>
            </Flex>

            <Flex className={Classes["waiting-status"]}>
              <span className={Classes["status-dot"]} aria-hidden="true" />
              <Text span>Waiting</Text>
            </Flex>
          </Flex>
        )}

        {showRoundStatus && (
          <div className={Classes["round-slot"]}>
            <GameRoundStatus
              completedRounds={
                isFinished
                  ? currentGame.totalRounds
                  : Math.max(0, currentGame.currentRound - 1)
              }
              totalRounds={currentGame.totalRounds}
            />
          </div>
        )}

        {phaseLabel && (
          <div className={Classes["phase-slot"]}>
            <Text className={Classes["phase-badge"]}>{phaseLabel}</Text>
          </div>
        )}

        {/*
          Phase timer, synchronized for all players via the server's
          games.phase_ends_at. Keyed by the absolute deadline so a corrected
          deadline in the same phase also resets the presentational timer.
        */}
        {isGameInProgress &&
          currentGame &&
          PHASE_TIMER_LABELS[currentGame.phase] &&
          hasValidPhaseDeadline && (
            <div className={Classes["timer-slot"]}>
              <Timer
                key={`${currentGame.phase}-${currentGame.currentRound}-${phaseDeadlineMs}`}
                deadline={phaseDeadlineMs}
                label={PHASE_TIMER_LABELS[currentGame.phase]}
              />
            </div>
          )}

        {/*
          The countdown is server-driven: when everyone is ready, the game is
          started via RPC (a RootStore reaction), the room status becomes
          "countdown" and the deadline arrives in games.phase_ends_at — so all
          players see the same synchronized timer. Navigation to /game happens
          automatically (ProtectedRoute) when the server flips the room to
          "playing"; no onComplete callback is needed here.
        */}
        {isCountdown && currentGame && hasValidPhaseDeadline && (
          <div
            className={`${Classes["timer-slot"]} ${Classes["countdown-timer-slot"]}`}
          >
            <Timer
              key={`countdown-${phaseDeadlineMs}`}
              deadline={phaseDeadlineMs}
              label="GAME STARTS IN"
            />
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
