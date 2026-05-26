import { Graph } from "@graphlet/core";

import type { ComponentGraphOptions, ComponentNode } from "./types.js";

export function createComponentGraph<Payload = unknown, Context = undefined>() {
  return function create<
    const Entries extends ReadonlyArray<
      readonly [ComponentNode, readonly ComponentNode[]]
    >,
    Node extends Entries[number][0] = Entries[number][0]
  >(entries: Entries, options: ComponentGraphOptions<Node, Context>) {
    return new Graph<Node, Payload, Context>(
      entries as unknown as ReadonlyArray<readonly [Node, readonly Node[]]>,
      options
    );
  };
}
