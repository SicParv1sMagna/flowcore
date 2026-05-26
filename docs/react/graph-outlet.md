# GraphOutlet

`GraphOutlet` renders the React component mapped to the current graph node.

```tsx
<GraphOutlet graph={graph} />
```

## Basic usage

```tsx
export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## How it works

Given this graph:

```tsx
const graph = createReactGraph()(
  [
    ["welcome", ["profile"]],
    ["profile", []]
  ] as const,
  {
    initial: "welcome",
    components: {
      welcome: WelcomeScreen,
      profile: ProfileScreen
    }
  }
);
```

When the current node is `"welcome"`, `GraphOutlet` renders:

```tsx
<WelcomeScreen graph={graph} snapshot={snapshot} />
```

When the current node is `"profile"`, it renders:

```tsx
<ProfileScreen graph={graph} snapshot={snapshot} />
```

## Props passed to screens

`GraphOutlet` passes these props to the current component:

```ts
{
  graph,
  snapshot
}
```

Example:

```tsx
function WelcomeScreen({ graph, snapshot }) {
  return (
    <section>
      <p>Current node: {snapshot.current}</p>

      <button onClick={() => graph.goTo("profile")}>
        Start
      </button>
    </section>
  );
}
```

## Additional props

You can pass additional props with `props`.

```tsx
<GraphOutlet
  graph={graph}
  props={{
    title: "Demo"
  }}
/>
```

These props are forwarded to the current component.

```tsx
function WelcomeScreen({ title }) {
  return <h1>{title}</h1>;
}
```

## Missing component

If there is no component for the current node, `GraphOutlet` throws an error:

```txt
No component found for node: profile
```

This usually means the `components` object is missing a key.