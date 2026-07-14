import { useEffect, useRef, useState } from "react";
import { Flex } from "@mantine/core";

import Clock from "./Clock.jsx";
import Classes from "./Timer.module.css";

function normalizeDuration(duration) {
  if (
    duration === null ||
    duration === undefined ||
    duration === "" ||
    typeof duration === "boolean"
  ) {
    return null;
  }

  const numericDuration = Number(duration);

  if (!Number.isFinite(numericDuration) || numericDuration < 0) {
    return null;
  }

  return Math.floor(numericDuration);
}

const CountdownTimer = ({ normalizedDuration, label, onComplete }) => {
  const [seconds, setSeconds] = useState(normalizedDuration);

  const hasCompleted = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (normalizedDuration === 0) {
      return;
    }

    const endTime = Date.now() + normalizedDuration * 1000;

    const intervalId = window.setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000),
      );

      setSeconds(remainingSeconds);

      if (remainingSeconds === 0) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [normalizedDuration]);

  useEffect(() => {
    if (seconds !== 0 || hasCompleted.current) {
      return;
    }

    hasCompleted.current = true;
    onCompleteRef.current?.();
  }, [seconds]);

  const progress =
    normalizedDuration === 0
      ? 1
      : (normalizedDuration - seconds) / normalizedDuration;

  const angle = Math.min(Math.max(progress, 0), 1) * 360;

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return (
    <Flex className={Classes["countdown-wrapper"]}>
      <Clock angle={angle} className={Classes["timer-icon"]} />

      <Flex className={Classes["countdown-container"]}>
        <span
          className={Classes["countdown-timer"]}
          role="timer"
          aria-live="polite"
        >
          {minutes}:{remainingSeconds}
        </span>

        <span className={Classes["countdown-info"]}>{label}</span>
      </Flex>
    </Flex>
  );
};

const Timer = ({ duration, label = "GAME STARTS IN", onComplete }) => {
  const normalizedDuration = normalizeDuration(duration);

  if (normalizedDuration === null) {
    return null;
  }

  return (
    <CountdownTimer
      key={normalizedDuration}
      normalizedDuration={normalizedDuration}
      label={label}
      onComplete={onComplete}
    />
  );
};

export default Timer;
