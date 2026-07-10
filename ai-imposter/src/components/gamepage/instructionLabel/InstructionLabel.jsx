import { Flex, Text } from "@mantine/core";
import { PencilLine, Wand, MoveRight, MoveLeft, Astroid } from "lucide-react";
import classes from "./InstructionLabel.module.css";

const InstructionLabel = ({ phase = "REVEALING" }) => {
  const instructions = {
    ANSWERING: {
      instruction: "Write A funny answer that might be mistaken for AI",
      leftIcon: <PencilLine className={classes["instruction-icon"]} />,
      rightIcon: <Wand className={classes["instruction-icon"]} />,
    },
    VOTING: {
      instruction: "Pick the answer you think was written by AI",
      leftIcon: <MoveRight className={classes["instruction-icon"]} />,
      rightIcon: <MoveLeft className={classes["instruction-icon"]} />,
    },
    REVEALING: {
      instruction: "Here's what happend this round",
      leftIcon: (
        <Astroid
          className={classes["instruction-icon"]}
          fill="var(--primary)"
        />
      ),
      rightIcon: (
        <Astroid
          className={classes["instruction-icon"]}
          fill="var(--primary)"
        />
      ),
    },
  };
  return (
    <Flex className={classes["questionBox-instructions-container"]}>
      {instructions[phase]?.leftIcon}
      <Text span className={classes["questionBox-instructions-label"]}>
        {instructions[phase].instruction}
      </Text>
      {instructions[phase]?.rightIcon}
    </Flex>
  );
};

export default InstructionLabel;
