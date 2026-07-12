/* eslint-disable no-unused-vars */
import { Button, Flex, Textarea, Text, Tooltip } from "@mantine/core";
import classes from "./ResultCard.module.css";
import { Check, X, Sparkles, PersonStanding } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const ResultCard = ({
  isCorrect = true,
  index,
  answer = "My GPS took me on a scenic Route.",
  voters = [1, 2, 3],
}) => {
  return (
    <Flex className={classes["resultCard-wrapper"]}>
      <Flex className={classes["answer-container"]}>
        <Text span>{answer}</Text>
      </Flex>
      <Flex className={classes["writtenBy-wrapper"]}>
        <Flex className={classes["writtenBy-container"]}>
          <Text span>Written By</Text>
          <Flex className={classes["author-container"]}>
            <Flex className={classes["user-image-container"]}></Flex>
            <Text span>CoffeyMaker</Text>
          </Flex>
        </Flex>
        <Flex
          className={[
            classes["budge-container"],
            isCorrect ? classes["aiBadge"] : classes["humanBadge"],
          ].join(" ")}
        >
          {isCorrect ? (
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
            {voters.map((vote, index) => {
              return (
                <Flex
                  className={classes["user-image-container"]}
                  key={index}
                ></Flex>
              );
            })}
          </Flex>
        </Flex>
        <Flex className={classes["resultCard-footer-right"]}>
          <Text
            className={isCorrect ? classes["correct"] : classes["wrong"]}
            span
          >
            {isCorrect ? "CORRECT" : "WRONG"}
          </Text>
        </Flex>
      </Flex>
      <Flex
        className={[
          classes["isCorrect-icon"],
          isCorrect ? classes["right"] : classes["wrong"],
        ].join(" ")}
      >
        {isCorrect ? <Check stroke="white" /> : <X stroke="white" />}
      </Flex>
      <Flex className={classes["resultIndex"]}>{index + 1}</Flex>
    </Flex>
  );
};

export default ResultCard;
