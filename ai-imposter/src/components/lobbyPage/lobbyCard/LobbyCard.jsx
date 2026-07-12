import { Card, Stack, Text } from "@mantine/core";
import LobbyTitle from "../lobbyTitle/LobbyTitle";
import LobbyPlayerList from "../lobbyPlayerList/LobbyPlayerList";
import LobbyReadyButton from "../LobbyReadyButton/LobbyReadyButton";
import styles from "./LobbyCard.module.css";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../context/StoreContext.jsx";

function LobbyCard() {
  const { roomStore } = useStores();
  const { currentRoomPlayers, currentRoom, currentPlayer } = roomStore;

  const handleReadyClick = async () => {
    if (!currentPlayer) {
      return;
    }

    await roomStore.setCurrentPlayerReady(!currentPlayer.isReady);
  };

  return (
    <Card className={styles.card}>
      <Stack align="center" className={styles.content}>
        <LobbyTitle
          joinedCount={currentRoomPlayers.length}
          capacity={currentRoom?.capacity ?? 0}
        />

        <LobbyPlayerList
          players={currentRoomPlayers}
          currentPlayerId={currentPlayer?.id}
        />

        <LobbyReadyButton
          isReady={currentPlayer?.isReady ?? false}
          onClick={handleReadyClick}
        />

        <Text className={styles.hint}>
          When all players are ready, the game starts automatically.
        </Text>
      </Stack>
    </Card>
  );
}

export default observer(LobbyCard);
