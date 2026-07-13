import { Flex, Text, Tooltip } from "@mantine/core";
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
  isSelected = false,
  isValid = true,
  isOwn = false,
  color = "gray",
  onClick,
}) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const displayText = isValid ? answer : "Invalid answer was submitted";

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [displayText]);

  // You can't vote for your own answer (the server rejects it anyway).
  const isClickable = Boolean(onClick) && isValid && !isOwn;

  const handleKeyDown = (event) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Flex
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-disabled={!isClickable}
      aria-pressed={isSelected}
      onKeyDown={handleKeyDown}
      className={[
        classes["votingCard-wrapper"],
        isSelected && classes.selected,
        !isValid && classes.invalid,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={isClickable ? onClick : undefined}
      style={{
        cursor: isClickable ? "pointer" : "default",
        opacity: isOwn ? 0.55 : 1,
      }}
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
        label={isOwn ? "This is your answer" : displayText}
        disabled={!isOwn && !isTruncated}
        multiline
        w={250}
        transitionProps={{ transition: "pop", duration: 300 }}
      >
        <Text ref={textRef} className={classes["answer-text"]}>
          {displayText}
          {isOwn ? " (you)" : ""}
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
