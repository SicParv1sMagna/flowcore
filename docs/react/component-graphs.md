# Component Graphs

In the React adapter, components can be graph nodes.

You define transitions directly between components:

```tsx
import {createComponentGraph} from "@graphlet/react";

const graph = createComponentGraph()(
    [
        [IntroScreen, [FormScreen]],
        [FormScreen, [PreviewScreen]],
        [PreviewScreen, [FormScreen, DoneScreen]],
        [DoneScreen, []]
    ] as const,
    {
        initial: IntroScreen,
    }
)
```

## Why tuple API?

This syntax is valid JavaScript and keeps component references as values.

This does not work as expected:

The tuple API keeps the actual component references:

```tsx
[IntroScreen, [FormScreen]]
```

## Components decide transitions

The graph only describes possible transitions.

Your components decide which transition should happen.

```tsx
function PreviewScreen({ graph }: ScreenProps) {
    return (
        <>
            <button onClick={() => graph.goTo(FormScreen)}>
                Edit
            </button>
            
            <button onClick={() => graph.goTo(DoneScreen)}>
                Finish
            </button>
        </>
    )
}
```

If the transition is not allowed, `goTo` returns a failure result.

```tsx
const result = graph.goTo(DoneScreen);

if (!result.ok) {
    console.log(result.reason);
}
```

## Payload

You can pass payload to transitions.

```tsx
graph.goTo(FormScreen, {
    source: "button"
})
```

The payload type is defined when creating the graph.

```tsx
type Payload = {
    source: "button" | "keyboard";
};

const graph = createComponentGraph<Payload>()(
    [
        [IntroScreen, [FormScreen]],
        [FormScreen, []]
    ] as const,
    {
        initial: IntroScreen
    }
);
```