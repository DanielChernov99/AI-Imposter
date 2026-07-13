import { Avatar, Flex, Text } from "@mantine/core";
import classes from "./ResultCard.module.css";
import { Check, X, Sparkles, PersonStanding } from "lucide-react";

/**
 * One revealed answer: who wrote it (a player or the AI) and who voted
 * for it. `isAi` drives the badge and the CORRECT/WRONG footer — voting
 * for the AI answer is a correct catch, voting for a human answer isn't.
 *
 * @param {Object} props
 * @param {number} props.index
 * @param {string} props.answer
 * @param {boolean} props.isAi
 * @param {boolean} props.isPlaceholder
 * @param {boolean} props.isDisabled
 * @param {{nickname: string, avatarUrl: string} | null} props.author - null for the AI's answer
 * @param {{id: string, nickname: string, avatarUrl: string}[]} props.voters
 */
const ResultCard = ({
  index,
  answer,
  isAi = false,
  isPlaceholder = false,
  isDisabled = false,
  author = null,
  voters = [],
}) => {
  const isUnavailable = isPlaceholder || isDisabled;
  const authorName = isAi ? "AI Imposter" : (author?.nickname ?? "Unknown");
  const visibleVoters = isUnavailable ? [] : voters;

  return (
    <Flex
      aria-disabled={isUnavailable}
      className={[
        classes["resultCard-wrapper"],
        isUnavailable && classes.placeholder,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Flex className={classes["answer-container"]}>
        <Text span>{answer}</Text>
      </Flex>
      <Flex className={classes["writtenBy-wrapper"]}>
        <Flex className={classes["writtenBy-container"]}>
          <Text span>{isUnavailable ? "Submission" : "Written By"}</Text>
          <Flex className={classes["author-container"]}>
            <Flex className={classes["user-image-container"]}>
              {!isUnavailable && !isAi && author?.avatarUrl && (
                <Avatar src={author.avatarUrl} alt={authorName} size="sm" />
              )}
              {!isUnavailable && isAi && (
                <Sparkles size={18} stroke="var(--primary, #b23cff)" />
              )}
              {isUnavailable && <X size={18} />}
            </Flex>
            <Text span>{isUnavailable ? "Unavailable" : authorName}</Text>
          </Flex>
        </Flex>
        <Flex
          className={[
            classes["budge-container"],
            isUnavailable
              ? classes["invalidBadge"]
              : isAi
                ? classes["aiBadge"]
                : classes["humanBadge"],
          ].join(" ")}
        >
          {isUnavailable ? (
            <>
              <X stroke="white" />
              <Text span>NO ANSWER</Text>
            </>
          ) : isAi ? (
            <>
              <Sparkles stroke="white" />
              <Text span>AI ANSWER</Text>
            </>
          ) : (
            <>
              <PersonStanding stroke="white" />
              <Text span>HUMAN ANSWER</Text>
            </>
          )}
        </Flex>
      </Flex>
      <div className={classes["divider"]}></div>
      <Flex className={classes["resultCard-footer"]}>
        <Flex className={classes["resultCard-footer-left"]}>
          <Text span>Voted by:</Text>
          <Flex className={classes["voters-container"]}>
            {visibleVoters.length === 0 && <Text span>nobody</Text>}
            {visibleVoters.map((voter) => (
              <Flex className={classes["user-image-container"]} key={voter.id}>
                <Avatar
                  src={voter.avatarUrl}
                  alt={voter.nickname}
                  title={voter.nickname}
                  size="sm"
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Flex className={classes["resultCard-footer-right"]}>
          <Text
            className={
              isUnavailable
                ? classes.invalidText
                : isAi
                  ? classes.correct
                  : classes.wrong
            }
            span
          >
            {isUnavailable ? "INVALID" : isAi ? "CORRECT" : "WRONG"}
          </Text>
        </Flex>
      </Flex>
      <Flex
        className={[
          classes["isCorrect-icon"],
          isUnavailable
            ? classes.invalid
            : isAi
              ? classes.right
              : classes.wrong,
        ].join(" ")}
      >
        {!isUnavailable && isAi ? (
          <Check stroke="white" />
        ) : (
          <X stroke="white" />
        )}
      </Flex>
      <Flex className={classes["resultIndex"]}>{index + 1}</Flex>
    </Flex>
  );
};

export default ResultCard;
