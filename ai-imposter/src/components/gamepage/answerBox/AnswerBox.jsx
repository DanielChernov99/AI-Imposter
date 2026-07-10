import { Button, Flex, Textarea, Text } from "@mantine/core";
import { Send } from "lucide-react";
import { useState } from "react";
import classes from "./AnswerBox.module.css";
const AnswerBox = () => {
  const MAX_LENGTH = 120;
  const [answer, setAnswer] = useState("");

  return (
    <Flex className={classes["answerBox-container"]}>
      <Textarea
        classNames={{
          input: classes["answerBox-textArea"],
        }}
        placeholder="Type your answer here"
        value={answer}
        onChange={(e) => setAnswer(e.target.value.slice(0, MAX_LENGTH))}
        bottomSection={
          <Flex className={classes["textArea-bottomSection"]}>
            <Text size="xs" c="dimmed">
              {answer.length}/{MAX_LENGTH} characters
            </Text>
          </Flex>
        }
      />
      <Button className={classes["submit-button"]}>
        <Flex className={classes["submit-button-content"]}>
          <Send className={classes["send-icon"]} />
          <Text className={classes["submit-button-text"]} span>
            SUBMIT ANSWER
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
