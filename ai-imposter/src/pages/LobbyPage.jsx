import { mockRoundPoints } from "../mockData/mockRoundPoints";
import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";
import styles from "../styles/LobbyPage.module.css";
import Header from "../components/layout/header/Header.jsx";

export default function LobbyPage() {
  // this is only for the mock testing later it will be changed
  const players = mockRoundPoints.map((player) => ({
    ...player,
    isReady: true,
  }));

  return (
    <main className={styles.page}>
      <Header gameStatus="WAITING" />

      <LobbyCard
        players={players}
        currentPlayerId={3}
        requiredPlayers={5}
        isCurrentPlayerReady={true}
        onReadyClick={() => console.log("ready clicked")}
      />
    </main>
  );
}
