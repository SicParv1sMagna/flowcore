# Context

Context is user-defined data stored inside the graph runtime.

Graphlet does not interpret context. It only stores it, returns it in snapshots and notifies listeners when it changes.

## Create graph with context

```ts
import { Graph } from "@graphlet/core";

type Node = "step1" | "step2";

type Payload = {
  source: "button" | "keyboard";
};

type Context = {
  values: Record<string, unknown>;
  completed: Node[];
};

const graph = new Graph<Node, Payload, Context>(
  [
    ["step1", ["step2"]],
    ["step2", []]
  ],
  {
    initial: "step1",
    context: {
      values: {},
      completed: []
    }
  }
);
```

## Read context

```ts
graph.getContext();
```

## Update context by value

```ts
graph.setContext({
  values: {
    answer: 42
  },
  completed: ["step1"]
});
```

## Update context with function

```ts
graph.setContext((ctx) => ({
  ...ctx,
  completed: [...ctx.completed, graph.current()]
}));
```

## Context in snapshot

```ts
graph.getSnapshot();
```

```ts
{
  current: "step1",
  next: ["step2"],
  context: {
    values: {},
    completed: []
  },
  history: ["step1"]
}
```

## Context update event

```ts
graph.subscribe((snapshot, event) => {
  if (event.type === "context") {
    console.log(event.previousContext);
    console.log(event.context);
  }
});
```