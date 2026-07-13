import { Flex, Text, Tooltip } from "@mantine/core";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import classes from "./VotingCard.module.css";
import MaskIcon from "../maskIcon/MaskIcon";

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
  answer = "",
  isSelected = false,
  isDisabled = false,
  isValid = true,
  color = "gray",
  onSelect,
}) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const displayText = isValid ? answer : "Invalid answer was submitted";

  useEffect(() => {
    const element = textRef.current;

    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [displayText]);

  const handleSelect = () => {
    if (!isDisabled) {
      onSelect?.();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <Flex
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={[
        classes["votingCard-wrapper"],
        isSelected && classes.selected,
        !isValid && classes.invalid,
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
