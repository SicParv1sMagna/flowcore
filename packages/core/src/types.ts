export type GraphNode = unknown;

export type GraphEntries<Node> = ReadonlyArray<
    readonly [Node, readonly Node[]]
>;

export type GraphOptions<Node, Context = undefined> = {
    initial?: Node;
    context?: Context;
};

export type GraphSnapshot<Node, Context = undefined> = {
    current: Node;
    next: Node[];
    context: Context;
    history: Node[];
};

export type TransitionEvent<Node, Payload = unknown> = {
    type: "transition";
    from: Node;
    to: Node;
    payload?: Payload;
};

export type ResetEvent<Node> = {
    type: "reset";
    from: Node;
    to: Node;
};

export type InitEvent<Node> = {
    type: "init";
    current: Node;
};

export type ContextUpdateEvent<Node, Context = undefined> = {
    type: "context";
    current: Node;
    previousContext: Context;
    context: Context;
};

export type BackEvent<Node> = {
    type: "back";
    from: Node;
    to: Node;
};

export type HistoryClearEvent<Node> = {
    type: "history.clear";
    current: Node;
};

export type GraphEvent<Node, Payload = unknown, Context = undefined> =
    | TransitionEvent<Node, Payload>
    | ResetEvent<Node>
    | InitEvent<Node>
    | ContextUpdateEvent<Node, Context>
    | BackEvent<Node>
    | HistoryClearEvent<Node>;

export type GraphListener<Node, Payload = unknown, Context = undefined> = (
    snapshot: GraphSnapshot<Node, Context>,
    event: GraphEvent<Node, Payload, Context>
) => void;

export type GoToSuccess<Node, Payload = unknown> = {
    ok: true;
    from: Node;
    to: Node;
    current: Node;
    payload?: Payload;
};

export type GoToFailure<Node, Payload = unknown> = {
    ok: false;
    reason: "UNKNOWN_NODE" | "TRANSITION_NOT_ALLOWED";
    from: Node;
    to: Node;
    payload?: Payload;
};

export type GoToResult<Node, Payload = unknown> =
    | GoToSuccess<Node, Payload>
    | GoToFailure<Node, Payload>;

export type BackResult<Node> =
    | {
    ok: true;
    from: Node;
    to: Node;
    current: Node;
}
    | {
    ok: false;
    reason: "EMPTY_HISTORY";
    current: Node;
};

export type ContextUpdater<Context> = (context: Context) => Context;