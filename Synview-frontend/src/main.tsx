import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
          <App />
        <p
          className="flex h-full justify-center text-black  lg:hidden" role="alert"
        >Please use desktop</p>
      </MantineProvider>
    </Provider>
  </StrictMode>
);
