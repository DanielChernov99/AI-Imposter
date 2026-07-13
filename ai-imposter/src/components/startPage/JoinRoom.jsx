import { useState } from "react";
import { Flex, Text, Button, Input, Box } from "@mantine/core";
import { ArrowUpRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import { ROOM_CODE_LENGTH } from "../../domain/constants.js";
import { useStores } from "../../context/StoreContext.jsx";
import styles from "./JoinRoom.module.css";

function JoinRoom({ nickname }) {
  const [roomCode, setRoomCode] = useState("");

  const { roomStore } = useStores();
  const navigate = useNavigate();

  const handleRoomCodeChange = (event) => {
    const newRoomCode = event.currentTarget.value
      .replace(/\D/g, "")
      .slice(0, ROOM_CODE_LENGTH);

    setRoomCode(newRoomCode);

    if (roomStore.error?.source === "join") {
      roomStore.clearError();
    }
  };

  const handleJoinRoom = async () => {
    const wasJoined = await roomStore.joinRoom({
      nickname,
      roomCode,
    });

    if (wasJoined) {
      navigate("/lobby");
    }
  };

  return (
    <Flex className={styles.elementContainer}>
      <Flex className={styles.titleRow} gap={8}>
        <ArrowUpRight size={16} color="var(--accent-blue)" />
        <Text className={styles.title}>Join a room</Text>
      </Flex>

      <Input
        className={styles.inputRoomID}
        placeholder="Room Code"
        value={roomCode}
        onChange={handleRoomCodeChange}
        maxLength={ROOM_CODE_LENGTH}
        inputMode="numeric"
        aria-label="Room code"
      />

      <Button
        className={styles.joinButton}
        variant="default"
        onClick={handleJoinRoom}
        loading={roomStore.isLoading}
      >
        Join Game
      </Button>

      <Box className={styles.errorSlot} aria-live="polite">
        {roomStore.error?.source === "join" && (
          <Text className={styles.errorMessage} role="alert">
            {roomStore.error.message}
          </Text>
        )}
      </Box>
    </Flex>
  );
}

export default observer(JoinRoom);
