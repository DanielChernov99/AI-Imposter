import { Stack } from "@mantine/core";
import LobbyPlayerRow from "../LobbyPlayerRow/LobbyPlayerRow";
import styles from "./LobbyPlayerList.module.css";

export default function LobbyPlayerList({ players, currentPlayerId }) {
  return (
    <Stack className={styles.list} w="100%">
      {players.map((player) => (
        <LobbyPlayerRow
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayerId}
        />
      ))}
    </Stack>
  );
}
