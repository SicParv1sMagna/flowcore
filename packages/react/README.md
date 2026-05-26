# @graphlet/react

React adapter for Graphlet.

## Documentation

Full documentation: https://sicparv1smagna.github.io/graphlet/react/getting-started.html

## Installation

```bash
npm install @graphlet/core @graphlet/react
```

## Basic usage

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

## API

### createReactGraph

Creates a graph with React component mapping.

```tsx
const graph = createReactGraph<Payload, Context>()(
  entries,
  {
    initial,
    context,
    components
  }
);
```

### GraphOutlet

Renders the component mapped to the current node.

```tsx
<GraphOutlet graph={graph} />
```

### useGraph

Subscribes to graph updates.

```tsx
const { snapshot, event } = useGraph(graph);
```

## Links

- Documentation: https://sicparv1smagna.github.io/graphlet/react/getting-started.html
- Demo: https://sicparv1smagna.github.io/graphlet/demo/react/
- GitHub: https://github.com/sicparv1smagna/graphlet