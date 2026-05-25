# defineFlow

Defines a graph schema and preserves literal node types.

```ts
const schema = defineFlow({
  step1: ["step2"],
  step2: []
});
```

## Why use defineFlow?

Without `defineFlow`, TypeScript may widen node names to `string`.

With `defineFlow`, node names remain literal:

```ts
"step1" | "step2"
```

This allows `makeFlow` and `Graph` to provide typed APIs.

## Target validation

`defineFlow` can also catch unknown target nodes at type level.

```ts
defineFlow({
  step1: ["step2"],
  step2: []
});
```

This is valid.

```ts
defineFlow({
  step1: ["missing"],
  step2: []
});
```

This should produce a TypeScript error because `missing` is not a node in the schema.