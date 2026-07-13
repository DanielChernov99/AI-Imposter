import { supabase } from "./supabaseClient.js";
import { MAX_ANSWER_LENGTH } from "../../domain/constants.js";
import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "../contracts/answerService.js";

const UNIQUE_VIOLATION = "23505";

async function submitPlayerAnswer({
  gameId,
  roundNumber,
  questionId,
  playerId,
  text,
}) {
  const cleanText = typeof text === "string" ? text.trim() : "";

  if (!cleanText || cleanText.length > MAX_ANSWER_LENGTH) {
    throw new AnswerServiceError(
      ANSWER_SERVICE_ERRORS.INVALID_ANSWER_TEXT,
      `Answer must contain between 1 and ${MAX_ANSWER_LENGTH} characters.`,
    );
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({
      game_id: gameId,
      round_number: roundNumber,
      question_id: questionId,
      player_id: playerId,
      text: cleanText,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      throw new AnswerServiceError(
        ANSWER_SERVICE_ERRORS.ANSWER_ALREADY_SUBMITTED,
        "You already submitted an answer this round.",
      );
    }

    throw new AnswerServiceError(
      ANSWER_SERVICE_ERRORS.UNKNOWN_ERROR,
      "Failed to submit your answer.",
    );
  }

  return {
    id: data.id,
    gameId,
    roundNumber,
    questionId,
    playerId,
    text: cleanText,
    isValid: true,
    isAi: false,
  };
}

export default function createSupabaseAnswerService() {
  return { submitPlayerAnswer };
}
