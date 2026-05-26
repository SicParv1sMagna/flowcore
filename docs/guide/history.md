# History

Graphlet keeps a history of visited nodes.

History is useful when you build step-by-step flows, screen graphs, wizards, onboarding flows or any interface where the user can move back to a previous node.

## Basic example

```ts
import { Graph } from "@graphlet/core";

type Node = "step1" | "step2" | "step3" | "step4";

const graph = new Graph<Node>(
  [
    ["step1", ["step2", "step3"]],
    ["step2", ["step4"]],
    ["step3", []],
    ["step4", []]
  ],
  {
    initial: "step1"
  }
);
```

When the graph is created, history starts with the initial node.

```ts
graph.getHistory();
// ["step1"]
```

## History after transitions

Every successful transition adds the target node to history.

```ts
graph.goTo("step2");
graph.goTo("step4");

graph.getHistory();
// ["step1", "step2", "step4"]
```

Failed transitions do not change history.

```ts
graph.goTo("step3");
// { ok: false, reason: "TRANSITION_NOT_ALLOWED", ... }

graph.getHistory();
// ["step1", "step2", "step4"]
```

## Check if back navigation is possible

Use `canGoBack()` before rendering a back button.

```ts
graph.canGoBack();
// true
```

## Go back

`back()` moves the graph to the previous node in history.

```ts
graph.current();
// "step4"

graph.back();

graph.current();
// "step2"
```

The history is updated too:

```ts
graph.getHistory();
// ["step1", "step2"]
```

## Back result

When back navigation succeeds, `back()` returns:

```ts
{
  ok: true,
  from: "step4",
  to: "step2",
  current: "step2"
}
```

When there is no previous node, it returns:

```ts
{
  ok: false,
  reason: "EMPTY_HISTORY",
  current: "step1"
}
```

## Clear history

`clearHistory()` keeps the current node but removes previous history.

```ts
graph.goTo("step2");
graph.goTo("step4");

graph.clearHistory();

graph.getHistory();
// ["step4"]
```

After clearing history, `canGoBack()` returns `false`.

## Reset and history

`reset()` moves the graph back to the initial node and resets history.

```ts
graph.goTo("step2");
graph.goTo("step4");

graph.reset();

graph.current();
// "step1"

graph.getHistory();
// ["step1"]
```

## History in snapshot

History is included in every snapshot.

```ts
graph.getSnapshot();
```

```ts
{
  current: "step2",
  next: ["step4"],
  context: undefined,
  history: ["step1", "step2"]
}
```