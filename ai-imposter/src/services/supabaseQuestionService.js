import { supabase } from "./supabaseClient.js";
import {
  QUESTION_SERVICE_ERRORS,
  QuestionServiceError,
} from "./questionService.js";

// Note: ai_answers is intentionally never selected — the database revokes
// column-level SELECT on it (migration 017) so players can't identify the
// AI answer during voting. Requesting it would make the query fail.
const QUESTION_COLUMNS = "id, question_text";

function mapQuestion(dbQuestion) {
  return {
    id: dbQuestion.id,
    text: dbQuestion.question_text,
  };
}

async function getQuestionById(questionId) {
  const cleanQuestionId =
    typeof questionId === "string" ? questionId.trim() : "";

  if (!cleanQuestionId) {
    throw new QuestionServiceError(
      QUESTION_SERVICE_ERRORS.INVALID_QUESTION_ID,
      "Question ID must be a non-empty string.",
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_COLUMNS)
    .eq("id", cleanQuestionId)
    .maybeSingle();

  if (error || !data) {
    throw new QuestionServiceError(
      QUESTION_SERVICE_ERRORS.QUESTION_NOT_FOUND,
      `Could not find question with ID: ${cleanQuestionId}`,
    );
  }

  return mapQuestion(data);
}

/**
 * Not supported against Supabase on purpose: question picking happens
 * server-side (advance_game_phase), so clients never choose questions.
 */
async function getRandomQuestion() {
  throw new QuestionServiceError(
    QUESTION_SERVICE_ERRORS.UNKNOWN_ERROR,
    "getRandomQuestion is server-side with Supabase; read games.currentQuestionId instead.",
  );
}

export default function createSupabaseQuestionService() {
  return {
    getQuestionById,
    getRandomQuestion,
  };
}
