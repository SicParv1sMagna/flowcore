import type { Graph, GraphEvent, GraphSnapshot } from "@graphlet/core";
import type { ComponentType } from "react";

export type ReactGraphNode = string | number | symbol;

export type ReactGraphEntries<Node extends ReactGraphNode> = ReadonlyArray<
  readonly [Node, readonly Node[]]
>;

export type AnyReactGraph = Graph<any, any, any> & {
  components: Record<PropertyKey, ComponentType<any>>;
};

export type InferGraphNode<TGraph> =
  TGraph extends Graph<infer Node, any, any> ? Node : never;

export type InferGraphPayload<TGraph> =
  TGraph extends Graph<any, infer Payload, any> ? Payload : never;

export type InferGraphContext<TGraph> =
  TGraph extends Graph<any, any, infer Context> ? Context : never;

export type ReactGraphOptions<
  Node extends ReactGraphNode,
  Context,
  Components extends Record<Node, ComponentType<any>>
> = {
  initial: Node;
  context?: Context;
  components: Components;
};

export type UseGraphResult<TGraph extends Graph<any, any, any>> = {
  snapshot: GraphSnapshot<InferGraphNode<TGraph>, InferGraphContext<TGraph>>;
  event: GraphEvent<
    InferGraphNode<TGraph>,
    InferGraphPayload<TGraph>,
    InferGraphContext<TGraph>
  > | null;
};

export type GraphOutletProps<TGraph extends AnyReactGraph> = {
  graph: TGraph;
  props?: Record<string, unknown>;
};
