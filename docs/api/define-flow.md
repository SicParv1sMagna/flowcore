# defineGraph

Defines a graph schema and preserves literal node types.

```ts
const schema = defineGraph({
  step1: ["step2"],
  step2: []
});
```

## Why use defineGraph?

Without `defineGraph`, TypeScript may widen node names to `string`.

With `defineGraph`, node names remain literal:

```ts
"step1" | "step2"
```

This allows `makeGraph` and `Graph` to provide typed APIs.

## Target validation

`defineGraph` can also catch unknown target nodes at type level.

```ts
defineGraph({
  step1: ["step2"],
  step2: []
});
```

This is valid.

```ts
defineGraph({
  step1: ["missing"],
  step2: []
});
```

This should produce a TypeScript error because `missing` is not a node in the schema.