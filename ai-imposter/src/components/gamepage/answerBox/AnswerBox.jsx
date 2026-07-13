import { Button, Flex, Textarea, Text } from "@mantine/core";
import { Check, Send } from "lucide-react";
import { useState } from "react";
import { observer } from "mobx-react-lite";

import { useStores } from "../../../context/StoreContext.jsx";
import classes from "./AnswerBox.module.css";

const AnswerBox = observer(() => {
  const MAX_LENGTH = 120;
  const rootStore = useStores();
  const { gameStore } = rootStore;
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasSubmitted = gameStore.hasSubmittedAnswer;
  const canSubmit = answer.trim().length > 0 && !hasSubmitted && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      await rootStore.submitCurrentAnswer(answer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const cleanAnswer = answer.trim();

    if (!cleanAnswer || isSubmitting || isSubmitted) {
      return;
    }

    await onSubmit(cleanAnswer);
  };

  return (
    <Flex className={classes["answerBox-container"]}>
      <Textarea
        classNames={{
          input: classes["answerBox-textArea"],
        }}
        placeholder="Type your answer here"
        value={answer}
        disabled={hasSubmitted}
        onChange={(e) => setAnswer(e.target.value.slice(0, MAX_LENGTH))}
        bottomSection={
          <Flex className={classes["textArea-bottomSection"]}>
            <Text size="xs" c="dimmed">
              {answer.length}/{MAX_ANSWER_LENGTH} characters
            </Text>
          </Flex>
        }
      />
      <Button
        className={classes["submit-button"]}
        onClick={handleSubmit}
        disabled={!canSubmit && !hasSubmitted}
        loading={isSubmitting}
      >
        <Flex className={classes["submit-button-content"]}>
          {hasSubmitted ? (
            <Check className={classes["send-icon"]} />
          ) : (
            <Send className={classes["send-icon"]} />
          )}
          <Text className={classes["submit-button-text"]} span>
            {hasSubmitted ? "ANSWER SUBMITTED" : "SUBMIT ANSWER"}
          </Text>
        </Flex>
      </Button>
      <Flex className={classes["submit-label-container"]}>
        <span>
          {hasSubmitted
            ? "Waiting for the other players..."
            : "You can submit before the timer ends"}
        </span>
      </Flex>
    </Flex>
  );
});

export default AnswerBox;
