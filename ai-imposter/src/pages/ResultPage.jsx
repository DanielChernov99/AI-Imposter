import Header from "../components/layout/header/Header";
import Podium from "../components/resultPage/podium/Podium";
import ResultActions from "../components/resultPage/resultActions/ResultActions";
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
