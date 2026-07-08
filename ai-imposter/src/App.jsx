import Leaderboards from "./components/leaderboards/Leaderboards.jsx";
import { mockLeaderboard } from "./mockData/mockLeaderboard.js";
import { Box } from "@mantine/core";

function App() {
  return (
    <Box style={{ width: "30%" }}>
      <Leaderboards players={mockLeaderboard} />
    </Box>
  );
}

export default App;
