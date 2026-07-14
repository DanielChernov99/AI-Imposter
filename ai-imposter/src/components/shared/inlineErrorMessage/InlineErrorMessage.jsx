import { Group, Paper, Text } from "@mantine/core";
import { CircleAlert } from "lucide-react";

import styles from "./InlineErrorMessage.module.css";

export default function InlineErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Paper
      className={styles.message}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Group className={styles.content} align="flex-start" wrap="nowrap">
        <CircleAlert className={styles.icon} aria-hidden="true" />
        <Text className={styles.text}>{message}</Text>
      </Group>
    </Paper>
  );
}
