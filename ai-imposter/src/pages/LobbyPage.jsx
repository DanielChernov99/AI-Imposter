import { useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";

import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";

function LobbyPage() {
  const rootStore = useStores();
  const { roomStore } = rootStore;
  const navigate = useNavigate();

  // Room Realtime sync is managed by RootStore for the room's whole
  // lifetime (lobby -> countdown -> game -> results), so it must not be
  // stopped when this page unmounts — only refresh the player list here.
  useEffect(() => {
    roomStore.loadCurrentRoomPlayers();
  }, [roomStore]);

  // Game start + navigation are handled automatically: when everyone is
  // ready a RootStore reaction calls the start_game RPC, and ProtectedRoute
  // redirects to /game once the room status flips to "playing".
  const handleLeaveRoom = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

  return (
    <>
      <Header onLeaveRoom={handleLeaveRoom} />
      <main className={styles.page}>
        <LobbyCard />
      </main>
    </>
  );
}

export default observer(LobbyPage);
