import { Button, Group, Text } from "@mantine/core";
import { LogOut, Play } from "lucide-react";
import styles from "./ResultActions.module.css";

export default function ResultActions({
  onPlayAgain,
  onQuit,
  hasRequestedPlayAgain = false,
  isRequestingPlayAgain = false,
  isQuitting = false,
  playAgainError = null,
}) {
  return (
    <div className={styles.buttonsContainer}>
      <Group justify="center" gap="xl">
        <Button
          radius="xl"
          size="xl"
          onClick={onPlayAgain}
          loading={isRequestingPlayAgain}
          disabled={hasRequestedPlayAgain || isQuitting}
          classNames={{
            root: styles.playButton,
            label: styles.buttonLabel,
            section: styles.buttonSection,
          }}
          leftSection={<Play size={26} fill="white" strokeWidth={0} />}
        >
          {hasRequestedPlayAgain ? "WAITING..." : "PLAY AGAIN"}
        </Button>

        <Button
          radius="xl"
          size="xl"
          variant="outline"
          onClick={onQuit}
          loading={isQuitting}
          disabled={isRequestingPlayAgain}
          classNames={{
            root: styles.quitButton,
            label: styles.buttonLabel,
            section: styles.buttonSection,
          }}
          leftSection={<LogOut size={25} strokeWidth={2.4} />}
        >
          QUIT GAME
        </Button>
      </Group>

      {hasRequestedPlayAgain && (
        <Text ta="center" mt="md" aria-live="polite">
          Waiting for other players...
        </Text>
      )}

      {playAgainError && (
        <Text c="red" ta="center" mt="md" role="alert">
          {playAgainError}
        </Text>
      )}
    </div>
  );
}
