import { GraphOutlet } from "@graphlet/react";

import { DebugPanel } from "./components/DebugPanel";
import { graph } from "./graph";

import "./App.css";

export default function App() {
  return (
    <main className="layout">
      <GraphOutlet graph={graph} />
      <DebugPanel graph={graph} />
    </main>
  );
}
