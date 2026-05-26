---
layout: home

hero:
  name: Graphlet
  text: Typed headless graph runtime
  tagline: Build graph-based flows with TypeScript and render them in React.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: React Adapter
      link: /react/getting-started
    - theme: alt
      text: Open Demo
      link: /react/demo

features:
  - title: Headless core
    details: Graphlet manages graph state, transitions, context, history and subscriptions without depending on UI frameworks.
  - title: Tuple-based graph API
    details: Define graph transitions as [node, nextNodes] entries. Nodes can be strings, enums or other stable values.
  - title: React adapter
    details: Map graph nodes to React components and render the current node with GraphOutlet.
---