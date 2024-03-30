import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./layouts/App.tsx";
import { addRxPlugin } from "rxdb";
import {setupDb} from "./logic/rxdb.ts";
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';


// Insurance
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};

const RXDB_NAME = "jijo";
addRxPlugin(RxDBMigrationPlugin);
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
