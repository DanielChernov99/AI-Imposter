import Classes from "./Header.module.css";
import logo from "../../../assets/images/AI-Imposter_logo.png";
import { DoorClosedLocked, UsersRound } from "lucide-react";
import Timer from "./components/timer/Timer";
import { Flex, Text } from "@mantine/core";
import GameRoundStatus from "./components/gameRoundStatus/GameRoundStatus";

const Header = ({ gameStatus = "PLAYING" }) => {
  return (
    <header className={Classes["header-wrapper"]}>
      <Flex className={Classes["logo-container"]}>
        <img className={Classes["header-logo"]} src={logo} alt="AI Imposter" />
      </Flex>
      <div className={Classes["verticalDivider"]}></div>

      <Flex className={Classes["room-container"]}>
        <Flex className={Classes["room-info-container"]}>
          <Text span size="xl" className={Classes["room-label"]}>
            Room Code
          </Text>
          <Text span size="xl" className={Classes["room-code"]}>
            {"[784392]"}
          </Text>
        </Flex>
        <DoorClosedLocked className={Classes["room-icon"]} stroke="white" />
      </Flex>

      <div className={Classes["verticalDivider"]}></div>
      {gameStatus === "WAITING" && (
        <Flex className={Classes["waitingroom-container"]}>
          <Flex className={Classes["waitingroom-title"]}>
            <UsersRound
              size={"4rem"}
              className={Classes["header-icon"]}
              stroke="var(--primary)"
            />
            <Text size="xl" className={Classes["waitingroom-label"]}>
              Waiting Room
            </Text>
          </Flex>
          <Flex
            className={`${Classes["status-container"]} ${Classes["waiting"]}`}
          >
            <Text span size="xl" className={`${Classes["status-text"]}`}>
              Waiting
            </Text>
          </Flex>
        </Flex>
      )}
      {gameStatus === "PLAYING" && (
        <GameRoundStatus completedRounds={1} totalRounds={5} />
      )}

      <div className={Classes["verticalDivider"]}></div>
      <Timer />
    </header>
  );
};

export default Header;
