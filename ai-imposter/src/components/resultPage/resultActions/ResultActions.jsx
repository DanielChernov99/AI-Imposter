import { Button, Group, Tooltip } from "@mantine/core";
import { LogOut, Play } from "lucide-react";
import styles from "./ResultActions.module.css";

export default function ResultActions({ onQuit, isQuitting = false }) {
  return (
    <div className={styles.buttonsContainer}>
      <Group justify="center" gap="xl">
        {/* Play-again requires server-side support (resetting the room to
            "waiting" / starting a fresh game) that isn't built yet. */}
        <Tooltip label="Coming soon" withArrow>
          <Button
            radius="xl"
            size="xl"
            data-disabled
            onClick={(event) => event.preventDefault()}
            classNames={{
              root: styles.playButton,
              label: styles.buttonLabel,
              section: styles.buttonSection,
            }}
            leftSection={<Play size={26} fill="white" strokeWidth={0} />}
          >
            PLAY AGAIN
          </Button>
        </Tooltip>

        <Button
          radius="xl"
          size="xl"
          variant="outline"
          onClick={onQuit}
          loading={isQuitting}
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
    </div>
  );
}
