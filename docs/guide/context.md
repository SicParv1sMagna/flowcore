# Context

Context is user-defined data stored inside the graph runtime.

Flowcore does not interpret context. It only stores it, returns it in snapshots and notifies listeners when it changes.

## Create graph with context

```typescript
import { defineFlow, makeFlow } from "@flowcore/core";

const schema = defineFlow({
    step1: ["step2"],
    step2: []
});

type Context = {
    values: Record<string, unknown>;
    completed: string[];
};

const flow = makeFlow<typeof schema, unknown, Context>(schema, {
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