import { Button } from "@mantine/core";
import { CheckCircle, XCircle } from "lucide-react";
import styles from "./LobbyReadyButton.module.css";

export default function LobbyReadyButton({ isReady, isLoading, onClick }) {
  return (
    <Button
      className={`${styles.button} ${
        isReady ? styles.cancelReady : styles.becomeReady
      }`}
      onClick={onClick}
      loading={isLoading}
      leftSection={isReady ? <XCircle size={24} /> : <CheckCircle size={24} />}
      aria-pressed={isReady}
    >
      {isReady ? "CANCEL READY" : "READY"}
    </Button>
  );
}
