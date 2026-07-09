import { Button } from "@mantine/core";
import { CheckCircle } from "lucide-react";
import styles from "./LobbyReadyButton.module.css";

export default function LobbyReadyButton({ isReady, onClick }) {
  return (
    <Button
      className={styles.button}
      onClick={onClick}
      leftSection={<CheckCircle size={24} />}
    >
      {isReady ? "YOU'RE READY" : "READY"}
    </Button>
  );
}
