import { Route, Routes } from "react-router";
import StartPage from "./pages/StartPage.jsx";
import LobbyPage from "./pages/LobbyPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import { ROOM_STATUS } from "./domain/constants.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route
        path="/lobby"
        element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute
            requiredStatus={ROOM_STATUS.IN_GAME}
            fallbackPath="/lobby"
          >
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;
