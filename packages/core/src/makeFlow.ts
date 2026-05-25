import {GraphOptions, GraphSchema, InferNode} from "./types.js";
import {Graph} from "./Graph.js";

export function makeFlow<
    const Schema extends GraphSchema,
    Payload = unknown,
    Context = undefined,
    Node extends InferNode<Schema> = InferNode<Schema>
>(
    schema: Schema,
    options: GraphOptions<InferNode<Schema>, Context> = {}
) {
    return new Graph<Schema, Payload, Context>(schema, options);
}