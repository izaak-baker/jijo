import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App.tsx";
import { addRxPlugin } from "rxdb";
import {setupDb} from "./utils/rxdb.ts";

// Insurance
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};

// RxDB Dev mode plugin
const RXDB_NAME = "jijo";
if (import.meta.env.DEV) {
  await import("rxdb/plugins/dev-mode").then((module) =>
    addRxPlugin(module.RxDBDevModePlugin),
  );
}

export const clientRxdb = await setupDb(RXDB_NAME);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
