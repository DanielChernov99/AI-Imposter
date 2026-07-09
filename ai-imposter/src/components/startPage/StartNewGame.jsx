import { Stack, Text, Button } from "@mantine/core";
import styles from "./StartNewGame.module.css";

export default function StartNewGame() {
  return (
    <Stack>
      <Text className={styles.title}>Start New Game</Text>
      <Button className={styles.startGameButton}>Start Game</Button>
    </Stack>
  );
}
