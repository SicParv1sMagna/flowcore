# React Getting Started

The React adapter lets you use React components as graph nodes.

This means you do not need string IDs or a separate component map.

## Install

```bash
npm install @graphlet/core @graphlet/react
```

## Create component graph

```typescript
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
```

## Render current component

```tsx
export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## Navigate inside components

```tsx
function IntroScreen({ graph }: ScreenProps) {
  return (
    <button onClick={() => graph.goTo(FormScreen, { source: "button" })}>
      Start
    </button>
  );
}
```

The component decides when to move to another component.

Graphlet only checks if the target component is allowed by the graph.
