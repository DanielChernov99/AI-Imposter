import { Text, Button, Input, Stack } from "@mantine/core";
import styles from "./JoinRoom.module.css";

export default function JoinRoom() {
  return (
    <Stack>
      <Text className={styles.title}>Join a room</Text>
      <Input className={styles.inputRoomID} placeholder="Room ID" />
      <Button className={styles.joinButton}>Join Game</Button>
    </Stack>
  );
}
