import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";
import { observer } from "mobx-react-lite";

function LobbyPage() {
  const { roomStore } = useStores();

  return (
    <main className={styles.page}>
      <Header gameStatus="WAITING" />

      <LobbyCard
        players={roomStore.players}
        currentPlayerId={3}
        capacity={roomStore.currentRoom?.capacity ?? 0}
        isCurrentPlayerReady={true}
        onReadyClick={() => console.log("ready clicked")}
      />
    </main>
  );
}

export default observer(LobbyPage);
