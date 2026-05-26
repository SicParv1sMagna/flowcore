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

        <button onClick={() => graph.clearHistory()}>Clear history</button>
      </div>

      <DebugSection title="Snapshot">
        <pre>
          {JSON.stringify(
            {
              current: snapshot.current.name,
              next: snapshot.next.map((node) => node.name),
              context: snapshot.context,
              history: snapshot.history.map((node) => node.name)
            },
            null,
            2
          )}
        </pre>
      </DebugSection>

      <DebugSection title="Last event">
        <pre>{JSON.stringify(formatEvent(event), null, 2)}</pre>
      </DebugSection>

      <DebugSection title="Available from current node">
        <div className="nodeList">
          {snapshot.next.map((node) => (
            <span key={node.name}>{node.name}</span>
          ))}
        </div>
      </DebugSection>
    </aside>
  );
}

function formatEvent(
  event: ReturnType<typeof useGraph<GraphInstance>>["event"]
) {
  if (!event) {
    return null;
  }

  if (event.type === "transition") {
    return {
      ...event,
      from: event.from.name,
      to: event.to.name
    };
  }

  if (event.type === "reset") {
    return {
      ...event,
      from: event.from.name,
      to: event.to.name
    };
  }

  if (event.type === "back") {
    return {
      ...event,
      from: event.from.name,
      to: event.to.name
    };
  }

  if (event.type === "history.clear") {
    return {
      ...event,
      current: event.current.name
    };
  }

  if (event.type === "init") {
    return {
      ...event,
      current: event.current.name
    };
  }

  if (event.type === "context") {
    return {
      ...event,
      current: event.current.name
    };
  }

  return event;
}
