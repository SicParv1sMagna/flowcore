# Flowlet

Typed headless graph runtime for building graph-based flows.

```ts
import { defineGraph, makeGraph } from "@flowlet/core";

const schema = defineGraph({
  step1: ["step2", "step3"],
  step2: [],
  step3: []
});

const flow = makeGraph(schema, {
  initial: "step1"
});

flow.goTo("step3");
flow.current();