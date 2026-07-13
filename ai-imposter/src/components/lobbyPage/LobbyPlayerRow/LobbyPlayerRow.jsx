import { Avatar, Badge, Flex, Text } from "@mantine/core";
import { CheckCircle } from "lucide-react";
import styles from "./LobbyPlayerRow.module.css";

export default function LobbyPlayerRow({ player, isCurrentPlayer }) {
  return (
    <Flex
      className={`${styles.row} ${isCurrentPlayer ? styles.currentPlayer : ""}`}
      justify="space-between"
      wrap="nowrap"
    >
      <Flex className={styles.playerInfo} wrap="nowrap">
        <Avatar
          src={player.avatarUrl}
          radius="xl"
          size="lg"
          className={styles.avatar}
        />

        <Flex gap="xs" wrap="nowrap">
          <Text className={styles.nickname}>{player.nickname}</Text>

          {isCurrentPlayer && <Badge className={styles.youBadge}>YOU</Badge>}
        </Flex>
      </Flex>

      <Badge
        className={`${styles.readyBadge} ${
          player.isReady ? styles.ready : styles.waiting
        }`}
        leftSection={player.isReady ? <CheckCircle size={14} /> : undefined}
      >
        {player.isReady ? "READY" : "WAITING"}
      </Badge>
    </Flex>
  );
}
