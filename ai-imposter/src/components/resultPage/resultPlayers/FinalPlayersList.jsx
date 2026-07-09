import { Stack } from "@mantine/core";
import FinalPlayerRow from "./FinalPlayerRow";
import styles from "./FinalPlayersList.module.css";

export default function FinalPlayersList({ players = [], startPlace = 4 }) {
  if (players.length === 0) {
    return null;
  }

  return (
    <Stack
      className={styles.list}
      gap={0}
      align="stretch"
      justify="flex-start"
      w="min(760px, 90vw)"
      mx="auto"
    >
      {players.map((player, index) => (
        <FinalPlayerRow
          key={player.id}
          player={player}
          place={startPlace + index}
        />
      ))}
    </Stack>
  );
}
