import { Group, Stack, Text, Title } from "@mantine/core";
import { Users } from "lucide-react";
import styles from "./LobbyTitle.module.css";

export default function LobbyTitle({ joinedCount, requiredPlayers }) {
  return (
    <Stack align="center" className={styles.wrapper}>
      <Group className={styles.titleRow}>
        <Users className={styles.mainIcon} />
        <Title order={1} className={styles.title}>
          Waiting for players
        </Title>
      </Group>

      <Text className={styles.subtitle}>
        All players are connected and ready. The game is about to begin!
      </Text>

      <Group className={styles.countRow}>
        <Users className={styles.countIcon} />
        <Text className={styles.countText}>
          {joinedCount} / {requiredPlayers} players joined
        </Text>
      </Group>
    </Stack>
  );
}
