import { Button, Flex, Textarea, Text } from "@mantine/core";
import { Send } from "lucide-react";
import { useState } from "react";
import { MAX_ANSWER_LENGTH } from "../../../domain/constants.js";
import classes from "./AnswerBox.module.css";

const AnswerBox = ({
  onSubmit,
  isSubmitting = false,
  isSubmitted = false,
  errorMessage = null,
}) => {
  const [answer, setAnswer] = useState("");

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
        onChange={(event) =>
          setAnswer(event.target.value.slice(0, MAX_ANSWER_LENGTH))
        }
        maxLength={MAX_ANSWER_LENGTH}
        disabled={isSubmitting || isSubmitted}
        bottomSection={
          <Flex className={classes["textArea-bottomSection"]}>
            <Text size="xs" c="dimmed">
              {answer.length}/{MAX_ANSWER_LENGTH} characters
            </Text>
          </Flex>
        }
      />
      {errorMessage && (
        <Text c="red" size="sm" ta="center" role="alert">
          {errorMessage}
        </Text>
      )}
      <Button
        className={classes["submit-button"]}
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitted || !answer.trim()}
      >
        <Flex className={classes["submit-button-content"]}>
          <Send className={classes["send-icon"]} />
          <Text className={classes["submit-button-text"]} span>
            {isSubmitted ? "ANSWER SUBMITTED" : "SUBMIT ANSWER"}
          </Text>
        </Flex>
      </Button>
      <Flex className={classes["submit-label-container"]}>
        <span>You can submit before the timer ends</span>
      </Flex>
    </Flex>
  );
};

export default AnswerBox;
