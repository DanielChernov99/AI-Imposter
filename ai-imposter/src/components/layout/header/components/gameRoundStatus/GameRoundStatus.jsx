import { Flex, Text, ThemeIcon } from "@mantine/core";
import { Check } from "lucide-react";
import classes from "./GameRoundStatus.module.css";

const GameRoundStatus = ({ completedRounds, totalRounds }) => {
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  // Clamp values
  const completed = Math.max(0, Math.min(completedRounds, totalRounds));
  const currentRound = completed < totalRounds ? completed + 1 : totalRounds;

  return (
    <div className={classes.wrapper}>
      <Text className={classes.label}>
        ROUND {currentRound} OF {totalRounds}
      </Text>

      <Flex align="center" className={classes.progress}>
        {rounds.map((round, index) => {
          const isCompleted = round <= completed;
          const isCurrent = completed < totalRounds && round === currentRound;

          return (
            <Flex key={round} align="center" className={classes.segment}>
              <div
                className={[
                  classes.circle,
                  isCompleted
                    ? classes.completed
                    : isCurrent
                      ? classes.current
                      : classes.future,
                ].join(" ")}
              >
                {isCompleted ? (
                  <ThemeIcon size={22} radius="xl" color="transparent">
                    <Check size={16} strokeWidth={3} />
                  </ThemeIcon>
                ) : (
                  round
                )}
              </div>

              {index !== totalRounds - 1 && (
                <div
                  className={[
                    classes.line,
                    isCompleted ? classes.lineCompleted : classes.lineFuture,
                  ].join(" ")}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </div>
  );
};

export default GameRoundStatus;
