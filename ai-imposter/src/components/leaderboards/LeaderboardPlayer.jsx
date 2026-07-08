import { Group, Box, Avatar, Text } from "@mantine/core";
import styles from "../../styles/LeaderboardPlayer.module.css";
import star from "../../assets/icons/star.svg";

export default function LeaderboardPlayer({ player, rank }) {
  return (
    <Group justify="space-between" wrap="nowrap" w="100%">
      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
        <Box className={styles.rank}>{rank}</Box>

        <Avatar src={player.img} alt={player.nickname} size={44} radius="xl" />

        <Text className={styles.nickname} fw={800} truncate>
          {player.nickname}
        </Text>
      </Group>

      <Group gap={6} wrap="nowrap" flex="none">
        <Text className={styles.points}>{player.points}</Text>
        <img src={star} alt="⭐" className={styles.star} />
      </Group>
    </Group>
  );
}
