# makeGraph

Creates a `Graph` runtime instance.

```ts
const graph = makeGraph(schema, options);
```

## Basic usage

```ts
import { defineGraph, makeGraph } from "@graphlet/core";

const schema = defineGraph({
  step1: ["step2", "step3"],
  step2: [],
  step3: []
});

const graph = makeGraph(schema, {
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

const graph = makeGraph<typeof schema, unknown, Context>(schema, {
  initial: "step1",
  context: {
    completed: []
  }
});
```

## Returns

`makeGraph` returns an instance of `Graph`.

```ts
graph.current();
graph.goTo("step2");
graph.getSnapshot();
```