import { Avatar, Badge, Group, Text } from "@mantine/core";

export default function LobbyPlayerRow({ player, isCurrentPlayer }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Group wrap="nowrap">
        <Avatar src={player.img} radius="xl" size="lg" />

        <Group gap="xs" wrap="nowrap">
          <Text fw={700}>{player.nickname}</Text>

          {isCurrentPlayer && <Badge>YOU</Badge>}
        </Group>
      </Group>

      <Badge color="green">READY</Badge>
    </Group>
  );
}
