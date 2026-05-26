# GraphOutlet

`GraphOutlet` renders the current component node.

```tsx
<GraphOutlet graph={graph} />
```

## Basic usage

```tsx
export function App() {
  return <GraphOutlet graph={graph} />;
}
```

## Props passed to screens

`GraphOutlet` passes these props to the current component:

```ts
{
  (graph, snapshot);
}
```

Example:

```tsx
function IntroScreen({ graph, snapshot }: ScreenProps) {
  return (
    <section>
      <p>Current node: {snapshot.current.name}</p>

      <button onClick={() => graph.goTo(FormScreen)}>Start</button>
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
function IntroScreen({ title }: ScreenProps & { title: string }) {
  return <h1>{title}</h1>;
}
```

## No Provider

The React adapter does not require a Provider.

The graph instance is passed explicitly:

```tsx
<GraphOutlet graph={graph} />
```

This keeps the adapter small and predictable.
