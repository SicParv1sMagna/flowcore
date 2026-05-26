import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/graphlet/",

  title: "Graphlet",
  description: "Typed headless graph runtime",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "React", link: "/react/getting-started" },
      { text: "API", link: "/api/graph" },
      { text: "Demo", link: "/react/demo" }
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Core Concepts", link: "/guide/core-concepts" },
          { text: "Context", link: "/guide/context" },
          { text: "History", link: "/guide/history" },
          { text: "Subscriptions", link: "/guide/subscriptions" }
        ]
      },
      {
        text: "React",
        items: [
          { text: "Getting Started", link: "/react/getting-started" },
          { text: "React Graphs", link: "/react/react-graphs" },
          { text: "GraphOutlet", link: "/react/graph-outlet" },
          { text: "Demo", link: "/react/demo" }
        ]
      },
      {
        text: "API",
        items: [
          { text: "Graph", link: "/api/graph" },
          { text: "React Adapter", link: "/api/react" }
        ]
      }
    ],

    search: {
      provider: "local"
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/sicparv1smagna/graphlet"
      }
    ]
  }
});
