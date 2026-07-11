import { useState } from "react";
import { Stack, Group, Box, Text, Button } from "@mantine/core";
import { Play, Minus, Plus } from "lucide-react";
import styles from "./StartNewGame.module.css";
import { MIN_PLAYERS, MAX_PLAYERS } from "../../domain/constants";
import { useStores } from "../../context/StoreContext.jsx";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

function StartNewGame({ nickname }) {
  const [roomCapacity, setRoomCapacity] = useState(MIN_PLAYERS);

  const { roomStore } = useStores();
  const navigate = useNavigate();

  const decrement = () =>
    setRoomCapacity((count) => Math.max(MIN_PLAYERS, count - 1));
  const increment = () =>
    setRoomCapacity((count) => Math.min(MAX_PLAYERS, count + 1));

  const handleCreateRoom = async () => {
    const wasCreated = await roomStore.createRoom({
      nickname,
      capacity: roomCapacity,
    });
    if (wasCreated) {
      navigate("/lobby");
    }
  };

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
          disabled={roomCapacity <= MIN_PLAYERS}
          aria-label="Decrease player count"
        >
          <Minus size={16} />
        </Button>
        <Box className={styles.stepperValue}>{roomCapacity}</Box>
        <Button
          variant="default"
          className={styles.stepperButton}
          onClick={increment}
          disabled={roomCapacity >= MAX_PLAYERS}
          aria-label="Increase player count"
        >
          <Plus size={16} />
        </Button>
      </Group>

      <Button
        className={styles.startGameButton}
        variant="default"
        onClick={handleCreateRoom}
        loading={roomStore.isLoading}
      >
        Start Game
      </Button>
    </Stack>
  );
}

export default observer(StartNewGame);
