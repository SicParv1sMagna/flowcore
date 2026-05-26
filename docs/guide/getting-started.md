# Getting Started

Graphlet is a typed headless graph runtime.

It does not render UI and does not depend on any framework. You create a graph from tuple entries and move through nodes.

## Install

```bash
npm install @graphlet/core
```

## Create a graph

```ts
import { Graph } from "@graphlet/core";

type Node = "welcome" | "profile" | "done";

const graph = new Graph<Node>(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ],
  {
    initial: "welcome"
  }
);
```

Each entry has this shape:

```ts
[node, nextNodes]
```

So this entry:

```ts
["welcome", ["profile"]]
```

means:

```txt
welcome -> profile
```

## Read current node

```ts
graph.current();
// "welcome"
```

## Read next nodes

```ts
graph.getNext();
// ["profile"]
```

## Move to another node

```ts
graph.goTo("profile");
// {
//   ok: true,
//   from: "welcome",
//   to: "profile",
//   current: "profile"
// }
```

## Invalid transition

Graphlet only allows transitions that exist in the graph.

```ts
graph.goTo("welcome");
// {
//   ok: false,
//   reason: "TRANSITION_NOT_ALLOWED",
//   from: "profile",
//   to: "welcome"
// }
```

## Snapshot

```ts
graph.getSnapshot();
```

```ts
{
  current: "profile",
  next: ["done"],
  context: undefined,
  history: ["welcome", "profile"]
}
```

## With payload and context

```ts
type Payload = {
  source: "button" | "keyboard";
};

type Context = {
  name: string;
};

const graph = new Graph<Node, Payload, Context>(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ],
  {
    initial: "welcome",
    context: {
      name: ""
    }
  }
);

graph.goTo("profile", {
  source: "button"
});

graph.setContext({
  name: "Ada"
});
```