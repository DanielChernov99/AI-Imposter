import { Flex, Card, Text } from "@mantine/core";
import LobbyTitle from "../lobbyTitle/LobbyTitle";
import LobbyPlayerList from "../LobbyPlayerList/LobbyPlayerList";
import LobbyReadyButton from "../LobbyReadyButton/LobbyReadyButton";
import styles from "./LobbyCard.module.css";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../context/StoreContext.jsx";

function LobbyCard({ errorMessage }) {
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
      <Flex align="center" className={styles.content}>
        <LobbyTitle
          joinedCount={currentRoomPlayers.length}
          capacity={currentRoom?.capacity ?? 0}
          roomStatus={currentRoom?.status}
          errorMessage={errorMessage}
        />

        <LobbyPlayerList
          players={currentRoomPlayers}
          currentPlayerId={currentPlayer?.id}
        />

        <LobbyReadyButton
          isReady={currentPlayer?.isReady ?? false}
          isLoading={roomStore.isLoading}
          onClick={handleReadyClick}
        />

        <Text span className={styles.hint}>
          When the room is full and everyone is ready, the game starts
          automatically.
        </Text>
      </Flex>
    </Card>
  );
}

export default observer(LobbyCard);
