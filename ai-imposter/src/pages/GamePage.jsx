import { observer } from "mobx-react-lite";

import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
import GameGrid from "../components/gamepage/gameGrid/GameGrid";
import { useStores } from "../context/StoreContext.jsx";
import { GAME_PHASE } from "../domain/constants.js";

const GamePage = observer(() => {
  const rootStore = useStores();
  const { gameStore, questionStore, answerStore } = rootStore;
  const { currentGame } = gameStore;
  const { currentQuestion } = questionStore;

  const handleSubmitAnswer = (text) =>
    rootStore.submitCurrentPlayerAnswer(text);

  if (!currentGame || !currentQuestion) {
    return null;
  }

  const { phase } = currentGame;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        gap: "20px",
        minHeight: "100vh",
      }}
    >
      <QuestionBox question={currentQuestion.text} />
      <InstructionLabel phase={phase} />
      {phase === GAME_PHASE.ANSWERING && (
        <AnswerBox
          onSubmit={handleSubmitAnswer}
          isSubmitting={answerStore.isLoading}
          isSubmitted={Boolean(answerStore.currentPlayerAnswer)}
          errorMessage={answerStore.error?.message}
        />
      )}
      <GameGrid phase={phase} />
    </section>
  );
});

export default GamePage;
