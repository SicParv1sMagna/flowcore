# Graph

`Graph` is the core runtime class.

Most users should create it with `makeGraph`.

```ts
const graph = makeGraph(schema, {
  initial: "step1"
});
```

## current

Returns the current node.

```ts
graph.current();
```

## getSnapshot

Returns the current runtime snapshot.

```ts
graph.getSnapshot();
```

Snapshot shape:

```ts
{
  current: Node;
  next: Node[];
  context: Context;
  history: Node[];
}
```

## getNodes

Returns all nodes.

```ts
graph.getNodes();
```

## getNext

Returns next nodes.

```ts
graph.getNext();
graph.getNext("step3");
```

## getEdges

Returns all edges.

```ts
graph.getEdges();
```

Example:

```ts
[
  ["step1", "step2"],
  ["step1", "step3"]
]
```

## hasNode

Checks if a node exists.

```ts
graph.hasNode("step1");
```

## assertNode

Throws if a node does not exist.

```ts
graph.assertNode("step1");
```

## canGo

Checks if transition from one node to another exists.

```ts
graph.canGo("step1", "step2");
```

## canGoTo

Checks if transition from current node to target node exists.

```ts
graph.canGoTo("step2");
```

## goTo

Moves to another node if transition is allowed.

```ts
graph.goTo("step2");
```

With payload:

```ts
graph.goTo("step2", {
  source: "button"
});
```

Success result:

```ts
{
  ok: true,
  from: "step1",
  to: "step2",
  current: "step2",
  payload: {
    source: "button"
  }
}
```

Failure result:

```ts
{
  ok: false,
  reason: "TRANSITION_NOT_ALLOWED",
  from: "step1",
  to: "step5"
}
```

## getContext

Returns current context.

```ts
graph.getContext();
```

## setContext

Updates context.

```ts
graph.setContext(nextContext);
```

Or with updater:

```ts
graph.setContext((ctx) => ({
  ...ctx,
  completed: [...ctx.completed, graph.current()]
}));
```

## getHistory

Returns visited nodes.

```ts
graph.getHistory();
```

## canGoBack

Checks if `back()` can be called successfully.

```ts
graph.canGoBack();
```

## back

Moves to previous node in history.

```ts
graph.back();
```

## clearHistory

Clears history and keeps only the current node.

```ts
graph.clearHistory();
```

## reset

Returns graph to initial node.

```ts
graph.reset();
```

## subscribe

Subscribes to graph changes.

```ts
const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(snapshot);
  console.log(event);
});

unsubscribe();
```