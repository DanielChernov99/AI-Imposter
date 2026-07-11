import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import VotingGrid from "../components/gamepage/votingGrid/VotingGrid";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
const GamePage = ({ phase = "VOTING" }) => {
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
      {phase === "VOTING" && <VotingGrid />}
    </section>
  );
};

export default GamePage;
