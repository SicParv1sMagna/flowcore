# Core Concepts

Flowlet is based on a few small concepts.

## Graph schema

A graph schema is an object where every key is a node and every value is a list of outgoing nodes.

```typescript
const schema = defineGraph({
    step1: ["step2", "step3"],
    step2: [],
    step3: ["step1"]
})
```

This means:
```text
step1 -> step2
step1 -> step3
step3 -> step1
```

## Node

A node is a key in your schema.

```typescript
const schema = defineGraph({
    idle: ["active"],
    active: [],
})
```

Here, `idle` and `active` are nodes.

## Edges

An edge is a connection from one node to another.

```typescript
const schema = defineGraph({
    idle: ["active"]
})
```

Here, `idle -> active` is an edge.

## Current node

The runtime keeps track of the current node.

```typescript
flow.current();
```

## Transtition

A transition moves the runtime from the current node to another node.

```typescript
flow.goTo("active");
```

The transition succeeds only if there is an edge from the current node to the target node.

## Snapshot

A snapshot describes the current runtime state.

```typescript
flow.getSnapshot();
```

Example:

```json
{
    "current": "step1",
    "next": ["step2", "step3"],
    "context": undefined,
    "history": ["step1"]
}

```