import { buildRoundResult } from "../../domain/roundResult.js";

export default function createMockRevealService({
  answerService,
  voteService,
  roomService,
}) {
  async function getRoundResults({ gameId, roundNumber, roomId }) {
    const [answers, votes, players] = await Promise.all([
      answerService.getAnswersByRound({ gameId, roundNumber }),
      voteService.getVotesByRound({ gameId, roundNumber }),
      roomService.getPlayersByRoomId(roomId),
    ]);

    const roundAnswers = answers.map((answer) => ({
      id: answer.id,
      text: answer.text,
      isAi: answer.isAi,
      isValid: answer.isValid,
      playerId: answer.playerId,
      voterPlayerIds: votes
        .filter((vote) => vote.answerId === answer.id)
        .map((vote) => vote.voterPlayerId),
    }));

    return buildRoundResult({ answers: roundAnswers, players });
  }

  return { getRoundResults };
}
