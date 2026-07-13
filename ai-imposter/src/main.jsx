import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { HashRouter } from "react-router";
import "@mantine/core/styles.css";
import "./index.css";

import App from "./App.jsx";
import createAppServices from "./services/createAppServices.js";
import { DATA_PROVIDERS } from "./services/dataProviders.js";
import RootStore from "./stores/RootStore.js";
import { StoreProvider } from "./context/StoreContext.jsx";

const DATA_PROVIDER = DATA_PROVIDERS.SUPABASE;
const rootStore = new RootStore(await createAppServices(DATA_PROVIDER));

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
