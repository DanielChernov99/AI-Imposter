import { mockLeaderboard } from "./mockData/mockLeaderboard.js";
import { mockPlayersPodium } from "./mockData/mockPlayersPodium.js";
import { mockRoundPoints } from "./mockData/mockRoundPoints.js";
import { Box } from "@mantine/core";
import Podium from "./components/podium/Podium.jsx";
import Leaderboards from "./components/leaderboards/Leaderboards.jsx";
import RoundPoints from "./components/roundPoints/RoundPoints.jsx";

function App() {
  return (
    <Box style={{ width: "360px", maxWidth: "100%" }}>
      <RoundPoints players={mockRoundPoints} />
    </Box>
  );
}

export default App;
