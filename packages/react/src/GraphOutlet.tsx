import { createElement } from "react";

import { useGraph } from "./useGraph.js";

import type { AnyReactGraph, GraphOutletProps } from "./types.js";

export function GraphOutlet<TGraph extends AnyReactGraph>({
  graph,
  props
}: GraphOutletProps<TGraph>) {
  const { snapshot } = useGraph(graph);

  const Component = graph.components[snapshot.current];

  if (!Component) {
    throw new Error(`No component found for node: ${String(snapshot.current)}`);
  }

  return createElement(Component, {
    graph,
    snapshot,
    ...props
  });
}
