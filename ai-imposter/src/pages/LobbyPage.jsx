import { useEffect } from "react";
import { useNavigate } from "react-router";

import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";

function LobbyPage() {
  const rootStore = useStores();
  const { roomStore } = rootStore;
  const navigate = useNavigate();

  useEffect(() => {
    roomStore.loadCurrentRoomPlayers();
  }, [roomStore]);

  const handleGameStart = async () => {
    const didStart = await rootStore.startCurrentRoomGame();

    if (didStart) {
      navigate("/game");
    }
  };

  const handleLeaveRoom = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

  return (
    <main className={styles.page}>
      <Header
        onGameStart={handleGameStart}
        onLeaveRoom={handleLeaveRoom}
      />
      <LobbyCard />
    </main>
  );
}

export default LobbyPage;
