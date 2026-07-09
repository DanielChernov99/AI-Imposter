import { Button, Group } from "@mantine/core";
import { LogOut, Play } from "lucide-react";
import styles from "./ResultActions.module.css";

export default function ResultActions() {
  return (
    <div className={styles.buttonsContainer}>
      <Group justify="center" gap="xl">
        <Button
          radius="xl"
          size="xl"
          classNames={{
            root: styles.playButton,
            label: styles.buttonLabel,
            section: styles.buttonSection,
          }}
          leftSection={<Play size={26} fill="white" strokeWidth={0} />}
        >
          PLAY AGAIN
        </Button>

        <Button
          radius="xl"
          size="xl"
          variant="outline"
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
