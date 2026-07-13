import { useEffect, useState } from "react";
import { Button, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";

import QuestionBox from "../components/gamepage/questionBox/QuestionBox";
import AnswerBox from "../components/gamepage/answerBox/AnswerBox";
import InstructionLabel from "../components/gamepage/instructionLabel/InstructionLabel";
import GameGrid from "../components/gamepage/gameGrid/GameGrid";
import Header from "../components/layout/header/Header.jsx";
import { useStores } from "../context/StoreContext.jsx";
import {
  ANSWERING_DURATION_SECONDS,
  GAME_PHASE,
  VOTING_DURATION_SECONDS,
} from "../domain/constants.js";

const GamePage = observer(() => {
  const rootStore = useStores();
  const { gameStore, questionStore, answerStore, roomStore, voteStore } =
    rootStore;
  const { currentGame } = gameStore;
  const { currentQuestion } = questionStore;
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const phase = currentGame?.phase;
  const gameId = currentGame?.id;
  const currentRound = currentGame?.currentRound;

  useEffect(() => {
    if (
      phase !== GAME_PHASE.VOTING ||
      !gameId ||
      !currentRound ||
      answerStore.votingAnswers.length > 0
    ) {
      return;
    }

    const prepareVotingAnswers = async () => {
      const answers = await answerStore.loadAnswersByRound({
        gameId,
        roundNumber: currentRound,
      });

      if (answers) {
        answerStore.prepareVotingAnswers();
      }
    };

    void prepareVotingAnswers();
  }, [answerStore, currentRound, gameId, phase]);

  const handleSubmitAnswer = (text) =>
    rootStore.submitCurrentPlayerAnswer(text);
  const handleAnsweringComplete = () =>
    rootStore.finishCurrentAnsweringPhase({ force: true });
  const handleVotingComplete = () =>
    rootStore.finishCurrentVotingPhase({ force: true });
  const handleSubmitVote = () =>
    rootStore.submitCurrentPlayerVote(selectedAnswerId);

  if (!currentGame || !currentQuestion) {
    return null;
  }

  const isVoting = phase === GAME_PHASE.VOTING;
  const playerVote = voteStore.currentPlayerVote;
  const isVoteSubmitted =
    playerVote?.gameId === currentGame.id &&
    playerVote.roundNumber === currentGame.currentRound;

  return (
    <>
      <Header
        completedRounds={currentGame.currentRound - 1}
        totalRounds={currentGame.totalRounds}
        timerDuration={
          phase === GAME_PHASE.ANSWERING
            ? ANSWERING_DURATION_SECONDS
            : isVoting
              ? VOTING_DURATION_SECONDS
              : null
        }
        timerKey={phase}
        timerLabel={isVoting ? "VOTING ENDS IN" : "ANSWERING ENDS IN"}
        onTimerComplete={
          isVoting ? handleVotingComplete : handleAnsweringComplete
        }
      />
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
        <GameGrid
          phase={phase}
          answers={answerStore.votingAnswers}
          selectedAnswerId={selectedAnswerId}
          currentPlayerId={roomStore.currentPlayer?.id}
          isVoteSubmitted={isVoteSubmitted}
          onSelectAnswer={setSelectedAnswerId}
        />
        {isVoting && (
          <>
            <Button
              onClick={handleSubmitVote}
              disabled={!selectedAnswerId || isVoteSubmitted}
              loading={voteStore.isLoading}
            >
              {isVoteSubmitted ? "VOTE SUBMITTED" : "SUBMIT VOTE"}
            </Button>
            {voteStore.error && <Text c="red">{voteStore.error.message}</Text>}
          </>
        )}
      </section>
    </>
  );
});

export default GamePage;
