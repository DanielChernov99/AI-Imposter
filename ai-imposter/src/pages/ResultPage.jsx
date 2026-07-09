import Header from "../components/Header";
import Podium from "../components/podium/Podium";
import ResultActions from "../components/ResultActions";
import { mockPlayersPodium } from "../mockData/mockPlayersPodium";

export default function ResultPage() {
  return (
    <>
      <Header />
      <Podium players={mockPlayersPodium} />
      <ResultActions />
    </>
  );
}
