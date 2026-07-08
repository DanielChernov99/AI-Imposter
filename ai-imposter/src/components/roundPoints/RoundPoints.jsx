import { Card, Stack, Text, Group, ThemeIcon } from "@mantine/core";
import RoundPointPlayer from "./RoundPointPlayer.jsx";
import styles from "../../styles/RoundPoints.module.css";

export default function RoundPoints({ players = [] }) {
  return (
    <Card className={styles.card} shadow="sm" radius="lg">
      <Group className={styles.header} wrap="nowrap">
        <ThemeIcon className={styles.icon} size={42} radius="xl">
          ✦
        </ThemeIcon>

        <Text className={styles.title} fw={900}>
          ROUND POINTS
        </Text>
      </Group>

      <Stack gap={0}>
        {players.map((player, index) => (
          <RoundPointPlayer key={player.id} player={player} rank={index + 1} />
        ))}
      </Stack>
    </Card>
  );
}
