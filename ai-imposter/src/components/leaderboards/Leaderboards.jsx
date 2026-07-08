import { Avatar, Card, Group, Stack, Text } from "@mantine/core";
import LeaderboardPlayer from "./LeaderboardPlayer.jsx";

export default function Leaderboards({ players = [] }) {
  return (
    <Card shadow="sm" padding="md" radius="md">
      <Stack>
        <Text fw={900}>LEADERBOARD</Text>

        {players.map((player, index) => (
          <LeaderboardPlayer key={player.id} player={player} rank={index + 1} />
        ))}
      </Stack>
    </Card>
  );
}
