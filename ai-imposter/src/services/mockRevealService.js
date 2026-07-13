export default function createMockRevealService({
  answerService,
  voteService,
}) {
  async function getRoundResults({ gameId, roundNumber }) {
    const [answers, votes] = await Promise.all([
      answerService.getAnswersByRound({ gameId, roundNumber }),
      voteService.getVotesByRound({ gameId, roundNumber }),
    ]);

    return answers.map((answer) => ({
      id: answer.id,
      text: answer.text,
      isAi: answer.isAi,
      isValid: answer.isValid,
      playerId: answer.playerId,
      voterPlayerIds: votes
        .filter((vote) => vote.answerId === answer.id)
        .map((vote) => vote.voterPlayerId),
    }));
  }

  return { getRoundResults };
}
