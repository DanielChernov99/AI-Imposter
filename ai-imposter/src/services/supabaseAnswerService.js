import { supabase } from "./supabaseClient.js";
import {
  ANSWER_SERVICE_ERRORS,
  AnswerServiceError,
} from "./answerService.js";

const UNIQUE_VIOLATION = "23505";

async function submitPlayerAnswer({
  gameId,
  roundNumber,
  questionId,
  playerId,
  text,
}) {
  const cleanText = typeof text === "string" ? text.trim() : "";

  if (!cleanText) {
    throw new AnswerServiceError(
      ANSWER_SERVICE_ERRORS.INVALID_ANSWER_TEXT,
      "Answer text must be a non-empty string.",
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

  return { id: data.id, text: cleanText };
}

export default function createSupabaseAnswerService() {
  return { submitPlayerAnswer };
}
