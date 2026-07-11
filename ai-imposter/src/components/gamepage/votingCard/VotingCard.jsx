/* eslint-disable no-unused-vars */
import { Button, Flex, Textarea, Text, Tooltip } from "@mantine/core";
import classes from "./VotingCard.module.css";
import MaskIcon from "../maskIcon/MaskIcon";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const displayText = isValid ? answer : "Invalid answer was submitted";

  useEffect(() => {
    const el = textRef.current;
    console.log("🚀 ~ VotingCard ~ el.clientHeight:", el.clientHeight);
    console.log("🚀 ~ VotingCard ~ el.scrollHeight:", el.scrollHeight);
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, []);
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
      <Tooltip
        label={displayText}
        disabled={!isTruncated}
        multiline
        w={250}
        transitionProps={{ transition: "pop", duration: 300 }}
      >
        <Text ref={textRef} className={classes["answer-text"]}>
          {displayText}
        </Text>
      </Tooltip>

      {isSelected && isValid && (
        <Flex className={classes["check-icon"]}>
          <Check stroke="white" />
        </Flex>
      )}
    </Flex>
  );
};

export default VotingCard;
