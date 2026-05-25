# Flowcore

Typed headless graph runtime for building graph-based flows.

```ts
import { defineFlow, makeFlow } from "@flowcore/core";

const schema = defineFlow({
  step1: ["step2", "step3"],
  step2: [],
  step3: []
});

const flow = makeFlow(schema, {
  initial: "step1"
});

flow.goTo("step3");
flow.current();