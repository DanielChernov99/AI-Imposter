import { Box, Flex, Text, Title } from "@mantine/core";
import { Users } from "lucide-react";

import InlineErrorMessage from "../../shared/inlineErrorMessage/InlineErrorMessage.jsx";
import { ROOM_STATUS } from "../../../domain/constants.js";
import styles from "./LobbyTitle.module.css";

export default function LobbyTitle({
  joinedCount,
  capacity,
  roomStatus,
  errorMessage,
}) {
  const isCountdown = roomStatus === ROOM_STATUS.COUNTDOWN;
  const title = isCountdown ? "Everyone is ready!" : "Waiting for players";
  const subtitle = isCountdown
    ? "All players are connected and ready. The game is about to begin!"
    : "The game starts automatically when the room is full and everyone is ready.";

  return (
    <Flex align="center" className={styles.wrapper}>
      <Flex className={styles.titleRow}>
        <Users className={styles.mainIcon} />
        <Title order={1} className={styles.title}>
          {title}
        </Title>
      </Flex>

      <Box className={styles.messageSlot}>
        <Text
          className={`${styles.subtitle} ${errorMessage ? styles.hidden : ""}`}
        >
          {subtitle}
        </Text>
        <InlineErrorMessage message={errorMessage} />
      </Box>

      <Flex className={styles.countRow}>
        <Users className={styles.countIcon} />
        <Text className={styles.countText}>
          {joinedCount} / {capacity} players joined
        </Text>
      </Flex>
    </Flex>
  );
}
