import {
    EmptyGraphError,
    InvalidInitialNodeError,
    UnknownNodeError
} from "./errors.js";

import type {
    BackResult,
    ContextUpdater,
    GoToResult,
    GraphEvent,
    GraphListener,
    GraphOptions,
    GraphSchema,
    GraphSnapshot,
    InferNode,
    NextOf
} from "./types.js";

export class Graph<
    const Schema extends GraphSchema,
    Payload = unknown,
    Context = undefined
> {
    private readonly adjacency = new Map<
        InferNode<Schema>,
        Array<InferNode<Schema>>
    >();

    private readonly initial: InferNode<Schema>;

    private currentNode: InferNode<Schema>;
    private currentContext: Context;

    private readonly history: Array<InferNode<Schema>>;

    private readonly listeners = new Set<
        GraphListener<InferNode<Schema>, Payload, Context>
    >();

    constructor(
        schema: Schema,
        options: GraphOptions<InferNode<Schema>, Context> = {}
    ) {
        const nodes = Object.keys(schema) as Array<InferNode<Schema>>;

        for (const node of nodes) {
            this.adjacency.set(
                node,
                [...schema[node]] as Array<InferNode<Schema>>
            );
        }

        const initial = options.initial ?? nodes[0];

        if (!initial) {
            throw new EmptyGraphError();
        }

        if (!this.adjacency.has(initial)) {
            throw new InvalidInitialNodeError(initial);
        }

        this.initial = initial;
        this.currentNode = initial;
        this.history = [initial];
        this.currentContext = options.context as Context;
    }

    hasNode(node: string): node is InferNode<Schema> {
        return this.adjacency.has(node as InferNode<Schema>);
    }

    assertNode(node: string): asserts node is InferNode<Schema> {
        if (!this.hasNode(node)) {
            throw new UnknownNodeError(node);
        }
    }

    getNodes(): Array<InferNode<Schema>> {
        return [...this.adjacency.keys()];
    }

    getNext(): Array<InferNode<Schema>>;

    getNext<From extends InferNode<Schema>>(
        node: From
    ): Array<NextOf<Schema, From>>;

    getNext<From extends InferNode<Schema>>(
        node?: From
    ): Array<InferNode<Schema>> | Array<NextOf<Schema, From>> {
        const resolvedNode = node ?? this.currentNode;

        this.assertNode(resolvedNode);

        return [...(this.adjacency.get(resolvedNode) ?? [])];
    }

    getEdges(): Array<[InferNode<Schema>, InferNode<Schema>]> {
        const edges: Array<[InferNode<Schema>, InferNode<Schema>]> = [];

        for (const [from, targets] of this.adjacency.entries()) {
            for (const to of targets) {
                edges.push([from, to]);
            }
        }

        return edges;
    }

    current(): InferNode<Schema> {
        return this.currentNode;
    }

    getContext(): Context {
        return this.currentContext;
    }

    getSnapshot(): GraphSnapshot<InferNode<Schema>, Context> {
        return {
            current: this.currentNode,
            next: this.getNext(),
            context: this.currentContext,
            history: this.getHistory(),
        };
    }

    getHistory(): Array<InferNode<Schema>> {
        return [...this.history];
    }

    canGoBack(): boolean {
        return this.history.length > 1;
    }

    canGo(from: InferNode<Schema>, to: InferNode<Schema>): boolean {
        return this.adjacency.get(from)?.includes(to) ?? false;
    }

    canGoTo(to: InferNode<Schema>): boolean {
        return this.canGo(this.currentNode, to);
    }

    goTo(
        to: InferNode<Schema>,
        payload?: Payload
    ): GoToResult<InferNode<Schema>, Payload> {
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

        const event: GraphEvent<InferNode<Schema>, Payload, Context> = {
            type: "transition",
            from,
            to,
            payload
        };

        this.notify(event);

        return {
            ok: true,
            from,
            to,
            current: this.currentNode,
            payload
        };
    }

    back(): BackResult<InferNode<Schema>> {
        if (!this.canGoBack()) {
            return {
                ok: false,
                reason: "EMPTY_HISTORY",
                current: this.currentNode,
            }
        }

        const from = this.currentNode;

        this.history.pop();

        const previous = this.history[this.history.length - 1];

        if (!previous) {
            return {
                ok: false,
                reason: "EMPTY_HISTORY",
                current: this.currentNode,
            }
        }

        this.currentNode = previous;

        this.notify({
            type: "back",
            from,
            to: this.currentNode,
        })

        return {
            ok: true,
            from,
            to: this.currentNode,
            current: this.currentNode,
        }
    }

    clearHistory(): GraphSnapshot<InferNode<Schema>, Context> {
        this.history.length = 0;
        this.history.push(this.currentNode);

        this.notify({
            type: "history.clear",
            current: this.currentNode,
        })

        return this.getSnapshot()
    }

    setContext(
        context: Context
    ): GraphSnapshot<InferNode<Schema>, Context>;

    setContext(
        updater: ContextUpdater<Context>
    ): GraphSnapshot<InferNode<Schema>, Context>;

    setContext(
        nextContextOrUpdater: Context | ContextUpdater<Context>
    ): GraphSnapshot<InferNode<Schema>, Context> {
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

    reset(): GraphSnapshot<InferNode<Schema>, Context> {
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

    subscribe(
        listener: GraphListener<InferNode<Schema>, Payload, Context>
    ): () => void {
        this.listeners.add(listener);

        listener(this.getSnapshot(), {
            type: "init",
            current: this.currentNode
        });

        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify(
        event: GraphEvent<InferNode<Schema>, Payload, Context>
    ): void {
        const snapshot = this.getSnapshot();

        for (const listener of this.listeners) {
            listener(snapshot, event);
        }
    }
}