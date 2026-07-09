import { Text, Button, Input, Stack, Group } from "@mantine/core";
import { ArrowUpRight } from "lucide-react";
import styles from "./JoinRoom.module.css";

export default function JoinRoom() {
  return (
    <Stack className={styles.elementContainer}>
      <Group className={styles.titleRow} gap={8}>
        <ArrowUpRight size={16} color="var(--accent-blue)" />
        <Text className={styles.title}>Join a room</Text>
      </Group>

      <Input className={styles.inputRoomID} placeholder="Room ID" />

      <Button className={styles.joinButton} variant="default">
        Join Game
      </Button>
    </Stack>
  );
}
