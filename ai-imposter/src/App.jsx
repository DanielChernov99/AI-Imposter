import { Route, Routes } from "react-router";
import StartPage from "./pages/StartPage";
import LobbyPage from "./pages/LobbyPage";

import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>
      <Route path="/lobby" element={<LobbyPage />}></Route>
      <Route path="/game" element={<GamePage />}></Route>
      <Route path="/result" element={<ResultPage />}></Route>
    </Routes>
  );
}

export default App;
