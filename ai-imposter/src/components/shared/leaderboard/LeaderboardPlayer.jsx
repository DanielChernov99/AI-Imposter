import { Group, Box, Avatar, Text } from "@mantine/core";
import styles from "./LeaderboardPlayer.module.css";
import star from "../../../assets/icons/star.svg";

export default function LeaderboardPlayer({ player }) {
  const { rank } = player;
  const rankClassName =
    rank <= 3 ? styles.rank : `${styles.rank} ${styles.rankMuted}`;

  return (
    <Group className={styles.row} justify="space-between" wrap="nowrap">
      <Group className={styles.playerInfo} wrap="nowrap">
        <Box className={rankClassName}>{rank}</Box>

        <Avatar
          src={player.avatarUrl}
          alt={player.nickname}
          radius="xl"
          className={styles.avatar}
        />

        <Text className={styles.nickname} fw={800} truncate>
          {player.nickname}
        </Text>
      </Group>

      <Group className={styles.score} wrap="nowrap">
        <Text className={styles.points}>{player.totalScore}</Text>
        <img src={star} alt="" aria-hidden="true" className={styles.star} />
      </Group>
    </Group>
  );
}
