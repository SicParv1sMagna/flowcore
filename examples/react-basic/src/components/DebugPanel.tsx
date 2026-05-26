import { useGraph } from "@graphlet/react";

import type { graph } from "../graph";

import { DebugSection } from "./Screen";

type GraphInstance = typeof graph;

export function DebugPanel({ graph }: { graph: GraphInstance }) {
  const { snapshot, event } = useGraph(graph);

  return (
    <aside className="debug">
      <div className="debugHeader">
        <div>
          <p className="eyebrow">Runtime</p>
          <h2>Debug panel</h2>
        </div>

        <button
          className="secondaryButton"
          onClick={() => graph.clearHistory()}
        >
          Clear history
        </button>
      </div>

      <DebugSection title="Snapshot">
        <pre>
          {JSON.stringify(
            {
              current: snapshot.current,
              next: snapshot.next,
              context: snapshot.context,
              history: snapshot.history
            },
            null,
            2
          )}
        </pre>
      </DebugSection>

      <DebugSection title="Last event">
        <pre>{JSON.stringify(event, null, 2)}</pre>
      </DebugSection>

      <DebugSection title="Available from current node">
        <div className="nodeList">
          {snapshot.next.map((node) => (
            <span key={node}>{node}</span>
          ))}
        </div>
      </DebugSection>
    </aside>
  );
}
