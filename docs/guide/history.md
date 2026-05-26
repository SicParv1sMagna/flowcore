# History

Graphlet keeps a history of visited nodes.

History is useful when you build step-by-step flows, screen graphs, wizards, onboarding flows or any interface where the user can move back to a previous node.

## Basic example

```ts
import { Graph } from "@graphlet/core";

const graph = new Graph(
  [
    ["step1", ["step2", "step3"]],
    ["step2", ["step4"]],
    ["step3", []],
    ["step4", []]
  ] as const,
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

Example:

```ts
const canGoBack = graph.canGoBack();

if (canGoBack) {
  graph.back();
}
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

So you can safely handle both cases:

```ts
const result = graph.back();

if (!result.ok) {
  console.log(result.reason);
}
```

## Clear history

`clearHistory()` keeps the current node but removes previous history.

```ts
graph.goTo("step2");
graph.goTo("step4");

graph.getHistory();
// ["step1", "step2", "step4"]

graph.clearHistory();

graph.getHistory();
// ["step4"]
```

After clearing history, `canGoBack()` returns `false`.

```ts
graph.canGoBack();
// false
```

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

## React usage

In React, history can be used to render back navigation.

```tsx
function FormScreen({ graph }) {
  const { snapshot } = useGraph(graph);

  return (
    <section>
      <button onClick={() => graph.back()} disabled={!graph.canGoBack()}>
        Back
      </button>

      <pre>{JSON.stringify(snapshot.history, null, 2)}</pre>
    </section>
  );
}
```

## Notes

History is updated only by successful transitions.

These operations update history:

```ts
graph.goTo(target);
graph.back();
graph.clearHistory();
graph.reset();
```

These operations do not add new history entries:

```ts
graph.setContext(nextContext);
graph.getSnapshot();
graph.getNext();
graph.canGoTo(target);
```
