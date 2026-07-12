import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { HashRouter } from "react-router";
import "@mantine/core/styles.css";
import "./index.css";

import App from "./App.jsx";
import createSupabaseRoomService from "./services/supabaseRoomService.js";
import RootStore from "./stores/RootStore.js";
import { StoreProvider } from "./context/StoreContext.jsx";

const rootStore = new RootStore({
  roomService: createSupabaseRoomService(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <MantineProvider>
        <StoreProvider store={rootStore}>
          <App />
        </StoreProvider>
      </MantineProvider>
    </HashRouter>
  </StrictMode>,
);
