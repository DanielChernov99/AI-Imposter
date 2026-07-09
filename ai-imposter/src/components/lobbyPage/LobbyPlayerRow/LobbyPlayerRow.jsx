import { Avatar, Badge, Group, Text } from "@mantine/core";
import styles from "./LobbyPlayerRow.module.css";

export default function LobbyPlayerRow({ player, isCurrentPlayer }) {
  return (
    <Group className={styles.row} justify="space-between" wrap="nowrap">
      <Group className={styles.playerInfo} wrap="nowrap">
        <Avatar src={player.img} radius="xl" size="lg" />

        <Group className={styles.nameGroup} gap="xs" wrap="nowrap">
          <Text fw={700}>{player.nickname}</Text>

          {isCurrentPlayer && <Badge>YOU</Badge>}
        </Group>
      </Group>

      <Badge className={styles.readyBadge} color="green">
        READY
      </Badge>
    </Group>
  );
}
