import createSupabaseAnswerService from "./supabaseAnswerService.js";
import { initializeSupabase } from "./supabaseClient.js";
import createSupabaseGameService from "./supabaseGameService.js";
import createSupabaseQuestionService from "./supabaseQuestionService.js";
import createSupabaseRevealService from "./supabaseRevealService.js";
import createSupabaseRoomService from "./supabaseRoomService.js";
import createSupabaseVoteService from "./supabaseVoteService.js";

export function createSupabaseServices(environment = import.meta.env) {
  initializeSupabase(environment);

  return {
    roomService: createSupabaseRoomService(),
    gameService: createSupabaseGameService(),
    questionService: createSupabaseQuestionService(),
    answerService: createSupabaseAnswerService(),
    voteService: createSupabaseVoteService(),
    revealService: createSupabaseRevealService(),
  };
}

export default createSupabaseServices;
