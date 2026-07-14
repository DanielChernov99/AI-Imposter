import { Button, Flex, Textarea, Text } from "@mantine/core";
import { Check, Send } from "lucide-react";
import { useState } from "react";
import { observer } from "mobx-react-lite";

import { useStores } from "../../../context/StoreContext.jsx";
import { MAX_ANSWER_LENGTH } from "../../../domain/constants.js";
import classes from "./AnswerBox.module.css";

const AnswerBox = observer(() => {
  const rootStore = useStores();
  const { answerStore } = rootStore;
  const [answer, setAnswer] = useState("");

  const { hasSubmittedAnswer, isSubmitting } = answerStore;
  const canSubmit =
    answer.trim().length > 0 && !hasSubmittedAnswer && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    await rootStore.submitCurrentAnswer(answer);
  };

  const handleAnswerChange = (event) => {
    if (answerStore.error?.source === "submitAnswer") {
      answerStore.clearError();
    }

    setAnswer(event.target.value.slice(0, MAX_ANSWER_LENGTH));
  };

  return (
    <Flex className={classes["answerBox-container"]}>
      <Textarea
        classNames={{
          input: classes["answerBox-textArea"],
        }}
        placeholder="Type your answer here"
        value={answer}
        disabled={hasSubmittedAnswer}
        onChange={handleAnswerChange}
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
        disabled={!canSubmit && !hasSubmittedAnswer}
        loading={isSubmitting}
      >
        <Flex className={classes["submit-button-content"]}>
          {hasSubmittedAnswer ? (
            <Check className={classes["send-icon"]} />
          ) : (
            <Send className={classes["send-icon"]} />
          )}
          <Text className={classes["submit-button-text"]} span>
            {hasSubmittedAnswer ? "ANSWER SUBMITTED" : "SUBMIT ANSWER"}
          </Text>
        </Flex>
      </Button>
      <Flex className={classes["submit-label-container"]}>
        <span>
          {hasSubmittedAnswer
            ? "Waiting for the other players..."
            : "You can submit before the timer ends"}
        </span>
      </Flex>
    </Flex>
  );
});

export default AnswerBox;
