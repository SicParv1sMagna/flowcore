# Getting Started

Flowlet is a small headless graph runtime.

It does not render UI and does not depend on any framework. You defined graph, create a runtime instance and move through
nodes.

## Install

```bash
npm install @flowlet/core
```

## Define a graph

```typescript
import { defineGraph, makeGraph } from "@flowlet/core";

const schema = defineGraph({
    step1: ["step2", "step3"],
    step2: [],
    step3: ["step4", "step5"],
    step4: ["step1"],
    step5: [],
})
```

`defineGraph` preserves literal node names and helps TypeScript infer the graph shape.

## Create a runtime

```typescript
const flow = makeGraph(schema, {
    initial: "step1"
})
```

## Move through the graph

```typescript
flow.current();
// "step1"

flow.getNext();
// ["step2", "step3"]

flow.goTo("step3")
// { ok: true, from: "step1", to: "step3", current: "step3" }

flow.current();
// "step3"
```

## Invalid transitions

Flowlet only allows transitions that exist in your graph.

```typescript
graph.goTo("step2");
// {
//   ok: false,
//   reason: "TRANSITION_NOT_ALLOWED",
//   from: "step3",
//   to: "step2"
// }
```

## Subscribe to changes

```typescript
const unsubscribe = graph.subscribe((snapshot, event) => {
    console.log(snapshot.current);
    console.log(event.type);
});

graph.goTo("step4");

unsubscribe();
```
