import Leaderboards from "./components/leaderboards/Leaderboards.jsx";
import { mockLeaderboard } from "./mockData/mockLeaderboard.js";
import { mockPlayersPodium } from "./mockData/mockPlayersPodium.js";
import { Box } from "@mantine/core";
import Podium from "./components/podium/Podium.jsx";

function App() {
  return (
    <Box style={{ width: "390px", maxWidth: "100%" }}>
      <Leaderboards players={mockLeaderboard} />
    </Box>
  );
}

export default App;
