import { ActionIcon, Flex, Text } from "@mantine/core";
import { LogOut, UsersRound } from "lucide-react";
import { observer } from "mobx-react-lite";

import logo from "../../../assets/images/AI-Imposter_logo.png";
import { useStores } from "../../../context/StoreContext.jsx";
import { ROOM_STATUS } from "../../../domain/constants.js";
import GameRoundStatus from "./components/gameRoundStatus/GameRoundStatus";
import Timer from "./components/timer/Timer";
import Classes from "./Header.module.css";

function secondsUntil(isoTimestamp) {
  if (!isoTimestamp) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((new Date(isoTimestamp).getTime() - Date.now()) / 1000),
  );
}

const Header = observer(function Header({ onLeaveRoom }) {
  const { roomStore, gameStore } = useStores();
  const { currentRoom } = roomStore;
  const { currentGame } = gameStore;

  const roomCode = currentRoom?.code ?? "------";
  const roomStatus = currentRoom?.status;

  const isWaitingRoom = roomStatus === ROOM_STATUS.WAITING;
  const isCountdown = roomStatus === ROOM_STATUS.COUNTDOWN;
  const isGameInProgress = roomStatus === ROOM_STATUS.PLAYING;

  return (
    <header className={Classes["header-wrapper"]}>
      <Flex className={Classes["logo-container"]}>
        <img className={Classes["header-logo"]} src={logo} alt="AI Imposter" />
      </Flex>

      <div className={Classes.verticalDivider} />

      <Flex className={Classes["room-container"]}>
        <Flex className={Classes["room-info-container"]}>
          <Text span size="xl" className={Classes["room-label"]}>
            Room Code
          </Text>

          <Text span size="xl" className={Classes["room-code"]}>
            {roomCode}
          </Text>
        </Flex>

        <ActionIcon
          variant="transparent"
          color="gray"
          aria-label="Leave room"
          onClick={onLeaveRoom}
          loading={roomStore.isLoading}
        >
          <LogOut className={Classes["room-icon"]} stroke="white" />
        </ActionIcon>
      </Flex>

      <div className={Classes.verticalDivider} />

      {isWaitingRoom && (
        <Flex className={Classes["waitingroom-container"]}>
          <Flex className={Classes["waitingroom-title"]}>
            <UsersRound size="4rem" stroke="var(--primary)" />

            <Text size="xl">Waiting Room</Text>
          </Flex>

          <Flex className={`${Classes["status-container"]} ${Classes.waiting}`}>
            <Text span size="xl">
              Waiting
            </Text>
          </Flex>
        </Flex>
      )}

      {isGameInProgress && (
        <GameRoundStatus completedRounds={1} totalRounds={5} />
      )}

      {/*
        The countdown is server-driven: when everyone is ready, the game is
        started via RPC (a RootStore reaction), the room status becomes
        "countdown" and the deadline arrives in games.phase_ends_at — so all
        players see the same synchronized timer. Navigation to /game happens
        automatically (ProtectedRoute) when the server flips the room to
        "playing"; no onComplete callback is needed here.
      */}
      {isCountdown && currentGame?.phaseEndsAt && (
        <>
          <div className={Classes.verticalDivider} />

          <Timer
            duration={secondsUntil(currentGame.phaseEndsAt)}
            label="GAME STARTS IN"
          />
        </>
      )}
    </header>
  );
});

export default Header;
