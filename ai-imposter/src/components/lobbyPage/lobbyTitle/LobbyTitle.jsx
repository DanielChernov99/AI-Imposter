import { Group, Stack, Text, Title } from "@mantine/core";
import { Users } from "lucide-react";

export default function LobbyTitle({ joinedCount, requiredPlayers }) {
  return (
    <Stack align="center">
      <Group>
        <Users />
        <Title order={1}>Waiting for players</Title>
      </Group>

      <Text>
        All players are connected and ready. The game is about to begin!
      </Text>

      <Group>
        <Users />
        <Text>
          {joinedCount} / {requiredPlayers} players joined
        </Text>
      </Group>
    </Stack>
  );
}
