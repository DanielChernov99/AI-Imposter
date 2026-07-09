import { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import Classes from "./Timer.module.css";

// 1. Set your custom duration here (e.g., 20, 45, 90, etc.)

const Timer = ({ waitingTime = 30 }) => {
  const [seconds, setSeconds] = useState(waitingTime);

  useEffect(() => {
    if (seconds <= 0) return;
    const timerId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds]);

  // 2. Calculate the progress percentage (0 to 1)
  const progress = (waitingTime - seconds) / waitingTime;

  // 3. Map progress directly to a full 360-degree circle
  const angle = progress * 360;

  return (
    <Flex className={Classes["countdown-wrapper"]}>
      <div className={`${Classes["beam-group"]} ${Classes["beam-group-left"]}`}>
        <div className={`${Classes.beam} ${Classes["beam-1"]}`}></div>
        <div className={`${Classes.beam} ${Classes["beam-2"]}`}></div>
        <div className={`${Classes.beam} ${Classes["beam-3"]}`}></div>
      </div>

      {/* Your exact SVG layout with the normalized angle applied */}
      <svg
        xmlns="http://w3.org"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${Classes["timer-icon"]} lucide lucide-clock12 lucide-clock-12 _timer-icon_8h3u1_53`}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path
          id="clock-hand"
          d="M12 6v6"
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "12px 12px", // Pivot point perfectly centered in the 24x24 box
            transition: "transform 0.2s ease-in-out", // Gives a brief, punchy ticking animation
          }}
        />
      </svg>

      <Flex className={Classes["countdown-container"]}>
        <span className={Classes["countdown-info"]}>GAME STARTS IN</span>
        <span className={Classes["countdown-timer"]}>
          {`00:${seconds.toString().padStart(2, "0")}`}
        </span>
      </Flex>
      <div
        className={`${Classes["beam-group"]} ${Classes["beam-group-right"]}`}
      >
        <div className={`${Classes.beam} ${Classes["beam-1"]}`}></div>
        <div className={`${Classes.beam} ${Classes["beam-2"]}`}></div>
        <div className={`${Classes.beam} ${Classes["beam-3"]}`}></div>
      </div>
    </Flex>
  );
};

export default Timer;
