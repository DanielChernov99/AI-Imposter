import Leaderboards from "./components/leaderboards/Leaderboards.jsx";
import { mockLeaderboard } from "./mockData/mockLeaderboard.js";

function App() {
  return <Leaderboards players={mockLeaderboard} />;
}

export default App;
