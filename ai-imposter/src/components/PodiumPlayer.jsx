import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import star from "../assets/icons/star.svg";
import styles from "../styles/PodiumPlayer.module.css";

export default function PodiumPlayer({ player, place }) {
  return (
    <Stack align="center" gap={4} w="100%" ta="center">
      <Box className={styles.avatarBlock}>
        <Box className={styles.rank}>{place}</Box>

        <Avatar
          src={player.img}
          alt={player.nickname}
          classNames={{
            root: styles.avatarRoot,
            image: styles.avatarImage,
          }}
        />
      </Box>

      <Text
        className={styles.name}
        fw={800}
        c="var(--text-main)"
        lh={1.1}
        ta="center"
        w="100%"
        truncate
      >
        {player.nickname}
      </Text>

      <Group
        gap={4}
        justify="center"
        wrap="nowrap"
        className={styles.points}
        w="100%"
      >
        <img src={star} alt="" className={styles.star} />
        <Text span fw={700} lh={1}>
          {player.points} points
        </Text>
      </Group>
    </Stack>
  );
}
