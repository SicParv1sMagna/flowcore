import type {
    Graph,
    GraphEvent,
    GraphSnapshot
} from "@graphlet/core";

import type { ComponentType } from 'react';

export type ComponentNode = ComponentType<any>;

export type AnyGraph = Graph<any, any, any>;

export type InferGraphNode<TGraph> =
    TGraph extends Graph<infer Node, any, any> ? Node : never;

export type InferGraphPayload<TGraph> =
    TGraph extends Graph<any, infer Payload, any> ? Payload : never;

export type InferGraphContext<TGraph> =
    TGraph extends Graph<any, any, infer Context> ? Context : never;

export type UseGraphResult<TGraph extends AnyGraph> = {
    snapshot: GraphSnapshot<
        InferGraphNode<TGraph>,
        InferGraphContext<TGraph>
    >;
    event: GraphEvent<
        InferGraphNode<TGraph>,
        InferGraphPayload<TGraph>,
        InferGraphContext<TGraph>
    > | null;
};

export type GraphOutletProps<TGraph extends AnyGraph> = {
    graph: TGraph;
    props?: Record<string, unknown>;
};

export type ComponentGraphOptions<Node, Context> = {
    initial: Node,
    context?: Context,
};