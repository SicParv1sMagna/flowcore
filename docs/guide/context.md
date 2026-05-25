# Context

Context is user-defined data stored inside the graph runtime.

graphlet does not interpret context. It only stores it, returns it in snapshots and notifies listeners when it changes.

## Create graph with context

```typescript
import { defineGraph, makeGraph } from "@graphlet/core";

const schema = defineGraph({
    step1: ["step2"],
    step2: []
});

type Context = {
    values: Record<string, unknown>;
    completed: string[];
};

const flow = makeGraph<typeof schema, unknown, Context>(schema, {
    initial: "step1",
    context: {
        values: {},
        completed: [],
    }
});
```

## Read context

```typescript
flow.setContext({
    values: {
        answer: 42,
    },
    completed: ["step1"]
});
```

## Update context with a function

```typescript
flow.setContext((ctx) => ({
    ...ctx,
    completed: [...ctx.completed, flow.current()]
}))
```

## Context in snapshot

```typescript
flow.getSnapshot();
```

```json
{
    "current": "step1",
        "next": ["step2"],
        "context": {
        "values": {},
        "completed": []
    },
    "history": ["step1"]
}
```

## Context update event

When context changes, subscribers receive a `context` event.

```typescript
flow.subscribe((snapshot, event) => {
    if (event.type === "context") {
        console.log(event.previousContext);
        console.log(event.context);
    }
})
```