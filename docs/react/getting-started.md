# React Getting Started

The React adapter maps graph nodes to React components.

Unlike component-as-node approaches, Graphlet uses stable node IDs such as strings or enums. This makes snapshots, history and debug output readable in development and production.

## Install

```bash
npm install @graphlet/core @graphlet/react
```

## Define nodes

You can use strings directly, but enums are convenient for larger flows.

```ts
export enum FlowNode {
  Welcome = "welcome",
  Profile = "profile",
  Plan = "plan",
  Review = "review",
  Success = "success"
}
```

## Create React graph

```tsx
import { createReactGraph } from "@graphlet/react";

import { FlowNode } from "./nodes";

const graph = createReactGraph()(
  [
    [FlowNode.Welcome, [FlowNode.Profile]],
    [FlowNode.Profile, [FlowNode.Plan]],
    [FlowNode.Plan, [FlowNode.Review]],
    [FlowNode.Review, [FlowNode.Plan, FlowNode.Success]],
    [FlowNode.Success, [FlowNode.Welcome]]
  ] as const,
  {
    initial: FlowNode.Welcome,
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Plan]: PlanScreen,
      [FlowNode.Review]: ReviewScreen,
      [FlowNode.Success]: SuccessScreen
    }
  }
);
```

## Render current node

```tsx
import { GraphOutlet } from "@graphlet/react";

export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## Navigate inside components

`GraphOutlet` passes `graph` and `snapshot` to the current component.

```tsx
function WelcomeScreen({ graph }) {
  return (
    <button onClick={() => graph.goTo(FlowNode.Profile)}>
      Start
    </button>
  );
}
```

The component decides when to move to another node.

Graphlet only checks if the target node is allowed by the graph.

## Subscribe inside components

Use `useGraph(graph)` when the component needs reactive access to context, history or events.

```tsx
import { useGraph } from "@graphlet/react";

function DebugPanel({ graph }) {
  const { snapshot, event } = useGraph(graph);

  return (
    <pre>
      {JSON.stringify({ snapshot, event }, null, 2)}
    </pre>
  );
}
```