import { Stack, NumberInput, Text, Button } from "@mantine/core";
import styles from "./StartNewGame.module.css";

export default function StartNewGame() {
  return (
    <Stack className={styles.elementContainer}>
      <Text className={styles.title}>Start New Game</Text>
      <NumberInput
        className={styles.numOfPlayers}
        min={2}
        max={5}
        defaultValue={2}
      />
      <Button className={styles.startGameButton}>Start Game</Button>
    </Stack>
  );
}
