/* eslint-disable no-unused-vars */
import { Button, Flex, Textarea, Text } from "@mantine/core";
import classes from "./VotingCard.module.css";
import MaskIcon from "../maskIcon/MaskIcon";
import { Check } from "lucide-react";

const maskColors = {
  purple: "#b23cff",
  cyan: "#3ccfff",
  green: "#44d66b",
  orange: "#ff9b38",
  red: "#ff5b5b",
  blue: "#4b7dff",
  yellow: "#ffd64a",
  pink: "#ff56c1",
  teal: "#2dd4bf",
  gray: "#8a8f98",
};
const VotingCard = ({
  answer = "My GPS took me on a scenic route",
  isSelected = true,
  isValid = true,
  color = "gray",
}) => {
  return (
    <Flex
      className={[
        classes["votingCard-wrapper"],
        isSelected && classes["selected"],
        !isValid && classes["invalid"],
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Flex
        className={[
          classes["mask-icon-container"],
          classes[`mask-${color}`],
          !isValid && classes["mask-invalid"],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <MaskIcon
          eyeColor={isValid ? "white" : maskColors.gray}
          maskColor={isValid ? maskColors[color] : maskColors.gray}
        />
      </Flex>

      <Text className={classes["answer-text"]}>
        {isValid ? answer : "Invalid answer was submitted"}
      </Text>

      {isSelected && isValid && (
        <Flex className={classes["check-icon"]}>
          <Check stroke="white" />
        </Flex>
      )}
    </Flex>
  );
};

export default VotingCard;
