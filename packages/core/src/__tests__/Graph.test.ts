import { describe, expect, it, vi } from "vitest";
import {defineFlow} from "../defineFlow.js";
import {makeFlow} from "../makeFlow.js";
import {Graph} from "../Graph.js";
import {EmptyGraphError, InvalidInitialNodeError, UnknownNodeError} from "../errors.js";

const schema = defineFlow({
    step1: ["step2", "step3"],
    step2: [],
    step3: ["step4", "step5"],
    step4: ["step1"],
    step5: []
});

describe("Graph", () => {
    it("creates graph from schema", () => {
        const graph = makeFlow(schema, {
            initial: 'step1'
        })

        expect(graph).toBeInstanceOf(Graph);
    })

    it("uses first node as initial node by default", () => {
        const graph = makeFlow(schema);

        expect(graph.current()).toBe("step1");
    })

    it("uses provided initial node", () => {
        const graph = makeFlow(schema, {
            initial: "step3"
        });

        expect(graph.current()).toBe("step3");
    });

    it("returns all nodes", () => {
        const graph = makeFlow(schema);

        expect(graph.getNodes()).toEqual([
            "step1",
            "step2",
            "step3",
            "step4",
            "step5"
        ]);
    });

    it("returns next nodes for current node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        expect(graph.getNext()).toEqual(["step2", "step3"]);
    });

    it("returns next nodes for provided node", () => {
        const graph = makeFlow(schema);

        expect(graph.getNext("step3")).toEqual(["step4", "step5"]);
    });

    it("returns empty next nodes for terminal node", () => {
        const graph = makeFlow(schema);

        expect(graph.getNext("step2")).toEqual([]);
    });

    it("returns graph edges", () => {
        const graph = makeFlow(schema);

        expect(graph.getEdges()).toEqual([
            ["step1", "step2"],
            ["step1", "step3"],
            ["step3", "step4"],
            ["step3", "step5"],
            ["step4", "step1"]
        ]);
    });

    it("checks if node exists", () => {
        const graph = makeFlow(schema);

        expect(graph.hasNode("step1")).toBe(true);
        expect(graph.hasNode("unknown")).toBe(false);
    });

    it("throws when asserting unknown node", () => {
        const graph = makeFlow(schema);

        expect(() => graph.assertNode("unknown")).toThrow(UnknownNodeError);
    });

    it("returns current snapshot", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        expect(graph.getSnapshot()).toEqual({
            current: "step1",
            next: ["step2", "step3"],
            context: undefined,
            history: ["step1"]
        });
    });

    it("checks transition between two nodes", () => {
        const graph = makeFlow(schema);

        expect(graph.canGo("step1", "step2")).toBe(true);
        expect(graph.canGo("step1", "step5")).toBe(false);
    });

    it("checks transition from current node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        expect(graph.canGoTo("step3")).toBe(true);
        expect(graph.canGoTo("step5")).toBe(false);
    });

    it("moves to allowed node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const result = graph.goTo("step3");

        expect(result).toEqual({
            ok: true,
            from: "step1",
            to: "step3",
            current: "step3"
        });

        expect(graph.current()).toBe("step3");
    });

    it("moves with payload", () => {
        type Payload = {
            source: "button" | "keyboard";
        };

        const graph = makeFlow<typeof schema, Payload>(schema, {
            initial: "step1"
        });

        const result = graph.goTo("step3", {
            source: "button"
        });

        expect(result).toEqual({
            ok: true,
            from: "step1",
            to: "step3",
            current: "step3",
            payload: {
                source: "button"
            }
        });
    });

    it("does not move to unknown node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const result = graph.goTo("unknown" as never);

        expect(result).toEqual({
            ok: false,
            reason: "UNKNOWN_NODE",
            from: "step1",
            to: "unknown"
        });

        expect(graph.current()).toBe("step1");
    });

    it("does not move through disallowed transition", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const result = graph.goTo("step5");

        expect(result).toEqual({
            ok: false,
            reason: "TRANSITION_NOT_ALLOWED",
            from: "step1",
            to: "step5"
        });

        expect(graph.current()).toBe("step1");
    });

    it("resets to initial node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        graph.goTo("step3");

        expect(graph.current()).toBe("step3");

        const snapshot = graph.reset();

        expect(snapshot).toEqual({
            context: undefined,
            current: "step1",
            next: ["step2", "step3"],
            history: ["step1"]
        });

        expect(graph.current()).toBe("step1");
    });

    it("notifies listener on subscribe", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();

        graph.subscribe(listener);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(
            {
                current: "step1",
                next: ["step2", "step3"],
                history: ["step1"],
                context: undefined
            },
            {
                type: "init",
                current: "step1"
            }
        );
    });

    it("notifies listener on transition", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();

        graph.subscribe(listener);
        graph.goTo("step3", {
            source: "button"
        });

        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener).toHaveBeenLastCalledWith(
            {
                current: "step3",
                next: ["step4", "step5"],
                history: ["step1", "step3"],
            },
            {
                type: "transition",
                from: "step1",
                to: "step3",
                payload: {
                    source: "button"
                }
            }
        );
    });

    it("notifies listener on reset", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();

        graph.subscribe(listener);
        graph.goTo("step3");
        graph.reset();

        expect(listener).toHaveBeenCalledTimes(3);
        expect(listener).toHaveBeenLastCalledWith(
            {
                context: undefined,
                current: "step1",
                next: ["step2", "step3"],
                history: ["step1"]
            },
            {
                type: "reset",
                from: "step3",
                to: "step1"
            }
        );
    });

    it("unsubscribes listener", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();
        const unsubscribe = graph.subscribe(listener);

        unsubscribe();

        graph.goTo("step3");

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it("throws when graph is empty", () => {
        expect(() => {
            makeFlow({});
        }).toThrow(EmptyGraphError);
    });

    it("throws when initial node does not exist", () => {
        expect(() => {
            makeFlow(schema, {
                initial: "unknown" as never
            });
        }).toThrow(InvalidInitialNodeError);
    });

    it("throws when getting next nodes for unknown node", () => {
        const graph = makeFlow(schema);

        expect(() => {
            graph.getNext("unknown" as never);
        }).toThrow(UnknownNodeError);
    });
})