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
          <ProtectedRoute
            allowedStatuses={[ROOM_STATUS.WAITING, ROOM_STATUS.COUNTDOWN]}
            fallbackPath="/game"
          >
            <LobbyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute
            allowedStatuses={[ROOM_STATUS.PLAYING]}
            fallbackPath="/lobby"
          >
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute
            allowedStatuses={[ROOM_STATUS.FINISHED]}
            fallbackPath="/lobby"
          >
            <ResultPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
