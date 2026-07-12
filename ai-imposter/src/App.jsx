import { Route, Routes } from "react-router";
import StartPage from "./pages/StartPage.jsx";
import LobbyPage from "./pages/LobbyPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";

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
      <Route path="/game" element={<GamePage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;
