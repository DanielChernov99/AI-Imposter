import { Grid } from "@mantine/core";
import { observer } from "mobx-react-lite";

import VotingCard from "../votingCard/VotingCard";
import ResultCard from "../resultCard/ResultCard";
import { useStores } from "../../../context/StoreContext.jsx";
import { GAME_PHASE } from "../../../domain/constants.js";

const CARD_COLORS = [
  "purple",
  "cyan",
  "green",
  "orange",
  "blue",
  "yellow",
  "pink",
  "teal",
];

const GameGrid = observer(({ phase }) => {
  const rootStore = useStores();
  const { gameStore, roomStore } = rootStore;

  const playersById = new Map(
    roomStore.currentRoomPlayers.map((player) => [player.id, player]),
  );

  if (phase === GAME_PHASE.VOTING) {
    return (
      <Grid>
        {gameStore.votingAnswers.map((votingAnswer, index) => (
          <Grid.Col key={votingAnswer.id} span={{ base: 12, sm: 6, md: 4 }}>
            <VotingCard
              answer={votingAnswer.text}
              color={CARD_COLORS[index % CARD_COLORS.length]}
              isSelected={gameStore.myVoteAnswerId === votingAnswer.id}
              isOwn={gameStore.myAnswerId === votingAnswer.id}
              isValid
              onClick={() => rootStore.castCurrentVote(votingAnswer.id)}
            />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  if (phase === GAME_PHASE.REVEAL) {
    return (
      <Grid>
        {gameStore.roundResults.map((result, index) => (
          <Grid.Col key={result.id} span={{ base: 12, sm: 6, md: 4 }}>
            <ResultCard
              index={index}
              answer={result.text}
              isAi={result.isAi}
              author={playersById.get(result.playerId) ?? null}
              voters={result.voterPlayerIds
                .map((voterId) => playersById.get(voterId))
                .filter(Boolean)}
            />
          </Grid.Col>
        ))}
      </Grid>
    );
  }

  return null;
});

export default GameGrid;
