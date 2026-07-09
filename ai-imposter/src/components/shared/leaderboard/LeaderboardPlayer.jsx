import { Group, Box, Avatar, Text } from "@mantine/core";
import styles from "./LeaderboardPlayer.module.css";
import star from "../../../assets/icons/star.svg";

export default function LeaderboardPlayer({ player, rank }) {
  const rankClassName =
    rank <= 3 ? styles.rank : `${styles.rank} ${styles.rankMuted}`;

  return (
    <Group className={styles.row} justify="space-between" wrap="nowrap">
      <Group className={styles.playerInfo} gap="md" wrap="nowrap">
        <Box className={rankClassName}>{rank}</Box>

        <Avatar
          src={player.img}
          alt={player.nickname}
          size={56}
          radius="xl"
          className={styles.avatar}
        />

        <Text className={styles.nickname} fw={800} truncate>
          {player.nickname}
        </Text>
      </Group>

      <Group className={styles.score} gap={10} wrap="nowrap">
        <Text className={styles.points}>{player.points}</Text>
        <img src={star} alt="star" className={styles.star} />
      </Group>
    </Group>
  );
}
