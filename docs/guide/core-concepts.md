# Core Concepts

Graphlet is based on a small set of concepts.

## Graph entries

A graph is defined as an array of entries.

```ts
const entries = [
  ["idle", ["active"]],
  ["active", ["done"]],
  ["done", []]
] as const;
```

Every entry has this shape:

```ts
[node, nextNodes]
```

## Node

A node is a value in your graph.

Most applications use strings or enums:

```ts
type Node = "idle" | "active" | "done";
```

or:

```ts
enum FlowNode {
  Idle = "idle",
  Active = "active",
  Done = "done"
}
```

## Edge

An edge is a connection from one node to another.

```ts
["idle", ["active", "cancelled"]]
```

This means:

```txt
idle -> active
idle -> cancelled
```

## Current node

The runtime keeps track of the current node.

```ts
graph.current();
```

## Transition

A transition moves the runtime from the current node to another node.

```ts
graph.goTo("active");
```

The transition succeeds only if there is an edge from the current node to the target node.

## Payload

Payload is optional data passed with a transition.

```ts
graph.goTo("active", {
  source: "button"
});
```

Graphlet does not interpret payload. It only passes it to transition events and result objects.

## Context

Context is user-defined data stored in the graph runtime.

```ts
graph.getContext();
graph.setContext(nextContext);
```

Graphlet does not interpret context.

## History

Graphlet stores visited nodes.

```ts
graph.getHistory();
graph.back();
```

This is useful for screen flows, wizards and multi-step interfaces.

## Subscriptions

Graphlet can notify listeners when runtime state changes.

```ts
const unsubscribe = graph.subscribe((snapshot, event) => {
  console.log(snapshot, event);
});
```