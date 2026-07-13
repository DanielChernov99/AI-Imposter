import { Box } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import Header from "../components/layout/header/Header";
import Podium from "../components/resultPage/podium/Podium";
import ResultActions from "../components/resultPage/resultActions/ResultActions";
import FinalPlayersList from "../components/resultPage/resultPlayers/FinalPlayersList";
import { useStores } from "../context/StoreContext.jsx";
import styles from "../styles/ResultPage.module.css";

const ResultPage = observer(() => {
  const { roomStore, gameStore } = useStores();
  const navigate = useNavigate();

  const handleQuit = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

  // Prefer the snapshot taken by the server at the moment the game finished:
  // it still includes players who left the room afterwards. Fall back to the
  // live player list (e.g. if this page is somehow reached mid-game).
  const finalStandings = gameStore.currentGame?.finalStandings;

  const sortedPlayers = finalStandings?.length
    ? finalStandings.map((standing) => ({
        id: standing.playerId,
        nickname: standing.nickname,
        points: standing.totalScore ?? 0,
        img: standing.avatarUrl,
      }))
    : [...roomStore.currentRoomPlayers]
        .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
        .map((player) => ({
          id: player.id,
          nickname: player.nickname,
          points: player.totalScore ?? 0,
          img: player.avatarUrl,
        }));

  const podiumPlayers = sortedPlayers.slice(0, 3);
  const otherPlayers = sortedPlayers.slice(3);

  return (
    <Box className={styles.page}>
      <Header onLeaveRoom={handleQuit} />

      <main className={styles.content}>
        <Podium players={podiumPlayers} />
        <FinalPlayersList players={otherPlayers} />
        <ResultActions onQuit={handleQuit} isQuitting={roomStore.isLoading} />
      </main>
    </Box>
  );
});

export default ResultPage;
