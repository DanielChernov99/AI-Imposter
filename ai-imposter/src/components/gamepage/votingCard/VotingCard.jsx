import { Flex, Text, Tooltip } from "@mantine/core";
import styles from "./VotingCard.module.css";
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
  isPlaceholder = false,
  isDisabled = false,
  color = "gray",
  onClick,
}) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const displayText = isPlaceholder
    ? answer
    : isValid
      ? answer
      : "Invalid answer was submitted";

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [displayText]);

  // You can't vote for your own answer (the server rejects it anyway).
  const isClickable =
    Boolean(onClick) && isValid && !isOwn && !isPlaceholder && !isDisabled;

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
      aria-pressed={isClickable && isSelected}
      onKeyDown={handleKeyDown}
      className={[
        styles["votingCard-wrapper"],
        isSelected && styles.selected,
        !isValid && styles.invalid,
        isDisabled && styles.disabled,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={isClickable ? onClick : undefined}
      style={{
        cursor: isClickable ? "pointer" : "not-allowed",
        opacity: isOwn ? 0.55 : 1,
      }}
    >
      <Flex
        className={[
          styles["mask-icon-container"],
          styles[`mask-${color}`],
          !isValid && styles["mask-invalid"],
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
        <Text ref={textRef} className={styles["answer-text"]}>
          {displayText}
          {isOwn ? " (you)" : ""}
        </Text>
      </Tooltip>

      {isSelected && isClickable && (
        <Flex className={styles["check-icon"]}>
          <Check stroke="white" />
        </Flex>
      )}
    </Flex>
  );
};

export default VotingCard;
