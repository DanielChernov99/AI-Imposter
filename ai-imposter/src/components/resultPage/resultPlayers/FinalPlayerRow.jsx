import { Image, Avatar, Box, Group, Text } from "@mantine/core";
import styles from "./FinalPlayerRow.module.css";
import star from "../../../assets/icons/star.svg";

export default function FinalPlayerRow({ player, place }) {
  return (
    <Group
      className={styles.row}
      justify="space-between"
      wrap="nowrap"
      py="xs"
      px="xl"
    >
      <Group className={styles.playerInfo} gap="md" wrap="nowrap">
        <Box className={styles.rank}>{place}</Box>

        <Avatar
          src={player.img}
          alt={player.nickname}
          size={44}
          radius="xl"
          className={styles.avatar}
        />

        <Text c="var(--text-main)" size="lg" fw={800} truncate>
          {player.nickname}
        </Text>
      </Group>

      <Group
        className={styles.score}
        gap={8}
        wrap="nowrap"
        justify="flex-start"
      >
        <Image src={star} alt="star" w={20} h={20} />

        <Text c="var(--text-main)" className={styles.points} fw={800}>
          {player.points} points
        </Text>
      </Group>
    </Group>
  );
}
