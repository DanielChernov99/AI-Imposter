import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
import GameGrid from "../components/gamepage/gameGrid/GameGrid";
import Header from "../components/layout/header/Header.jsx";
import Leaderboards from "../components/shared/leaderboard/Leaderboards.jsx";
import RoundPoints from "../components/shared/roundPoints/RoundPoints.jsx";
import { useStores } from "../context/StoreContext.jsx";
import { GAME_PHASE } from "../domain/constants.js";
import styles from "../styles/GamePage.module.css";

const GamePage = observer(() => {
  const { roomStore, gameStore, questionStore, revealStore } = useStores();
  const { currentGame } = gameStore;
  const { currentQuestion } = questionStore;
  const phase = gameStore.currentPhase;
  const navigate = useNavigate();

  const handleLeaveRoom = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

  if (!currentGame || !currentQuestion) {
    return <Header onLeaveRoom={handleLeaveRoom} />;
  }

  return (
    <>
      <Header onLeaveRoom={handleLeaveRoom} />

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          gap: "20px",
          minHeight: "80vh",
        }}
      >
        <QuestionBox question={currentQuestion.text} />
        <InstructionLabel phase={phase} />
        {phase === GAME_PHASE.ANSWERING && <AnswerBox />}
        <GameGrid phase={phase} />
        {phase === GAME_PHASE.REVEAL && (
          <div className={styles.revealScores}>
            <RoundPoints players={revealStore.roundPoints} />
            <Leaderboards players={revealStore.leaderboard} />
          </div>
        )}
      </section>
    </>
  );
});

export default GamePage;
