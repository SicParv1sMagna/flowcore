# @graphlet/core

Typed headless graph runtime.

## Documentation

Full documentation: https://sicparv1smagna.github.io/graphlet/

## Installation

```bash
npm install @graphlet/core
```

## Basic usage

```ts
import { Graph } from "@graphlet/core";

const graph = new Graph(
  [
    ["welcome", ["profile"]],
    ["profile", ["done"]],
    ["done", ["welcome"]]
  ] as const,
  {
    initial: "welcome"
  }
);

graph.goTo("profile");

graph.getSnapshot();
// {
//   current: "profile",
//   next: ["done"],
//   context: undefined,
//   history: ["welcome", "profile"]
// }
```

## Features

- Headless graph runtime
- Tuple-based graph entries
- Typed payload and context
- History and back navigation
- Framework-agnostic subscriptions

## Links

- Documentation: https://sicparv1smagna.github.io/graphlet/
- React adapter: https://sicparv1smagna.github.io/graphlet/react/getting-started.html
- Demo: https://sicparv1smagna.github.io/graphlet/demo/react/
- GitHub: https://github.com/sicparv1smagna/graphlet