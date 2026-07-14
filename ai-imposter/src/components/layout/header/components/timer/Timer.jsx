import { useEffect, useRef, useState } from "react";
import { Flex } from "@mantine/core";

import Clock from "./Clock.jsx";
import Classes from "./Timer.module.css";

function getTimerSnapshot(deadlineMs, now = Date.now()) {
  return Math.max(0, Math.ceil((deadlineMs - now) / 1000));
}

const CountdownTimer = ({ deadlineMs, label, onComplete }) => {
  const [{ seconds, totalDuration }, setTimerState] = useState(() => {
    const initialSeconds = getTimerSnapshot(deadlineMs);

    return {
      seconds: initialSeconds,
      totalDuration: initialSeconds,
    };
  });
  const hasCompleted = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    hasCompleted.current = false;

    const synchronize = () => {
      const nextSeconds = getTimerSnapshot(deadlineMs);

      setTimerState((currentState) =>
        currentState.seconds === nextSeconds
          ? currentState
          : { ...currentState, seconds: nextSeconds },
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        synchronize();
      }
    };
    const handleFocus = () => synchronize();
    const handlePageShow = () => synchronize();

    synchronize();

    const intervalId = window.setInterval(synchronize, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [deadlineMs]);

  useEffect(() => {
    if (seconds !== 0 || hasCompleted.current) {
      return;
    }

    hasCompleted.current = true;
    onCompleteRef.current?.();
  }, [seconds]);

  const progress =
    totalDuration === 0
      ? 1
      : (totalDuration - seconds) / totalDuration;
  const angle = Math.min(Math.max(progress, 0), 1) * 360;
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
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

const Timer = ({
  deadline,
  label = "GAME STARTS IN",
  onComplete,
}) => {
  if (!Number.isFinite(deadline)) {
    return null;
  }

  return (
    <CountdownTimer
      key={deadline}
      deadlineMs={deadline}
      label={label}
      onComplete={onComplete}
    />
  );
};

export default Timer;
