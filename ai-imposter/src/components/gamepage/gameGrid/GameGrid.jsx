import { Button, SimpleGrid } from "@mantine/core";
import { observer } from "mobx-react-lite";

import VotingCard from "../votingCard/VotingCard";
import ResultCard from "../resultCard/ResultCard";
import { useStores } from "../../../context/StoreContext.jsx";
import { GAME_PHASE } from "../../../domain/constants.js";
import styles from "./GameGrid.module.css";

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
  const { answerStore, revealStore, roomStore, voteStore } = rootStore;

  const playersById = new Map(
    roomStore.currentRoomPlayers.map((player) => [player.id, player]),
  );

  if (phase === GAME_PHASE.VOTING) {
    const selectedVotingAnswer = voteStore.votingOptions.find(
      (answer) => answer.id === voteStore.selectedAnswerId,
    );
    const hasValidSelection =
      Boolean(selectedVotingAnswer) &&
      selectedVotingAnswer.isPlaceholder !== true &&
      selectedVotingAnswer.isDisabled !== true &&
      selectedVotingAnswer.isValid !== false &&
      selectedVotingAnswer.id !== answerStore.submittedAnswerId;

    const handleSubmitVote = () => {
      if (
        !hasValidSelection ||
        voteStore.hasVoted ||
        voteStore.isSubmitting
      ) {
        return;
      }

      void rootStore.castCurrentVote(voteStore.selectedAnswerId);
    };

    return (
      <>
        <SimpleGrid
          className={styles.cardGrid}
          cols={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: "sm", md: "md" }}
          verticalSpacing={{ base: "sm", md: "md" }}
        >
          {voteStore.votingOptions.map((votingAnswer, index) => {
            const isOwn =
              answerStore.submittedAnswerId === votingAnswer.id;
            const isValid = votingAnswer.isValid !== false;
            const isPlaceholder = votingAnswer.isPlaceholder === true;
            const isDisabled =
              votingAnswer.isDisabled === true || !isValid;

            return (
              <VotingCard
                key={votingAnswer.id}
                answer={votingAnswer.text}
                color={CARD_COLORS[index % CARD_COLORS.length]}
                isSelected={voteStore.selectedAnswerId === votingAnswer.id}
                isOwn={isOwn}
                isValid={isValid}
                isPlaceholder={isPlaceholder}
                isDisabled={isDisabled}
                onClick={
                  voteStore.hasVoted ||
                  voteStore.isSubmitting ||
                  isOwn ||
                  isDisabled ||
                  isPlaceholder
                    ? undefined
                    : () => voteStore.selectAnswer(votingAnswer.id)
                }
              />
            );
          })}
        </SimpleGrid>

        <Button
          className={styles.submitVoteButton}
          onClick={handleSubmitVote}
          disabled={
            !hasValidSelection || voteStore.hasVoted || voteStore.isSubmitting
          }
          loading={voteStore.isSubmitting}
        >
          {voteStore.hasVoted ? "VOTE SUBMITTED" : "SUBMIT VOTE"}
        </Button>
      </>
    );
  }

  if (phase === GAME_PHASE.REVEAL) {
    return (
      <SimpleGrid
        className={styles.cardGrid}
        cols={{ base: 1, md: 2, lg: 3 }}
        spacing={{ base: "sm", md: "md" }}
        verticalSpacing={{ base: "sm", md: "md" }}
      >
        {revealStore.roundAnswers.map((result, index) => (
          <ResultCard
            key={result.id}
            index={index}
            answer={result.text}
            isAi={result.isAi}
            isPlaceholder={result.isPlaceholder === true}
            isDisabled={result.isDisabled === true}
            author={
              result.isPlaceholder
                ? null
                : (playersById.get(result.playerId) ?? null)
            }
            voters={
              result.isPlaceholder
                ? []
                : result.voterPlayerIds
                    .map((voterId) => playersById.get(voterId))
                    .filter(Boolean)
            }
          />
        ))}
      </SimpleGrid>
    );
  }

  return null;
});

export default GameGrid;
