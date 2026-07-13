import { Flex, Text, Title } from "@mantine/core";
import { Users } from "lucide-react";
import styles from "./LobbyTitle.module.css";

export default function LobbyTitle({ joinedCount, capacity }) {
  return (
    <Flex align="center" className={styles.wrapper}>
      <Flex className={styles.titleRow}>
        <Users className={styles.mainIcon} />
        <Title order={1} className={styles.title}>
          Waiting for players
        </Title>
      </Flex>

      <Text className={styles.subtitle}>
        All players are connected and ready. The game is about to begin!
      </Text>

      <Flex className={styles.countRow}>
        <Users className={styles.countIcon} />
        <Text className={styles.countText}>
          {joinedCount} / {capacity} players joined
        </Text>
      </Flex>
    </Flex>
  );
}
