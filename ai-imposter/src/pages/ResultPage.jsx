import Header from "../components/layout/header/Header";
import Podium from "../components/resultPage/podium/Podium";
import ResultActions from "../components/resultPage/resultActions/ResultActions";
import FinalPlayersList from "../components/resultPage/resultPlayers/FinalPlayersList";
import { mockRoundPoints } from "../mockData/mockRoundPoints";

export default function ResultPage() {
  const sortedPlayers = [...mockRoundPoints].sort(
    (a, b) => b.points - a.points,
  );

  const podiumPlayers = sortedPlayers.slice(0, 3);
  const otherPlayers = sortedPlayers.slice(3);

  return (
    <>
      <Header />
      <Podium players={podiumPlayers} />
      <FinalPlayersList players={otherPlayers} />
      <ResultActions />
    </>
  );
}
