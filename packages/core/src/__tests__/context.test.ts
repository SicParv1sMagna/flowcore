import { describe, expect, it, vi } from "vitest";

import { defineGraph, makeGraph } from "../index.js";

const schema = defineGraph({
    step1: ["step2", "step3"],
    step2: [],
    step3: []
});

type Payload = {
    source: "button" | "keyboard";
};

type Context = {
    values: Record<string, unknown>;
    completed: string[];
};

describe("Graph context", () => {
    it("stores initial context", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {},
                completed: []
            }
        });

        expect(graph.getContext()).toEqual({
            values: {},
            completed: []
        });
    });

    it("returns context in snapshot", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {
                    foo: "bar"
                },
                completed: []
            }
        });

        expect(graph.getSnapshot()).toEqual({
            current: "step1",
            history: [
                "step1"
            ],
            next: ["step2", "step3"],
            context: {
                values: {
                    foo: "bar"
                },
                completed: []
            }
        });
    });

    it("updates context by value", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {},
                completed: []
            }
        });

        graph.setContext({
            values: {
                answer: 42
            },
            completed: ["step1"]
        });

        expect(graph.getContext()).toEqual({
            values: {
                answer: 42
            },
            completed: ["step1"]
        });
    });

    it("updates context by updater function", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {},
                completed: []
            }
        });

        graph.setContext((ctx) => ({
            ...ctx,
            completed: [...ctx.completed, "step1"]
        }));

        expect(graph.getContext()).toEqual({
            values: {},
            completed: ["step1"]
        });
    });

    it("notifies listener on context update", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {},
                completed: []
            }
        });

        const listener = vi.fn();

        graph.subscribe(listener);

        graph.setContext((ctx) => ({
            ...ctx,
            completed: ["step1"]
        }));

        expect(listener).toHaveBeenCalledTimes(2);

        expect(listener).toHaveBeenLastCalledWith(
            {
                current: "step1",
                next: ["step2", "step3"],
                context: {
                    values: {},
                    completed: ["step1"]
                },
                history: ["step1"]
            },
            {
                type: "context",
                current: "step1",
                previousContext: {
                    values: {},
                    completed: []
                },
                context: {
                    values: {},
                    completed: ["step1"]
                }
            }
        );
    });

    it("keeps context after transition", () => {
        const graph = makeGraph<typeof schema, Payload, Context>(schema, {
            initial: "step1",
            context: {
                values: {
                    persisted: true
                },
                completed: []
            }
        });

        graph.goTo("step2", {
            source: "button"
        });

        expect(graph.getSnapshot()).toEqual({
            current: "step2",
            next: [],
            context: {
                values: {
                    persisted: true
                },
                completed: []
            },
            history: ["step1", "step2"]
        });
    });
});