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
 * @param {{nickname: string, avatarUrl: string} | null} props.author - null for the AI's answer
 * @param {{id: string, nickname: string, avatarUrl: string}[]} props.voters
 */
const ResultCard = ({ index, answer, isAi = false, author = null, voters = [] }) => {
  const authorName = isAi ? "AI Imposter" : (author?.nickname ?? "Unknown");

  return (
    <Flex className={classes["resultCard-wrapper"]}>
      <Flex className={classes["answer-container"]}>
        <Text span>{answer}</Text>
      </Flex>
      <Flex className={classes["writtenBy-wrapper"]}>
        <Flex className={classes["writtenBy-container"]}>
          <Text span>Written By</Text>
          <Flex className={classes["author-container"]}>
            <Flex className={classes["user-image-container"]}>
              {!isAi && author?.avatarUrl && (
                <Avatar src={author.avatarUrl} alt={authorName} size="sm" />
              )}
              {isAi && <Sparkles size={18} stroke="var(--primary, #b23cff)" />}
            </Flex>
            <Text span>{authorName}</Text>
          </Flex>
        </Flex>
        <Flex
          className={[
            classes["budge-container"],
            isAi ? classes["aiBadge"] : classes["humanBadge"],
          ].join(" ")}
        >
          {isAi ? (
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
            {voters.length === 0 && <Text span>nobody</Text>}
            {voters.map((voter) => (
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
          <Text className={isAi ? classes["correct"] : classes["wrong"]} span>
            {isAi ? "CORRECT" : "WRONG"}
          </Text>
        </Flex>
      </Flex>
      <Flex
        className={[
          classes["isCorrect-icon"],
          isAi ? classes["right"] : classes["wrong"],
        ].join(" ")}
      >
        {isAi ? <Check stroke="white" /> : <X stroke="white" />}
      </Flex>
      <Flex className={classes["resultIndex"]}>{index + 1}</Flex>
    </Flex>
  );
};

export default ResultCard;
