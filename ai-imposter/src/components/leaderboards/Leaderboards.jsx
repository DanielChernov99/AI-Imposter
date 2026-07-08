import { Card, Stack, Text } from "@mantine/core";
import LeaderboardPlayer from "./LeaderboardPlayer.jsx";
import styles from "../../styles/Leaderboards.module.css";

export default function Leaderboards({ players = [] }) {
  return (
    <Card
      className={styles.card}
      shadow="sm"
      padding="md"
      radius="md"
      bg="rgba(8, 18, 43, 0.9)"
    >
      <Stack>
        <Text className={styles.title} fw={900}>
          LEADERBOARD
        </Text>

        {players.map((player, index) => (
          <LeaderboardPlayer key={player.id} player={player} rank={index + 1} />
        ))}
      </Stack>
    </Card>
  );
}
