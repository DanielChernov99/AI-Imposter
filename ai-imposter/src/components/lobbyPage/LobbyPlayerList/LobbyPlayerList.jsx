import { Flex } from "@mantine/core";
import LobbyPlayerRow from "../LobbyPlayerRow/LobbyPlayerRow";
import styles from "./LobbyPlayerList.module.css";

export default function LobbyPlayerList({ players, currentPlayerId }) {
  return (
    <Flex className={styles.list}>
      {players.map((player) => (
        <LobbyPlayerRow
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayerId}
        />
      ))}
    </Flex>
  );
}
