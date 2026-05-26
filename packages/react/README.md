# @graphlet/react

React adapter for Graphlet.

Graphlet React lets you use React components as graph nodes.

## Documentation

Full documentation: https://sicparv1smagna.github.io/graphlet/react/getting-started.html

## Installation

```bash
npm install @graphlet/core @graphlet/react
```

## Component graph example

```tsx
import { createComponentGraph, GraphOutlet } from "@graphlet/react";

type Payload = {
  source: "button" | "keyboard";
};

type Context = {
  values: {
    name?: string;
  };
};

const graph = createComponentGraph<Payload, Context>()(
  [
    [IntroScreen, [FormScreen]],
    [FormScreen, [PreviewScreen]],
    [PreviewScreen, [FormScreen, DoneScreen]],
    [DoneScreen, []]
  ] as const,
  {
    initial: IntroScreen,
    context: {
      values: {}
    }
  }
);

export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## API

### createComponentGraph

Creates a component graph where React components are graph nodes.

```tsx
const graph = createComponentGraph<Payload, Context>()(
  [
    [IntroScreen, [FormScreen]],
    [FormScreen, []]
  ] as const,
  {
    initial: IntroScreen,
    context: {}
  }
);
```

### GraphOutlet

Renders the current component node.

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
- Demo: https://sicparv1smagna.github.io/graphlet/react/demo.html
- GitHub: https://github.com/sicparv1smagna/graphlet
