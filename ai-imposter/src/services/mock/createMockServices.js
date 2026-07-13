import createMockAnswerService from "./mockAnswerService.js";
import createMockGameService from "./mockGameService.js";
import createMockQuestionService from "./mockQuestionService.js";
import createMockRevealService from "./mockRevealService.js";
import createMockRoomService from "./mockRoomService.js";
import createMockVoteService from "./mockVoteService.js";

export function createMockServices() {
  const gameService = createMockGameService();
  const roomService = createMockRoomService({ gameService });
  const answerService = createMockAnswerService();
  const voteService = createMockVoteService({ answerService });

  return {
    roomService,
    gameService,
    questionService: createMockQuestionService(),
    answerService,
    voteService,
    revealService: createMockRevealService({
      answerService,
      voteService,
      roomService,
    }),
  };
}

export default createMockServices;
