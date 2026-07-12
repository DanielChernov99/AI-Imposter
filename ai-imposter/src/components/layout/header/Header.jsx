import { ActionIcon, Flex, Text } from "@mantine/core";
import { LogOut, UsersRound } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import logo from "../../../assets/images/AI-Imposter_logo.png";
import { useStores } from "../../../context/StoreContext.jsx";
import {
  GAME_START_COUNTDOWN_SECONDS,
  ROOM_STATUS,
} from "../../../domain/constants.js";
import GameRoundStatus from "./components/gameRoundStatus/GameRoundStatus";
import Timer from "./components/timer/Timer";
import Classes from "./Header.module.css";

const Header = observer(function Header() {
  const { roomStore } = useStores();
  const { currentRoom } = roomStore;
  const navigate = useNavigate();

  const roomCode = currentRoom?.code ?? "------";
  const roomStatus = currentRoom?.status;

  const isWaitingRoom = roomStatus === ROOM_STATUS.WAITING;
  const isGameInProgress = roomStatus === ROOM_STATUS.IN_GAME;

  const handleLeaveRoom = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

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
          onClick={handleLeaveRoom}
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
      {roomStore.canStartGame && (
        <>
          <div className={Classes.verticalDivider} />

          <Timer
            duration={GAME_START_COUNTDOWN_SECONDS}
            label="GAME STARTS IN"
          />
        </>
      )}
    </header>
  );
});

export default Header;
