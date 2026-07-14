import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
import GameGrid from "../components/gamepage/gameGrid/GameGrid";
import Header from "../components/layout/header/Header.jsx";
import Leaderboards from "../components/shared/leaderboard/Leaderboards.jsx";
import RoundPoints from "../components/shared/roundPoints/RoundPoints.jsx";
import InlineErrorMessage from "../components/shared/inlineErrorMessage/InlineErrorMessage.jsx";
import { useStores } from "../context/StoreContext.jsx";
import { GAME_PHASE } from "../domain/constants.js";
import styles from "../styles/GamePage.module.css";

const QUESTION_PHASES = new Set([
  GAME_PHASE.ANSWERING,
  GAME_PHASE.VOTING,
  GAME_PHASE.REVEAL,
]);

function getActiveError({
  phase,
  hasQuestion,
  gameError,
  questionError,
  answerError,
  voteError,
  revealError,
}) {
  if (gameError) {
    return gameError;
  }

  if (questionError && (!hasQuestion || QUESTION_PHASES.has(phase))) {
    return questionError;
  }

  if (phase === GAME_PHASE.ANSWERING) {
    return answerError;
  }

  if (phase === GAME_PHASE.VOTING) {
    return voteError;
  }

  if (phase === GAME_PHASE.REVEAL) {
    return revealError;
  }

  return null;
}

const GamePage = observer(() => {
  const {
    roomStore,
    gameStore,
    questionStore,
    answerStore,
    voteStore,
    revealStore,
  } = useStores();
  const { currentGame } = gameStore;
  const { currentQuestion } = questionStore;
  const phase = gameStore.currentPhase;
  const navigate = useNavigate();
  const activeError = getActiveError({
    phase,
    hasQuestion: Boolean(currentQuestion),
    gameError: gameStore.error,
    questionError: questionStore.error,
    answerError: answerStore.error,
    voteError: voteStore.error,
    revealError: revealStore.error,
  });

  const handleLeaveRoom = async () => {
    const didLeave = await roomStore.leaveRoom();

    if (didLeave) {
      navigate("/");
    }
  };

  if (!currentGame || !currentQuestion) {
    return (
      <>
        <Header onLeaveRoom={handleLeaveRoom} />
        {activeError && (
          <main className={styles.loadErrorLayout}>
            <InlineErrorMessage message={activeError.message} />
          </main>
        )}
      </>
    );
  }

  return (
    <>
      <Header onLeaveRoom={handleLeaveRoom} />

      <main className={styles.pageLayout}>
        <section className={styles.mainColumn}>
          <QuestionBox question={currentQuestion.text} />
          <div className={styles.phaseMessageSlot}>
            <div className={activeError ? styles.hiddenInstruction : ""}>
              <InstructionLabel phase={phase} />
            </div>
            <InlineErrorMessage message={activeError?.message} />
          </div>
          {phase === GAME_PHASE.ANSWERING && <AnswerBox />}
          <GameGrid phase={phase} />
        </section>

        <aside className={styles.sidebar}>
          {phase === GAME_PHASE.REVEAL && (
            <RoundPoints players={revealStore.roundPoints} />
          )}
          <Leaderboards
            players={
              phase === GAME_PHASE.REVEAL
                ? revealStore.leaderboard
                : roomStore.currentRoomPlayers
            }
          />
        </aside>
      </main>
    </>
  );
});

export default GamePage;
