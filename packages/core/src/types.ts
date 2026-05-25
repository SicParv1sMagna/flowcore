export type GraphSchema = Record<string, readonly string[]>;

export type InferNode<Schema extends GraphSchema> = keyof Schema & string;

export type ValidateTargets<Schema extends GraphSchema> = {
    [Node in keyof Schema]: readonly (keyof Schema & string)[];
};

export type NextOf<
    Schema extends GraphSchema,
    Node extends keyof Schema & string
> = Schema[Node][number] & string;

export type GraphOptions<Node extends string, Context = unknown> = {
    initial?: Node;
    context?: Context;
};

export type GraphSnapshot<Node extends string, Context = unknown> = {
    current: Node;
    next: Node[];
    context: Context;
    history: Node[];
};

export type TransitionEvent<Node extends string, Payload = unknown> = {
    type: "transition";
    from: Node;
    to: Node;
    payload?: Payload;
};

export type ResetEvent<Node extends string> = {
    type: "reset";
    from: Node;
    to: Node;
};

export type InitEvent<Node extends string> = {
    type: "init";
    current: Node;
};

export type ContextUpdateEvent<Node extends string, Context = unknown> = {
    type: "context";
    current: Node;
    previousContext: Context;
    context: Context;
};

export type BackEvent<Node extends string> = {
    type: "back";
    from: Node;
    to: Node;
}

export type HistoryClearEvent<Node extends string> = {
    type: "history.clear";
    current: Node;
}

export type GraphEvent<
    Node extends string,
    Payload = unknown,
    Context = unknown
> =
    | TransitionEvent<Node, Payload>
    | ResetEvent<Node>
    | InitEvent<Node>
    | ContextUpdateEvent<Node, Context>
    | BackEvent<Node>
    | HistoryClearEvent<Node>

export type GraphListener<
    Node extends string,
    Payload = unknown,
    Context = unknown
> = (
    snapshot: GraphSnapshot<Node, Context>,
    event: GraphEvent<Node, Payload, Context>
) => void;

export type GoToSuccess<Node extends string, Payload = unknown> = {
    ok: true;
    from: Node;
    to: Node;
    current: Node;
    payload?: Payload;
};

export type GoToFailure<Node extends string, Payload = unknown> = {
    ok: false;
    reason: "UNKNOWN_NODE" | "TRANSITION_NOT_ALLOWED";
    from: Node;
    to: Node;
    payload?: Payload;
};

export type GoToResult<Node extends string, Payload = unknown> =
    | GoToSuccess<Node, Payload>
    | GoToFailure<Node, Payload>;

export type BackResult<Node extends string> =
    | {
        ok: true;
        from: Node;
        to: Node;
        current: Node;
    } | {
        ok: false;
        reason: "EMPTY_HISTORY";
        current: Node;
    }

export type ContextUpdater<Context> = (context: Context) => Context;