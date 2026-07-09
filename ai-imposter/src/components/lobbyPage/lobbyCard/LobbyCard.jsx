import { Card, Stack, Text } from "@mantine/core";
import LobbyTitle from "../lobbyTitle/LobbyTitle";
import LobbyPlayerList from "../lobbyPlayerList/LobbyPlayerList";
import LobbyReadyButton from "../LobbyReadyButton/LobbyReadyButton";

export default function LobbyCard({
  players,
  currentPlayerId,
  requiredPlayers,
  isCurrentPlayerReady,
  onReadyClick,
}) {
  return (
    <Card>
      <Stack align="center">
        <LobbyTitle
          joinedCount={players.length}
          requiredPlayers={requiredPlayers}
        />

        <LobbyPlayerList players={players} currentPlayerId={currentPlayerId} />

        <LobbyReadyButton
          isReady={isCurrentPlayerReady}
          onClick={onReadyClick}
        />

        <Text>When all players are ready, the game starts automatically.</Text>
      </Stack>
    </Card>
  );
}
