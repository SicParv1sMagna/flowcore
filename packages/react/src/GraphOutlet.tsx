import type { AnyGraph, GraphOutletProps } from "./types.js";
import { useGraph } from "./useGraph.js";
import { createElement } from "react";

export function GraphOutlet<TGraph extends AnyGraph>({
  graph,
  props
}: GraphOutletProps<TGraph>) {
  const { snapshot } = useGraph(graph);

  const Component = snapshot.current;

  return createElement(Component, {
    graph,
    snapshot,
    ...props
  });
}
