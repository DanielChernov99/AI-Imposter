import { Button } from "@mantine/core";
import styles from "./LobbyReadyButton.module.css";

export default function LobbyReadyButton({ isReady, onClick }) {
  return (
    <Button className={styles.button} onClick={onClick} disabled={isReady}>
      {isReady ? "YOU'RE READY" : "READY"}
    </Button>
  );
}
