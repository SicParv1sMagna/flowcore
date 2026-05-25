# Subscriptions

You can subscribe to graph changes.

Subscriptions are framework-agnostic and can be used to build adapters for React, Svelte, Vue or any other UI layer.

## Subscribe

```ts
const unsubscribe = flow.subscribe((snapshot, event) => {
  console.log(snapshot);
  console.log(event);
});
```

The listener is called immediately with an `init` event.

```ts
{
  type: "init",
  current: "step1"
}
```

## Transition event

```ts
flow.goTo("step2", {
  source: "button"
});
```

Subscriber receives:

```ts
{
  type: "transition",
  from: "step1",
  to: "step2",
  payload: {
    source: "button"
  }
}
```

## Context event

```ts
flow.setContext((ctx) => ({
  ...ctx,
  completed: ["step1"]
}));
```

Subscriber receives:

```ts
{
  type: "context",
  current: "step1",
  previousContext: {
    completed: []
  },
  context: {
    completed: ["step1"]
  }
}
```

## Back event

```ts
flow.back();
```

Subscriber receives:

```ts
{
  type: "back",
  from: "step2",
  to: "step1"
}
```

## Reset event

```ts
flow.reset();
```

Subscriber receives:

```ts
{
  type: "reset",
  from: "step2",
  to: "step1"
}
```

## Unsubscribe

```ts
const unsubscribe = flow.subscribe((snapshot, event) => {
  console.log(snapshot, event);
});

unsubscribe();
```