import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
import GameGrid from "../components/gamepage/gameGrid/GameGrid";
const GamePage = ({ phase = "REVEALING" }) => {
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
      <QuestionBox />
      <InstructionLabel phase={phase} />
      {phase === "ANSWERING" && <AnswerBox />}
      <GameGrid phase={phase} />
    </section>
  );
};

export default GamePage;
