# makeFlow

Creates a `Graph` runtime instance.

```ts
const graph = makeFlow(schema, options);
```

## Basic usage

```ts
import { defineGraph, makeFlow } from "@flowcore/core";

const schema = defineGraph({
  step1: ["step2", "step3"],
  step2: [],
  step3: []
});

const graph = makeFlow(schema, {
  initial: "step1"
});
```

## Options

```ts
{
  initial?: Node;
  context?: Context;
}
```

## With context

```ts
type Context = {
  completed: string[];
};

const graph = makeFlow<typeof schema, unknown, Context>(schema, {
  initial: "step1",
  context: {
    completed: []
  }
});
```

## Returns

`makeFlow` returns an instance of `Graph`.

```ts
graph.current();
graph.goTo("step2");
graph.getSnapshot();
```