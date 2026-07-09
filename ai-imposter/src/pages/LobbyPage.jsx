import { mockRoundPoints } from "../mockData/mockRoundPoints";
import LobbyCard from "../components/lobbyPage/lobbyCard/LobbyCard.jsx";

export default function LobbyPage(params) {
  // this is only for the mock testing later it will be changed
  const players = mockRoundPoints.map((player) => ({
    ...player,
    isReady: true,
  }));

  return (
    <main>
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
