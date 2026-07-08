import { Group, Box, Avatar, Text } from "@mantine/core";
import styles from "../../styles/LeaderboardPlayer.module.css";
import star from "../../assets/icons/star.svg";

export default function LeaderboardPlayer({ player, rank }) {
  return (
    <Group>
      <Box className={styles.rank}>{rank}</Box>
      <Avatar src={player.img} alt={player.nickname} />
      <Text>{player.nickname}</Text>
      <Group>
        <Text className={styles.points}>{player.points}</Text>
        <img src={star} alt="⭐" className={styles.star} />
      </Group>
    </Group>
  );
}
