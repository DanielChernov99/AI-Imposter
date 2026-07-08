import { useState } from "react";
import Podium from "./components/Podium";

const mockPlayers = [
  {
    id: 1,
    nickname: "PixelPanda",
    points: 12,
    img: "https://api.dicebear.com/9.x/bottts/svg?seed=PixelPanda",
  },
  {
    id: 2,
    nickname: "NachoNinja",
    points: 9,
    img: "https://api.dicebear.com/9.x/bottts/svg?seed=NachoNinja",
  },
  {
    id: 3,
    nickname: "SassySloth",
    points: 8,
    img: "https://api.dicebear.com/9.x/bottts/svg?seed=SassySloth",
  },
];

function App() {
  return (
    <>
      <Podium players={mockPlayers} />
    </>
  );
}

export default App;
