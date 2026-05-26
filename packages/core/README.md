# Graphlet

Typed headless graph runtime for building graph-based flows.

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
    ["step1", ["step2", "step3"]],
    ["step2", []],
    ["step3", ["step1"]]
  ] as const,
  {
    initial: "step1"
  }
);

graph.current();
// "step1"

graph.goTo("step3");

graph.getSnapshot();
// {
//   current: "step3",
//   next: ["step1"],
//   context: undefined,
//   history: ["step1", "step3"]
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
- GitHub: https://github.com/sicparv1smagna/graphlet
