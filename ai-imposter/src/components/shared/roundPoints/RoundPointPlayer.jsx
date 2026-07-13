import { Group, Box, Avatar, Text } from "@mantine/core";
import styles from "./RoundPointPlayer.module.css";
import star from "../../../assets/icons/star.svg";

export default function RoundPointPlayer({ player, rank }) {
  const hasPoints = player.pointsEarned > 0;

  const rankClassName = [
    styles.rank,
    rank === 1 && styles.rankFirst,
    rank === 2 && styles.rankSecond,
    rank === 3 && styles.rankThird,
    rank > 3 && styles.rankMuted,
  ]
    .filter(Boolean)
    .join(" ");

  const pointsClassName = [styles.points, !hasPoints && styles.pointsMuted]
    .filter(Boolean)
    .join(" ");

  const starClassName = [styles.star, !hasPoints && styles.starMuted]
    .filter(Boolean)
    .join(" ");

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
        <Text className={pointsClassName}>+{player.pointsEarned}</Text>
        <img
          src={star}
          alt=""
          aria-hidden="true"
          className={starClassName}
        />
      </Group>
    </Group>
  );
}
