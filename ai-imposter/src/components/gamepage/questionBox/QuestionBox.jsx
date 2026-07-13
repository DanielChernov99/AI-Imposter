import { Flex, Text } from "@mantine/core";

import classes from "./QuestionBox.module.css";
import QuestionMarkStars from "../questionMarkStars/QuestionMarkStars";

const QuestionBox = ({ question = "" }) => {
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
