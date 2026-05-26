# React Graphs

A React graph combines two things:

1. graph transitions
2. component mapping

The graph runtime works with stable node IDs, while the React adapter renders a component for the current node.

## Why not use components as nodes?

React component names can be minified in production.

For example:

```tsx
snapshot.current.name;
// "ue"
```

This makes history and debug output hard to read.

Graphlet instead recommends stable node IDs:

```tsx
snapshot.current;
// "welcome"

snapshot.history;
// ["welcome", "profile", "plan"]
```

## Basic example

```tsx
const graph = createReactGraph()(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ] as const,
  {
    initial: "welcome",
    components: {
      welcome: WelcomeScreen,
      profile: ProfileScreen,
      done: DoneScreen
    }
  }
);
```

## With enum nodes

```ts
enum FlowNode {
  Welcome = "welcome",
  Profile = "profile",
  Done = "done"
}
```

```tsx
const graph = createReactGraph()(
  [
    [FlowNode.Welcome, [FlowNode.Profile]],
    [FlowNode.Profile, [FlowNode.Done]],
    [FlowNode.Done, [FlowNode.Welcome]]
  ] as const,
  {
    initial: FlowNode.Welcome,
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Done]: DoneScreen
    }
  }
);
```

## With payload and context

```tsx
type Payload = {
  source: "button" | "form";
};

type Context = {
  profile: {
    name: string;
  };
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
      profile: {
        name: ""
      }
    },
    components: {
      [FlowNode.Welcome]: WelcomeScreen,
      [FlowNode.Profile]: ProfileScreen,
      [FlowNode.Done]: DoneScreen
    }
  }
);
```

## Component props

Every screen component receives:

```ts
{
  graph,
  snapshot
}
```

Example:

```tsx
function ProfileScreen({ graph, snapshot }) {
  return (
    <button
      onClick={() =>
        graph.goTo(FlowNode.Done, {
          source: "button"
        })
      }
    >
      Finish
    </button>
  );
}
```

If a component needs to re-render when context changes, use `useGraph(graph)` inside it:

```tsx
function ProfileScreen({ graph }) {
  const { snapshot } = useGraph(graph);

  return (
    <input
      value={snapshot.context.profile.name}
      onChange={(event) => {
        graph.setContext((ctx) => ({
          ...ctx,
          profile: {
            name: event.target.value
          }
        }));
      }}
    />
  );
}
```