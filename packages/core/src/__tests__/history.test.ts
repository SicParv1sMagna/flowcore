import { describe, expect, it, vi } from "vitest";

import { defineFlow, makeFlow } from "../index.js";

const schema = defineFlow({
    step1: ["step2", "step3"],
    step2: ["step4"],
    step3: [],
    step4: []
});

describe("Graph history", () => {
    it("starts history with initial node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        expect(graph.getHistory()).toEqual(["step1"]);
    });

    it("adds nodes to history on transition", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        graph.goTo("step2");
        graph.goTo("step4");

        expect(graph.getHistory()).toEqual(["step1", "step2", "step4"]);
    });

    it("returns history copy", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const history = graph.getHistory();

        history.push("step3");

        expect(graph.getHistory()).toEqual(["step1"]);
    });

    it("checks if graph can go back", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        expect(graph.canGoBack()).toBe(false);

        graph.goTo("step2");

        expect(graph.canGoBack()).toBe(true);
    });

    it("goes back to previous node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        graph.goTo("step2");
        graph.goTo("step4");

        const result = graph.back();

        expect(result).toEqual({
            ok: true,
            from: "step4",
            to: "step2",
            current: "step2"
        });

        expect(graph.current()).toBe("step2");
        expect(graph.getHistory()).toEqual(["step1", "step2"]);
    });

    it("does not go back when history is empty", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const result = graph.back();

        expect(result).toEqual({
            ok: false,
            reason: "EMPTY_HISTORY",
            current: "step1"
        });

        expect(graph.current()).toBe("step1");
    });

    it("clears history and keeps current node", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        graph.goTo("step2");
        graph.goTo("step4");

        const snapshot = graph.clearHistory();

        expect(snapshot).toEqual({
            current: "step4",
            next: [],
            context: undefined,
            history: ["step4"]
        });

        expect(graph.getHistory()).toEqual(["step4"]);
        expect(graph.canGoBack()).toBe(false);
    });

    it("resets history on reset", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        graph.goTo("step2");
        graph.goTo("step4");

        const snapshot = graph.reset();

        expect(snapshot).toEqual({
            current: "step1",
            next: ["step2", "step3"],
            context: undefined,
            history: ["step1"]
        });

        expect(graph.getHistory()).toEqual(["step1"]);
    });

    it("notifies listener on back", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();

        graph.subscribe(listener);
        graph.goTo("step2");
        graph.back();

        expect(listener).toHaveBeenLastCalledWith(
            {
                current: "step1",
                next: ["step2", "step3"],
                context: undefined,
                history: ["step1"]
            },
            {
                type: "back",
                from: "step2",
                to: "step1"
            }
        );
    });

    it("notifies listener on history clear", () => {
        const graph = makeFlow(schema, {
            initial: "step1"
        });

        const listener = vi.fn();

        graph.subscribe(listener);
        graph.goTo("step2");
        graph.clearHistory();

        expect(listener).toHaveBeenLastCalledWith(
            {
                current: "step2",
                next: ["step4"],
                context: undefined,
                history: ["step2"]
            },
            {
                type: "history.clear",
                current: "step2"
            }
        );
    });
});