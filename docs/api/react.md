# React Adapter API

The React adapter exports a small set of helpers.

```ts
import {
  createReactGraph,
  GraphOutlet,
  useGraph
} from "@graphlet/react";
```

## createReactGraph

Creates a graph with React component mapping.

```tsx
const graph = createReactGraph<Payload, Context>()(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ] as const,
  {
    initial: "welcome",
    context: {
      name: ""
    },
    components: {
      welcome: WelcomeScreen,
      profile: ProfileScreen,
      done: DoneScreen
    }
  }
);
```

The API is curried so you can provide payload and context types first.

```tsx
createReactGraph<Payload, Context>()(...)
```

## GraphOutlet

Renders the component mapped to the current node.

```tsx
<GraphOutlet graph={graph} />
```

It passes `graph` and `snapshot` to the rendered component.

```tsx
function Screen({ graph, snapshot }) {
  return <button onClick={() => graph.reset()}>Reset</button>;
}
```

## useGraph

Subscribes to graph updates.

```tsx
const { snapshot, event } = useGraph(graph);
```

Use it inside screens when you need reactive access to context, history or the last event.

```tsx
function ProfileScreen({ graph }) {
  const { snapshot } = useGraph(graph);

  return (
    <pre>
      {JSON.stringify(snapshot.context, null, 2)}
    </pre>
  );
}
```

## TypeScript example

```tsx
enum FlowNode {
  Welcome = "welcome",
  Profile = "profile",
  Done = "done"
}

type Payload = {
  source: "button";
};

type Context = {
  name: string;
};

const graph = createReactGraph<Payload, Context>()(
  [
    [FlowNode.Welcome, [FlowNode.Profile]],
    [FlowNode.Profile, [FlowNode.Done]],
    [FlowNode.Done, [FlowNode.Welcome]]
  ] as const,
  {
    initial: FlowNode.Welcome,
    context: {
      name: ""
    },
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Done]: DoneScreen
    }
  }
);
```