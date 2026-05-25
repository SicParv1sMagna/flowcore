import {GraphEntries, GraphOptions } from "./types.js";
import {Graph} from "./Graph.js";

export function makeGraph<
    const Entries extends GraphEntries<unknown>,
    Payload = unknown,
    Context = undefined,
    Node = Entries[number][0]
>(
    entries: Entries,
    options: GraphOptions<Node, Context> = {}
) {
    return new Graph<Node, Payload, Context>(
        entries as GraphEntries<Node>,
        options
    )
}