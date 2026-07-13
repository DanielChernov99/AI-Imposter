import {
  QUESTION_SERVICE_ERRORS,
  QuestionServiceError,
} from "../contracts/questionService.js";

export default function createMockQuestionService() {
  const questions = [
    {
      id: "late-to-work",
      text: "What is the worst excuse for being late to work?",
      aiAnswer: "My alarm clock entered a different time zone overnight.",
    },
    {
      id: "useless-superpower",
      text: "What would be the least useful superpower?",
      aiAnswer: "The ability to know exactly when toast has gone cold.",
    },
    {
      id: "office-rule",
      text: "What is a strange new rule for the office?",
      aiAnswer: "Every meeting must begin with a dramatic weather report.",
    },
    {
      id: "robot-advice",
      text: "What is the worst advice a robot could give you?",
      aiAnswer: "Have you tried turning your personality off and on again?",
    },
    {
      id: "treasure-chest",
      text: "What is the most disappointing thing to find in a treasure chest?",
      aiAnswer: "A note explaining that the real treasure was paperwork.",
    },
    {
      id: "time-travel-slogan",
      text: "What is a terrible slogan for a time travel agency?",
      aiAnswer: "We will get you there eventually, probably yesterday.",
    },
  ];

  async function getQuestionById(questionId) {
    const cleanQuestionId =
      typeof questionId === "string" ? questionId.trim() : "";

    if (!cleanQuestionId) {
      throw new QuestionServiceError(
        QUESTION_SERVICE_ERRORS.INVALID_QUESTION_ID,
        "Question ID must be a non-empty string.",
      );
    }

    const question = questions.find(
      (question) => question.id === cleanQuestionId,
    );

    if (!question) {
      throw new QuestionServiceError(
        QUESTION_SERVICE_ERRORS.QUESTION_NOT_FOUND,
        `Could not find question with ID: ${cleanQuestionId}`,
      );
    }

    return question;
  }

  async function getRandomQuestion({ excludedQuestionIds = [] } = {}) {
    const availableQuestions = questions.filter(
      (question) => !excludedQuestionIds.includes(question.id),
    );

    if (availableQuestions.length === 0) {
      throw new QuestionServiceError(
        QUESTION_SERVICE_ERRORS.NO_AVAILABLE_QUESTIONS,
        "No unused questions are available.",
      );
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);

    return availableQuestions[randomIndex];
  }

  return {
    getQuestionById,
    getRandomQuestion,
  };
}
