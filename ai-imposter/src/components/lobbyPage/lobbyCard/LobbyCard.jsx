import { Card, Stack, Text } from "@mantine/core";
import LobbyTitle from "../lobbyTitle/LobbyTitle";
import LobbyPlayerList from "../lobbyPlayerList/LobbyPlayerList";
import LobbyReadyButton from "../LobbyReadyButton/LobbyReadyButton";
import styles from "./LobbyCard.module.css";

export default function LobbyCard({
  players = [],
  currentPlayerId,
  capacity,
  isCurrentPlayerReady,
  onReadyClick,
}) {
  return (
    <Card className={styles.card}>
      <Stack align="center" className={styles.content}>
        <LobbyTitle joinedCount={players.length} capacity={capacity} />

        <LobbyPlayerList players={players} currentPlayerId={currentPlayerId} />

        <LobbyReadyButton
          isReady={isCurrentPlayerReady}
          onClick={onReadyClick}
        />

        <Text className={styles.hint}>
          When all players are ready, the game starts automatically.
        </Text>
      </Stack>
    </Card>
  );
}
