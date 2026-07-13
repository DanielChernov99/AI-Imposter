import { Flex, Text } from "@mantine/core";
import { PencilLine, Wand, MoveRight, MoveLeft, Astroid } from "lucide-react";
import { GAME_PHASE } from "../../../domain/constants.js";
import classes from "./InstructionLabel.module.css";

const InstructionLabel = ({ phase }) => {
  const instructions = {
    [GAME_PHASE.ANSWERING]: {
      instruction: "Write a funny answer that might be mistaken for AI",
      leftIcon: <PencilLine className={classes["instruction-icon"]} />,
      rightIcon: <Wand className={classes["instruction-icon"]} />,
    },
    [GAME_PHASE.VOTING]: {
      instruction: "Pick the answer you think was written by AI",
      leftIcon: <MoveRight className={classes["instruction-icon"]} />,
      rightIcon: <MoveLeft className={classes["instruction-icon"]} />,
    },
    [GAME_PHASE.REVEAL]: {
      instruction: "Here's what happened this round",
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
  const currentInstruction = instructions[phase];

  if (!currentInstruction) {
    return null;
  }

  return (
    <Flex className={classes["questionBox-instructions-container"]}>
      {currentInstruction.leftIcon}
      <Text span className={classes["questionBox-instructions-label"]}>
        {currentInstruction.instruction}
      </Text>
      {currentInstruction.rightIcon}
    </Flex>
  );
};

export default InstructionLabel;
