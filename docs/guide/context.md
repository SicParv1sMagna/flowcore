# Context

Context is user-defined data stored inside the graph runtime.

Graphlet does not interpret context. It only stores it, returns it in snapshots and notifies listeners when it changes.

## Create graph with context

```ts
import { Graph } from "@graphlet/core";

type Node = "profile" | "review";

type Payload = {
  source: "button" | "form";
};

type Context = {
  profile: {
    name: string;
    email: string;
  };
};

const graph = new Graph<Node, Payload, Context>(
  [
    ["profile", ["review"]],
    ["review", ["profile"]]
  ],
  {
    initial: "profile",
    context: {
      profile: {
        name: "",
        email: ""
      }
    }
  }
);
```

## Read context

```ts
graph.getContext();
```

## Update context by value

```ts
graph.setContext({
  profile: {
    name: "Ada Lovelace",
    email: "ada@example.com"
  }
});
```

## Update context with function

```ts
graph.setContext((ctx) => ({
  ...ctx,
  profile: {
    ...ctx.profile,
    name: "Ada Lovelace"
  }
}));
```

## Context in snapshot

```ts
graph.getSnapshot();
```

```ts
{
  current: "profile",
  next: ["review"],
  context: {
    profile: {
      name: "Ada Lovelace",
      email: "ada@example.com"
    }
  },
  history: ["profile"]
}
```

## Context update event

```ts
graph.subscribe((snapshot, event) => {
  if (event.type === "context") {
    console.log(event.previousContext);
    console.log(event.context);
  }
});
```