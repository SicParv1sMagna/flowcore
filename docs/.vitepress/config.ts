import { defineConfig } from "vitepress";

export default defineConfig({
    base: "/graphlet/",
    title: "graphlet",
    description: "Typed headless graph runtime",

    themeConfig: {
        nav: [
            { text: "Guide", link: "/guide/getting-started" },
            { text: "API", link: "/api/make-flow" }
        ],

        sidebar: [
            {
                text: "Guide",
                items: [
                    { text: "Getting started", link: "/guide/getting-started" },
                    { text: "Core Concepts", link: "/guide/core-concepts" },
                    { text: "Context", link: "/guide/context" },
                    { text: "History", link: "/guide/history" },
                    { text: "Subscriptions", link: "/guide/subscriptions" },
                ]
            },
            {
                text: "API",
                items: [
                    { text: "defineGraph", link: "/api/define-flow" },
                    { text: "makeGraph", link: "/api/make-flow" },
                    { text: "Graph", link: "/api/graph" },
                ]
            }
        ],

        search: {
            provider: "local"
        },

        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/SicParv1sMagna/graphlet"
            }
        ]
    }
});