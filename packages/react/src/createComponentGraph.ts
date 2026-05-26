import type {
  ReactGraphEntries,
  ReactGraphNode,
  ReactGraphOptions
} from "./types.js";
import { Graph } from "@graphlet/core";

type NodeOf<Entries extends ReactGraphEntries<ReactGraphNode>> =
  Entries[number][0];

export function createComponentGraph<Payload = unknown, Context = undefined>() {
  return function create<
    const Entries extends ReactGraphEntries<ReactGraphNode>,
    Node extends NodeOf<Entries> = NodeOf<Entries>,
    Components extends Record<Node, React.ComponentType<any>> = Record<
      Node,
      React.ComponentType<any>
    >
  >(entries: Entries, options: ReactGraphOptions<Node, Context, Components>) {
    const graph = new Graph<Node, Payload, Context>(
      entries as unknown as ReadonlyArray<readonly [Node, readonly Node[]]>,
      {
        initial: options.initial,
        context: options.context
      }
    );

    return Object.assign(graph, {
      components: options.components
    });
  };
}
