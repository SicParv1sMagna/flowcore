# Getting Started

Graphlet is a small headless graph runtime.

It does not render UI and does not depend on any framework. You create a graph from tuple entries and move through nodes.

## Install

```bash
npm install @graphlet/core
```

## Create a graph

```ts
import { Graph } from "@graphlet/core";

const graph = new Graph(
  [
    ["step1", ["step2", "step3"]],
    ["step2", []],
    ["step3", ["step4"]],
    ["step4", ["step1"]]
  ] as const,
  {
    initial: "step1"
  }
);
```

Each tuple has this shape:

```ts
[node, nextNodes];
```

So this entry:

```ts
["step1", ["step2", "step3"]];
```

means:

```txt
step1 -> step2
step1 -> step3
```

## Read current node

```ts
graph.current();
// "step1"
```

## Read next nodes

```ts
graph.getNext();
// ["step2", "step3"]
```

## Move to another node

```ts
graph.goTo("step3");
// {
//   ok: true,
//   from: "step1",
//   to: "step3",
//   current: "step3"
// }
```

## Invalid transition

Graphlet only allows transitions that exist in the graph.

```ts
graph.goTo("step2");
// {
//   ok: false,
//   reason: "TRANSITION_NOT_ALLOWED",
//   from: "step3",
//   to: "step2"
// }
```

## Snapshot

```ts
graph.getSnapshot();
```

```ts
{
  current: "step3",
  next: ["step4"],
  context: undefined,
  history: ["step1", "step3"]
}
```
