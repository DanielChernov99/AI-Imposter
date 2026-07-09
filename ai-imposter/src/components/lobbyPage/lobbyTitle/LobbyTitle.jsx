import { Group, Stack, Text, Title } from "@mantine/core";
import { Users } from "lucide-react";
import styles from "./LobbyTitle.module.css";

export default function LobbyTitle({ joinedCount, requiredPlayers }) {
  return (
    <Stack className={styles.title} align="center">
      <Group className={styles.heading}>
        <Users />
        <Title order={1}>Waiting for players</Title>
      </Group>

      <Text className={styles.subtitle}>
        All players are connected and ready. The game is about to begin!
      </Text>

      <Group className={styles.playerCount}>
        <Users />
        <Text>
          {joinedCount} / {requiredPlayers} players joined
        </Text>
      </Group>
    </Stack>
  );
}
