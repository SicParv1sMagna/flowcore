import { useMemo, useSyncExternalStore } from "react";

import type { Graph, GraphEvent, GraphSnapshot } from "@graphlet/core";

import type {
  InferGraphContext,
  InferGraphNode,
  InferGraphPayload,
  UseGraphResult
} from "./types.js";

type StoreSnapshot<TGraph extends Graph<any, any, any>> = {
  snapshot: GraphSnapshot<InferGraphNode<TGraph>, InferGraphContext<TGraph>>;
  event: GraphEvent<
    InferGraphNode<TGraph>,
    InferGraphPayload<TGraph>,
    InferGraphContext<TGraph>
  > | null;
};

function createReactGraphStore<TGraph extends Graph<any, any, any>>(
  graph: TGraph
) {
  let current: StoreSnapshot<TGraph> = {
    snapshot: graph.getSnapshot() as StoreSnapshot<TGraph>["snapshot"],
    event: null
  };

  return {
    getSnapshot() {
      return current;
    },

    subscribe(listener: () => void) {
      return graph.subscribe((snapshot, event) => {
        current = {
          snapshot: snapshot as StoreSnapshot<TGraph>["snapshot"],
          event: event as StoreSnapshot<TGraph>["event"]
        };

        listener();
      });
    }
  };
}

export function useGraph<TGraph extends Graph<any, any, any>>(
  graph: TGraph
): UseGraphResult<TGraph> {
  const store = useMemo(() => createReactGraphStore(graph), [graph]);

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}
