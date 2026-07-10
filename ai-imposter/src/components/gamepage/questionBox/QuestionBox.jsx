/* eslint-disable no-unused-vars */
import { Flex, Text } from "@mantine/core";

import classes from "./QuestionBox.module.css";
import QuestionMarkStars from "../questionMarkStars/QuestionMarkStars";
import { PencilLine } from "lucide-react";

const QuestionBox = ({
  question = `What is the worst excuse for being lat to work?`,
}) => {
  return (
    <Flex className={classes["questionBox-wrapper"]}>
      <Flex className={classes["questionBox-container"]}>
        <QuestionMarkStars />
        <Text className={classes["question-text"]} span>
          {question}
        </Text>
      </Flex>
    </Flex>
  );
};

export default QuestionBox;
