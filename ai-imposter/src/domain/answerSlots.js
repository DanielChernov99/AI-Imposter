export const MISSING_ANSWER_TEXT = "No valid answer submitted";

function normalizeCount(value) {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function appendMissingAnswerSlots({
  answers,
  humanPlayerCount,
  validHumanAnswerCount,
  slotKey,
}) {
  const missingAnswerCount = Math.max(
    0,
    normalizeCount(humanPlayerCount) - normalizeCount(validHumanAnswerCount),
  );
  const placeholders = Array.from(
    { length: missingAnswerCount },
    (_, index) => ({
      id: `placeholder:${slotKey}:${index + 1}`,
      text: MISSING_ANSWER_TEXT,
      isPlaceholder: true,
      isValid: false,
      isAi: false,
      isDisabled: true,
      playerId: null,
      voterPlayerIds: [],
    }),
  );

  return [...answers, ...placeholders];
}

/**
 * The voting RPC intentionally hides answer metadata, but guarantees one AI
 * answer in addition to all valid human answers.
 */
export function buildVotingAnswerSlots({
  answers = [],
  humanPlayerCount,
  slotKey,
}) {
  const validHumanAnswerCount = Math.max(0, answers.length - 1);

  return appendMissingAnswerSlots({
    answers,
    humanPlayerCount,
    validHumanAnswerCount,
    slotKey,
  });
}

/**
 * Invalid human answers are represented by anonymous placeholders. Real
 * answers remain unique by owner, and only one AI answer is displayed.
 */
export function buildRevealAnswerSlots({
  answers = [],
  humanPlayerCount,
  slotKey,
}) {
  const validHumanPlayerIds = new Set();
  let hasAiAnswer = false;

  const displayAnswers = answers.filter((answer) => {
    if (answer.isAi) {
      if (hasAiAnswer) {
        return false;
      }

      hasAiAnswer = true;
      return true;
    }

    if (
      answer.isValid !== true ||
      !answer.playerId ||
      validHumanPlayerIds.has(answer.playerId)
    ) {
      return false;
    }

    validHumanPlayerIds.add(answer.playerId);
    return true;
  });

  return appendMissingAnswerSlots({
    answers: displayAnswers,
    humanPlayerCount,
    validHumanAnswerCount: validHumanPlayerIds.size,
    slotKey,
  });
}
