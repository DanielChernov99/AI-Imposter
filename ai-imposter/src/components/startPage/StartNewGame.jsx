import { useState } from "react";
import { Stack, Group, Box, Text, Button } from "@mantine/core";
import { Play, Minus, Plus } from "lucide-react";
import styles from "./StartNewGame.module.css";

export default function StartNewGame() {
  const [playerCount, setPlayerCount] = useState(2);

  const decrement = () => setPlayerCount((count) => Math.max(2, count - 1));
  const increment = () => setPlayerCount((count) => Math.min(9, count + 1));

  return (
    <Stack className={styles.elementContainer}>
      <Group className={styles.titleRow} gap={8}>
        <Play size={16} color="var(--accent-violet)" />
        <Text className={styles.title}>Start new game</Text>
      </Group>

      <Group className={styles.stepperRow} gap={8}>
        <Button
          variant="default"
          className={styles.stepperButton}
          onClick={decrement}
          disabled={playerCount <= 2}
          aria-label="Decrease player count"
        >
          <Minus size={16} />
        </Button>
        <Box className={styles.stepperValue}>{playerCount}</Box>
        <Button
          variant="default"
          className={styles.stepperButton}
          onClick={increment}
          disabled={playerCount >= 5}
          aria-label="Increase player count"
        >
          <Plus size={16} />
        </Button>
      </Group>

      <Button className={styles.startGameButton} variant="default">
        Start Game
      </Button>
    </Stack>
  );
}
