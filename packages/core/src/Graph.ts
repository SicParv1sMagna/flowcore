import {
  EmptyGraphError,
  InvalidInitialNodeError,
  UnknownNodeError
} from "./errors.js";

import type {
  BackResult,
  ContextUpdater,
  GoToResult,
  GraphEntries,
  GraphEvent,
  GraphListener,
  GraphOptions,
  GraphSnapshot
} from "./types.js";

export class Graph<Node, Payload = unknown, Context = undefined> {
  private readonly adjacency = new Map<Node, Node[]>();
  private readonly initial: Node;

  private currentNode: Node;
  private currentContext: Context;
  private readonly history: Node[];

  private readonly listeners = new Set<GraphListener<Node, Payload, Context>>();

  constructor(
    entries: GraphEntries<Node>,
    options: GraphOptions<Node, Context> = {}
  ) {
    for (const [node, next] of entries) {
      this.adjacency.set(node, [...next]);
    }

    const firstNode = entries[0]?.[0];
    const initial = options.initial ?? firstNode;

    if (initial === undefined) {
      throw new EmptyGraphError();
    }

    if (!this.adjacency.has(initial)) {
      throw new InvalidInitialNodeError(String(initial));
    }

    this.initial = initial;
    this.currentNode = initial;
    this.currentContext = options.context as Context;
    this.history = [initial];
  }

  hasNode(node: Node): boolean {
    return this.adjacency.has(node);
  }

  assertNode(node: Node): void {
    if (!this.hasNode(node)) {
      throw new UnknownNodeError(String(node));
    }
  }

  getNodes(): Node[] {
    return [...this.adjacency.keys()];
  }

  getNext(node = this.currentNode): Node[] {
    this.assertNode(node);

    return [...(this.adjacency.get(node) ?? [])];
  }

  getEdges(): Array<[Node, Node]> {
    const edges: Array<[Node, Node]> = [];

    for (const [from, targets] of this.adjacency.entries()) {
      for (const to of targets) {
        edges.push([from, to]);
      }
    }

    return edges;
  }

  current(): Node {
    return this.currentNode;
  }

  getContext(): Context {
    return this.currentContext;
  }

  getHistory(): Node[] {
    return [...this.history];
  }

  getSnapshot(): GraphSnapshot<Node, Context> {
    return {
      current: this.currentNode,
      next: this.getNext(),
      context: this.currentContext,
      history: this.getHistory()
    };
  }

  canGo(from: Node, to: Node): boolean {
    return this.adjacency.get(from)?.includes(to) ?? false;
  }

  canGoTo(to: Node): boolean {
    return this.canGo(this.currentNode, to);
  }

  goTo(to: Node, payload?: Payload): GoToResult<Node, Payload> {
    if (!this.hasNode(to)) {
      return {
        ok: false,
        reason: "UNKNOWN_NODE",
        from: this.currentNode,
        to,
        payload
      };
    }

    if (!this.canGoTo(to)) {
      return {
        ok: false,
        reason: "TRANSITION_NOT_ALLOWED",
        from: this.currentNode,
        to,
        payload
      };
    }

    const from = this.currentNode;

    this.currentNode = to;
    this.history.push(to);

    this.notify({
      type: "transition",
      from,
      to,
      payload
    });

    return {
      ok: true,
      from,
      to,
      current: this.currentNode,
      payload
    };
  }

  setContext(context: Context): GraphSnapshot<Node, Context>;
  setContext(updater: ContextUpdater<Context>): GraphSnapshot<Node, Context>;
  setContext(
    nextContextOrUpdater: Context | ContextUpdater<Context>
  ): GraphSnapshot<Node, Context> {
    const previousContext = this.currentContext;

    this.currentContext =
      typeof nextContextOrUpdater === "function"
        ? (nextContextOrUpdater as ContextUpdater<Context>)(this.currentContext)
        : nextContextOrUpdater;

    this.notify({
      type: "context",
      current: this.currentNode,
      previousContext,
      context: this.currentContext
    });

    return this.getSnapshot();
  }

  canGoBack(): boolean {
    return this.history.length > 1;
  }

  back(): BackResult<Node> {
    if (!this.canGoBack()) {
      return {
        ok: false,
        reason: "EMPTY_HISTORY",
        current: this.currentNode
      };
    }

    const from = this.currentNode;

    this.history.pop();

    const previous = this.history[this.history.length - 1];

    if (previous === undefined) {
      return {
        ok: false,
        reason: "EMPTY_HISTORY",
        current: this.currentNode
      };
    }

    this.currentNode = previous;

    this.notify({
      type: "back",
      from,
      to: this.currentNode
    });

    return {
      ok: true,
      from,
      to: this.currentNode,
      current: this.currentNode
    };
  }

  clearHistory(): GraphSnapshot<Node, Context> {
    this.history.length = 0;
    this.history.push(this.currentNode);

    this.notify({
      type: "history.clear",
      current: this.currentNode
    });

    return this.getSnapshot();
  }

  reset(): GraphSnapshot<Node, Context> {
    const from = this.currentNode;

    this.currentNode = this.initial;
    this.history.length = 0;
    this.history.push(this.initial);

    this.notify({
      type: "reset",
      from,
      to: this.currentNode
    });

    return this.getSnapshot();
  }

  subscribe(listener: GraphListener<Node, Payload, Context>): () => void {
    this.listeners.add(listener);

    listener(this.getSnapshot(), {
      type: "init",
      current: this.currentNode
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: GraphEvent<Node, Payload, Context>): void {
    const snapshot = this.getSnapshot();

    for (const listener of this.listeners) {
      listener(snapshot, event);
    }
  }
}
