# Subscriptions

Graphlet allows you to subscribe to graph changes.

Subscriptions are framework-agnostic. They work without React, Svelte, Vue or any UI library.

React users usually do not need to call `subscribe()` directly because the React adapter provides `useGraph(graph)`, but subscriptions are the low-level mechanism behind it.

## Basic usage

```ts
import { Graph } from "@graphlet/core";

const graph = new Graph(
  [
    ["step1", ["step2"]],
    ["step2", []]
  ] as const,
  {
    initial: "step1"
  }
);

const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(snapshot);
  console.log(event);
});
```

The listener receives two arguments:

```ts
(snapshot, event) => void
```

## Snapshot

The snapshot describes the current graph state.

```ts
{
  current: "step1",
  next: ["step2"],
  context: undefined,
  history: ["step1"]
}
```

Snapshot includes:

```ts
{
  current: Node;
  next: Node[];
  context: Context;
  history: Node[];
}
```

## Event

The event describes why the subscription was triggered.

Graphlet currently emits these event types:

```ts
"init";
"transition";
"context";
"back";
"history.clear";
"reset";
```

## Init event

`subscribe()` calls the listener immediately with an `init` event.

```ts
const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(event);
});
```

```ts
{
  type: "init",
  current: "step1"
}
```

This makes subscriptions convenient for UI adapters because they can render the initial state immediately.

## Transition event

A successful `goTo()` emits a `transition` event.

```ts
graph.goTo("step2", {
  source: "button"
});
```

Subscriber receives:

```ts
{
  type: "transition",
  from: "step1",
  to: "step2",
  payload: {
    source: "button"
  }
}
```

The snapshot already contains the new current node.

```ts
{
  current: "step2",
  next: [],
  context: undefined,
  history: ["step1", "step2"]
}
```

Failed transitions do not notify subscribers.

```ts
graph.goTo("unknown" as never);
// no subscription event
```

## Context event

`setContext()` emits a `context` event.

```ts
graph.setContext((ctx) => ({
  ...ctx,
  completed: ["step1"]
}));
```

Subscriber receives:

```ts
{
  type: "context",
  current: "step1",
  previousContext: {
    completed: []
  },
  context: {
    completed: ["step1"]
  }
}
```

The snapshot also contains the updated context.

```ts
{
  current: "step1",
  next: ["step2"],
  context: {
    completed: ["step1"]
  },
  history: ["step1"]
}
```

## Back event

`back()` emits a `back` event when it succeeds.

```ts
graph.back();
```

Subscriber receives:

```ts
{
  type: "back",
  from: "step2",
  to: "step1"
}
```

If history is empty, `back()` returns a failure result and does not notify subscribers.

```ts
graph.back();
// { ok: false, reason: "EMPTY_HISTORY", current: "step1" }
```

## History clear event

`clearHistory()` emits a `history.clear` event.

```ts
graph.clearHistory();
```

Subscriber receives:

```ts
{
  type: "history.clear",
  current: "step2"
}
```

## Reset event

`reset()` emits a `reset` event.

```ts
graph.reset();
```

Subscriber receives:

```ts
{
  type: "reset",
  from: "step2",
  to: "step1"
}
```

The snapshot contains the initial node and reset history.

```ts
{
  current: "step1",
  next: ["step2"],
  context: undefined,
  history: ["step1"]
}
```

## Unsubscribe

`subscribe()` returns an unsubscribe function.

```ts
const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(snapshot, event);
});

unsubscribe();
```

After calling `unsubscribe`, the listener will no longer be called.

```ts
unsubscribe();

graph.goTo("step2");
// listener is not called
```

## Example: logging graph changes

```ts
const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(`[${event.type}]`, {
    current: snapshot.current,
    next: snapshot.next,
    history: snapshot.history
  });
});

graph.goTo("step2");
graph.reset();

unsubscribe();
```

## Example: custom UI adapter

Subscriptions can be used to build adapters for any UI framework.

```ts
function createSimpleAdapter(graph, render) {
  const unsubscribe = graph.subscribe((snapshot) => {
    render(snapshot.current);
  });

  return unsubscribe;
}
```

React adapter uses the same idea internally through `useGraph(graph)`.

## React usage

In React, prefer `useGraph(graph)`.

```tsx
import { useGraph } from "@graphlet/core-react";

function DebugPanel({ graph }) {
  const { snapshot, event } = useGraph(graph);

  return <pre>{JSON.stringify({ snapshot, event }, null, 2)}</pre>;
}
```

Use low-level `subscribe()` directly only when you need custom integrations.

## Event narrowing

Events are discriminated by `event.type`.

```ts
graph.subscribe((snapshot, event) => {
  if (event.type === "transition") {
    console.log(event.from);
    console.log(event.to);
    console.log(event.payload);
  }

  if (event.type === "context") {
    console.log(event.previousContext);
    console.log(event.context);
  }

  if (event.type === "reset") {
    console.log(event.from);
    console.log(event.to);
  }
});
```
