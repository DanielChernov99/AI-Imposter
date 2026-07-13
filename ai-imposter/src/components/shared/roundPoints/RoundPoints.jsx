import { Card, Stack, Text, Group, ThemeIcon } from "@mantine/core";
import RoundPointPlayer from "./RoundPointPlayer.jsx";
import styles from "./RoundPoints.module.css";

export default function RoundPoints({ players = [] }) {
  const displayPlayers = (Array.isArray(players) ? players : []).filter(
    (player) => player?.isAi !== true,
  );

  return (
    <Card className={styles.card}>
      <Group className={styles.header} wrap="nowrap">
        <ThemeIcon className={styles.icon} radius="xl">
          ✦
        </ThemeIcon>

        <Text className={styles.title} fw={900}>
          ROUND POINTS
        </Text>
      </Group>

      <Stack gap={0}>
        {displayPlayers.map((player, index) => (
          <RoundPointPlayer
            key={player.playerId ?? player.id ?? `round-player-${index}`}
            player={player}
            rank={index + 1}
          />
        ))}
      </Stack>
    </Card>
  );
}
