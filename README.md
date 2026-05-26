# Graphlet

Typed headless graph runtime for TypeScript and React flows.

## Core

```bash
npm install @graphlet/core
```

```ts
import { Graph } from "@graphlet/core";

const graph = new Graph(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ] as const,
  {
    initial: "welcome"
  }
);

graph.goTo("profile");

graph.getSnapshot();
// {
//   current: "profile",
//   next: ["done"],
//   context: undefined,
//   history: ["welcome", "profile"]
// }
```

## React

```bash
npm install @graphlet/core @graphlet/react
```

```tsx
import {
  createReactGraph,
  GraphOutlet
} from "@graphlet/react";

enum FlowNode {
  Welcome = "welcome",
  Profile = "profile",
  Done = "done"
}

const graph = createReactGraph()(
  [
    [FlowNode.Welcome, [FlowNode.Profile]],
    [FlowNode.Profile, [FlowNode.Done]],
    [FlowNode.Done, [FlowNode.Welcome]]
  ] as const,
  {
    initial: FlowNode.Welcome,
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Done]: DoneScreen
    }
  }
);

export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## Links

- Documentation: https://sicparv1smagna.github.io/graphlet/
- React demo: https://sicparv1smagna.github.io/graphlet/demo/react/
- GitHub: https://github.com/sicparv1smagna/graphlet