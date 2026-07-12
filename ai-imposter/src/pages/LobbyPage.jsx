import { useEffect } from "react";

import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";

function LobbyPage() {
  const { roomStore } = useStores();

  useEffect(() => {
    roomStore.loadCurrentRoomPlayers();
  }, [roomStore]);

  return (
    <main className={styles.page}>
      <Header />
      <LobbyCard />
    </main>
  );
}

export default LobbyPage;
