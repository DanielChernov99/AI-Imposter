/* eslint-disable no-unused-vars */

import { Grid } from "@mantine/core";
import VotingCard from "../votingCard/VotingCard";
import ResultCard from "../resultCard/ResultCard";

const GameGrid = ({ phase }) => {
  // const votes = Array.from({ length: numOfPlayers }, (_, i) => i + 1);
  const dynamicVotes = [
    {
      answer: "My GPS took me on a scenic route.",
      color: "purple",
      isValid: true,
      isSelected: false,
    },
    {
      answer: "I was stuck in a Netflix episode",
      color: "cyan",
      isValid: true,
      isSelected: false,
    },
    {
      answer: "A flock of pigeons held a union meeting on my windshield",
      color: "purple",
      isValid: true,
      isSelected: true,
    },
    {
      answer: "Time zones got confused again.",
      color: "green",
      isValid: true,
      isSelected: false,
    },
    {
      answer: null,
      color: "invalid",
      isValid: false,
      isSelected: false,
    },
    {
      answer: "I had to teach my dog how to dog.",
      color: "orange",
      isValid: true,
      isSelected: false,
    },
  ];
  const resultGrid = [1, 2, 3, 4];
  const displayCards =
    phase === "ANSWERING" ? [] : phase === "VOTING" ? dynamicVotes : resultGrid;

  return (
    <Grid>
      {displayCards.map((vote, index) => {
        if (phase === "VOTING") {
          return (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <VotingCard
                answer={vote.answer}
                isSelected={vote.isSelected}
                isValid={vote.isValid}
                color={vote.color}
              />
            </Grid.Col>
          );
        }

        if (phase === "REVEALING") {
          return (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <ResultCard index={index} />
            </Grid.Col>
          );
        }

        return null;
      })}
    </Grid>
  );
};

export default GameGrid;
