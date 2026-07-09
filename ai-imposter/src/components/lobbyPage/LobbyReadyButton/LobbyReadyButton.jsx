import { Button } from "@mantine/core";

export default function LobbyReadyButton({ isReady, onClick }) {
  return (
    <Button onClick={onClick} disabled={isReady}>
      {isReady ? "YOU'RE READY" : "READY"}
    </Button>
  );
}
