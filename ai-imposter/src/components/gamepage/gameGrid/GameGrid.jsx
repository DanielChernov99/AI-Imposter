import { Grid } from "@mantine/core";

import VotingCard from "../votingCard/VotingCard";
import ResultCard from "../resultCard/ResultCard";
import { GAME_PHASE } from "../../../domain/constants.js";

const votingCardColors = ["purple", "cyan", "green", "orange", "blue"];

const GameGrid = ({
  phase,
  answers = [],
  selectedAnswerId = null,
  currentPlayerId = null,
  isVoteSubmitted = false,
  onSelectAnswer,
}) => {
  const resultGrid = [1, 2, 3, 4];
  const displayCards =
    phase === GAME_PHASE.ANSWERING
      ? []
      : phase === GAME_PHASE.VOTING
        ? answers
        : phase === GAME_PHASE.REVEAL
          ? resultGrid
          : [];

  return (
    <Grid>
      {displayCards.map((answer, index) => {
        if (phase === GAME_PHASE.VOTING) {
          const isOwnAnswer = Boolean(
            currentPlayerId && answer.playerId === currentPlayerId,
          );
          const isDisabled =
            !answer.isValid || isOwnAnswer || isVoteSubmitted;

          return (
            <Grid.Col key={answer.id} span={{ base: 12, sm: 6, md: 4 }}>
              <VotingCard
                answer={answer.text}
                isSelected={answer.id === selectedAnswerId}
                isDisabled={isDisabled}
                isValid={answer.isValid}
                color={votingCardColors[index % votingCardColors.length]}
                onSelect={() => onSelectAnswer?.(answer.id)}
              />
            </Grid.Col>
          );
        }

        if (phase === GAME_PHASE.REVEAL) {
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
