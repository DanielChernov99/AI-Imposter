import { useEffect, useState } from "react";
import { Button, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

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
  const { roomStore, gameStore, questionStore } = useStores();
  const { currentGame } = gameStore;
  const { currentQuestion } = questionStore;
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

  const isVoting = phase === GAME_PHASE.VOTING;
  const playerVote = voteStore.currentPlayerVote;
  const isVoteSubmitted =
    playerVote?.gameId === currentGame.id &&
    playerVote.roundNumber === currentGame.currentRound;

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
      </section>
    </>
  );
});

export default GamePage;
