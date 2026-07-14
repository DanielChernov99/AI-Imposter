import { useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";

import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";

const LOBBY_ERROR_SOURCES = new Set([
  "loadPlayers",
  "ready",
  "startGame",
  "leave",
  "realtime",
]);

function LobbyPage() {
  const rootStore = useStores();
  const { roomStore } = rootStore;
  const navigate = useNavigate();
  const lobbyErrorMessage = LOBBY_ERROR_SOURCES.has(roomStore.error?.source)
    ? roomStore.error.message
    : null;

  // Room Realtime sync is managed by RootStore for the room's whole
  // lifetime (lobby -> countdown -> game -> results), so it must not be
  // stopped when this page unmounts — only refresh the player list here.
  useEffect(() => {
    let isMounted = true;

    void roomStore.loadCurrentRoomPlayers().then(() => {
      if (!isMounted && roomStore.error?.source === "loadPlayers") {
        roomStore.clearError();
      }
    });

    return () => {
      isMounted = false;

      if (
        roomStore.error?.source !== "realtime" &&
        LOBBY_ERROR_SOURCES.has(roomStore.error?.source)
      ) {
        roomStore.clearError();
      }
    };
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
        <LobbyCard errorMessage={lobbyErrorMessage} />
      </main>
    </>
  );
}

export default observer(LobbyPage);
