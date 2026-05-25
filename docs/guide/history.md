# History

Flowcore keeps a history of visited nodes.

History is useful for wizard-like flows, screen graphs and back navigation.

## Read history

```typescript
const flow = makeFlow(schema, {
    inital: "step1"
});

flow.getHistory();
// ["step1"]
```

## History after trnasitions

```typescript
flow.goTo("step2");
flow.goTo("step3");

flow.getHistory();
// ["step1", "step2", "step3"]
```

## Go back

```typescript
flow.back();
```

Example:

```typescript
flow.current();
// "step4"

flow.back();

flow.current();
// "step3"
```

If there is no previous node, `back` returns a failure result:

```json
{
  "ok": false,
  "reason": "EMPTY_HISTORY",
  "current": "step1"
}
```

## Check if back is possible

```typescript
flow.canGoBack();
// true or false
```

## Clear history

```typescript
flow.clearHistory();
```

This keeps the current node and resets history to only that node.

```typescript
flow.current();
// "step4"

flow.clearHistory();

flow.getHistory();
// ["step4"]
```

## Reset

`reset()` returns graph to the initial node and resets history.

```typescript
flow.reset();

flow.current();
// "step1"

flow.getHistory();
// ["step1"]
```