import { GraphOutlet, useGraph } from "@graphlet/react";

import { DebugPanel } from "./components/DebugPanel";
import { GraphView } from "./components/GraphView";
import { graph } from "./graph";

import "./App.css";
import Stat from "./components/Stat.tsx";
import LegendItem from "./components/LegendItem.tsx";

export default function App() {
  const { snapshot } = useGraph(graph);

  return (
    <main className="appShell">
      <header className="hero">
        <div>
          <p className="eyebrow">Graphlet React Demo</p>
          <h1>Component rendering powered by a typed graph runtime</h1>
          <p className="heroText">
            Navigate through a real onboarding flow, inspect transitions, update
            context and watch the graph react to runtime state.
          </p>
        </div>

        <div className="heroStats">
          <Stat label="Current" value={snapshot.current} />
          <Stat label="Next" value={snapshot.next.length.toString()} />
          <Stat label="History" value={snapshot.history.length.toString()} />
        </div>
      </header>

      <section className="graphPanel">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Flow map</p>
            <h2>Runtime graph</h2>
          </div>

          <div className="legend">
            <LegendItem className="legendCurrent" label="Current" />
            <LegendItem className="legendAvailable" label="Available" />
            <LegendItem className="legendVisited" label="Visited" />
          </div>
        </div>

        <GraphView
          current={snapshot.current}
          next={snapshot.next}
          history={snapshot.history}
          edges={graph.getEdges()}
        />
      </section>

      <section className="workspace">
        <GraphOutlet graph={graph} />
        <DebugPanel graph={graph} />
      </section>
    </main>
  );
}
