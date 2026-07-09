import { Stack } from "@mantine/core";
import LobbyPlayerRow from "../LobbyPlayerRow/LobbyPlayerRow";

export default function LobbyPlayerList({ players, currentPlayerId }) {
  return (
    <Stack w="100%">
      {players.map((player) => (
        <LobbyPlayerRow
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayerId}
        />
      ))}
    </Stack>
  );
}
