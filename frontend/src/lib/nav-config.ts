/**
 * The nav, the route headers, and the README status table all read from here,
 * so a doc page and its implementation status are described exactly once.
 *
 * Route paths mirror the doc URLs under docs.copilotkit.ai/mastra.
 * `offNav: true` marks pages that resolve fine but are absent from that
 * sidebar as of DOC_SYNC_DATE.
 */

/**
 * There is exactly one doc-sync date in this repo, and it is not here: it is
 * `syncedAt` in `doc-snapshot/manifest.json`, written every time the sync
 * button runs. A hand-maintained date alongside it only ever drifted out of
 * agreement with the machine one, so it was removed — `/doc-sync` is the
 * single place that answers "how current are these docs".
 */
export const DOCS_ROOT = "https://docs.copilotkit.ai/mastra";

export type RouteStatus = "working" | "partial" | "reference" | "broken" | "not-started";

export interface RouteMeta {
  path: string;
  title: string;
  docPath: string;
  summary: string;
  status: RouteStatus;
  statusNote?: string;
  offNav?: boolean;
  /** Owns a live surface at `<path>/demo-chat`. */
  hasDemo?: boolean;
}

export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === "/" ? "/demo-chat" : `${route.path}/demo-chat`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    routes: [
      {
        path: "/",
        title: "Introduction",
        docPath: "/mastra",
        summary: "What this harness covers and how the pieces fit together.",
        status: "reference",
        statusNote: "Landing page — orientation and a live agent roster.",
      },
      {
        path: "/quickstart",
        hasDemo: true,
        title: "Quickstart",
        docPath: "/mastra/quickstart?agent=bring-your-own",
        summary:
          "The bring-your-own-agent path: a Mastra instance bound into the runtime with getLocalAgents.",
        status: "working",
      },
    ],
  },
  {
    title: "Basics",
    routes: [
      {
        path: "/prebuilt-components",
        hasDemo: true,
        title: "Prebuilt Components",
        docPath: "/mastra/prebuilt-components",
        summary:
          "CopilotChat, CopilotPopup, and CopilotSidebar side by side, each driving the same agent.",
        status: "working",
      },
      {
        path: "/prebuilt-components/copilot-threads-drawer",
        hasDemo: true,
        title: "Threads Drawer",
        docPath: "/mastra/prebuilt-components/copilot-threads-drawer",
        summary:
          "A prebuilt thread list beside the chat that switches, starts, archives, and deletes conversations through a shared chat configuration.",
        status: "partial",
        statusNote:
          "Requires CopilotKit Intelligence (CPK_INTELLIGENCE_API_KEY); without it only the locked view is testable. The header-slot snippet cannot work in 1.79.1. Built from the published code; not yet exercised against a live Intelligence project in this harness.",
      },
      {
        path: "/headless-threads",
        hasDemo: true,
        title: "Headless Threads",
        docPath: "/mastra/headless-threads",
        summary:
          "A hand-drawn thread list over useThreads (rename, archive, paging) feeding a threadId into CopilotChat.",
        status: "broken",
        statusNote:
          "As published, the sidebar takes no onSelectThread prop and has no row click handler, so threads can't be switched; it also lists agent \"my-agent\" while the runtime snippet registers only \"default\". Requires CopilotKit Intelligence. Not yet run.",
      },
    ],
  },
  {
    title: "Custom Look and Feel",
    routes: [
      {
        path: "/custom-look-and-feel/slots",
        hasDemo: true,
        title: "Slots",
        docPath: "/mastra/custom-look-and-feel/slots",
        summary:
          "Replacing chat sub-components at three levels: class strings, prop overrides, and whole components.",
        status: "working",
        offNav: true,
      },
      {
        path: "/custom-look-and-feel/headless-ui",
        hasDemo: true,
        title: "Headless UI",
        docPath: "/mastra/custom-look-and-feel/headless-ui",
        summary:
          "A chat interface built from scratch on the headless hooks, with no CopilotKit chrome.",
        status: "working",
        offNav: true,
      },
      {
        path: "/programmatic-control",
        hasDemo: true,
        title: "Programmatic Control",
        docPath: "/mastra/programmatic-control",
        summary:
          "Driving the agent with no chat UI: read state and messages, run it, and stop it mid-run.",
        status: "working",
      },
      {
        path: "/inspector",
        hasDemo: true,
        title: "Inspector",
        docPath: "/mastra/inspector",
        summary:
          "The built-in debugging overlay showing AG-UI events, agents, state, and registered tools.",
        status: "working",
      },
    ],
  },
  {
    title: "Generative UI",
    routes: [
      {
        path: "/generative-ui/your-components/display-only",
        hasDemo: true,
        title: "Your Components · Display-only",
        docPath: "/mastra/generative-ui/your-components/display-only",
        summary:
          "Registering a React component as a tool the agent can render, with no handler.",
        status: "working",
      },
      {
        path: "/generative-ui/your-components/interactive",
        hasDemo: true,
        title: "Your Components · Interactive",
        docPath: "/mastra/generative-ui/your-components/interactive",
        summary:
          "An approval gate built with useHumanInTheLoop — the run suspends until the user authorises the action.",
        status: "working",
      },
      {
        path: "/generative-ui/tool-based",
        hasDemo: true,
        title: "Components as Tools",
        docPath: "/mastra/generative-ui/tool-based",
        summary:
          "Charts registered with useComponent become frontend tools a prompt-only Mastra agent calls to paint them in chat.",
        status: "partial",
        statusNote:
          "Agent and demo page as published; the bar/pie chart components are borrowed (unpublished) and the headless CopilotChatToolCallsView snippet is not built. Not yet run against a live model.",
      },
      {
        path: "/generative-ui/tool-rendering",
        hasDemo: true,
        title: "Tool Rendering",
        docPath: "/mastra/generative-ui/tool-rendering",
        summary:
          "The weatherInfo tool call rendered as a custom component, plus a catch-all renderer.",
        status: "working",
      },
      {
        path: "/generative-ui/state-rendering",
        hasDemo: true,
        title: "State Rendering",
        docPath: "/mastra/generative-ui/state-rendering",
        summary:
          "A searches list held in working memory and rendered live as the agent updates it.",
        status: "working",
      },
      {
        path: "/generative-ui/a2ui",
        hasDemo: true,
        title: "A2UI",
        docPath: "/mastra/generative-ui/a2ui",
        summary:
          "The A2UI overview's two switches: a2ui: {} on the runtime and an optional theme on the provider, around the Quickstart agent.",
        status: "partial",
        statusNote:
          "The page's agent (myAgent) is undefined and emits no A2UI; swapped for the Quickstart agent on a dedicated route. Not yet run, so whether a surface ever renders is unverified.",
      },
      {
        path: "/generative-ui/a2ui/dynamic-schema",
        hasDemo: true,
        title: "A2UI · Dynamic Schema",
        docPath: "/mastra/generative-ui/a2ui/dynamic-schema",
        summary:
          "A client-side component catalog the runtime hands to an auto-injected generate_a2ui tool, which designs the whole surface per request.",
        status: "broken",
        statusNote: "The page describes but never prints the same-process runtime route or the agent that owns generate_a2ui; not filled in, so nothing renders. Route config is labelled prose-only.",
      },
      {
        path: "/generative-ui/a2ui/fixed-schema",
        hasDemo: true,
        title: "A2UI · Fixed Schema",
        docPath: "/mastra/generative-ui/a2ui/fixed-schema",
        summary:
          "A fixed flight-card catalog rendered from an agent-owned generate_a2ui tool, with runtime injection turned off.",
        status: "partial",
        statusNote: "Built from the published code; not yet exercised against a live model in this harness. The runtime route is harness glue; the a2ui-context helpers are now published.",
      },
      {
        path: "/generative-ui/json-render",
        title: "JSON Render",
        docPath: "/mastra/generative-ui/json-render",
        summary:
          "An agent reply in { root, elements } JSON parsed in the assistant-message slot and drawn by @json-render/react through a Zod-described registry.",
        status: "broken",
        statusNote:
          "Reference-only: the agent/prompt, runtime route, provider page, types and the registry's components are never printed, and the json-render packages aren't installed here.",
      },
      {
        path: "/generative-ui/hashbrown",
        title: "Hashbrown",
        docPath: "/mastra/generative-ui/hashbrown",
        summary:
          "A streamed { ui: [...] } envelope parsed progressively by Hashbrown and rendered through a UI kit of charts and cards.",
        status: "broken",
        statusNote:
          "Reference-only: the agent/prompt, runtime route, charts, metric card, types and suggestions are never printed, and the Hashbrown packages aren't installed here.",
      },
      {
        path: "/generative-ui/components",
        hasDemo: true,
        title: "Components and surfaces",
        docPath: "/mastra/generative-ui/components",
        summary:
          "The agent renders catalog components (the 69-component standard catalog) in the chat via a render_ui tool the runtime adds when the provider sends a catalog.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: the page's standardUI provider.",
      },
      {
        path: "/generative-ui/components/surfaces",
        hasDemo: true,
        title: "Surfaces",
        docPath: "/mastra/generative-ui/components/surfaces",
        summary:
          "Named GenerativeUISurface areas on the page that the agent can fill from the chat, with component limits, scrolling, per-item targets and error boundaries.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: error-boundary provider, 'featured' (limited) and 'sidebar-notes' targets. Not mounted: FeaturedProducts and the per-item target (undefined products/Product/product).",
      },
      {
        path: "/generative-ui/components/catalogs",
        hasDemo: true,
        title: "Catalogs",
        docPath: "/mastra/generative-ui/components/catalogs",
        summary:
          "Declaring the agent's component vocabulary with createGenerativeUI: typed props, schema libraries, combining catalogs and exporting an A2UI catalog.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: shopUI. Not mounted: Combine/export (undefined cartUI); schema-library and positional-order fragments.",
      },
      {
        path: "/generative-ui/components/standard-catalog",
        hasDemo: true,
        title: "Standard catalog",
        docPath: "/mastra/generative-ui/components/standard-catalog",
        summary:
          "The 69 built-in standardUI components, and extending, trimming (omit) or overriding them with your own.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: as is, omit, overrides. Not mounted: extend (undefined ProductCard, productSchema).",
      },
      {
        path: "/generative-ui/components/state-and-actions",
        title: "State and actions",
        docPath: "/mastra/generative-ui/components/state-and-actions",
        summary:
          "Binding live app state into generated components, running app functions on clicks, sending events to the agent and keeping user input.",
        status: "broken",
        statusNote:
          "Reference only, no backend. Every sample needs pieces the page never defines (Cart type and cart instance, ProductCard) or is a fragment (events, writable, function declarations), so nothing is mounted.",
      },
      {
        path: "/generative-ui/components/theming",
        hasDemo: true,
        title: "Theming",
        docPath: "/mastra/generative-ui/components/theming",
        summary:
          "Styling the standard components with a GenerativeUITheme (variables, per-mode colors, dark mode) or plain CSS variables.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: provider theme, CSS variables, dark-mode script. Shown only: per-mode/map fragments, theme file.",
      },
      {
        path: "/generative-ui/components/transports",
        hasDemo: true,
        title: "Transports",
        docPath: "/mastra/generative-ui/components/transports",
        summary:
          "Choosing between the render_ui tool transport and the markdown transport, and limiting generative UI to some agents.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted on a generativeUI: true runtime: tool, markdown, agentIds as default. The markdown variant cannot work (it depends on context only). No shop agent is published.",
      },
      {
        path: "/generative-ui/components/markdown-mode",
        hasDemo: true,
        title: "Markdown mode",
        docPath: "/mastra/generative-ui/components/markdown-mode",
        summary:
          "The agent writes a2ui code blocks inside its markdown reply, with no tool call, rendered in place as they stream.",
        status: "broken",
        statusNote:
          "Wired to componentsAgent on CopilotKit 1.87, but expected to show no UI: markdown mode sends the schema and fence guide only as context, which @ag-ui/mastra puts on requestContext and the agent's instructions do not read. Not browser-checked.",
      },
      {
        path: "/generative-ui/components/from-a2ui",
        hasDemo: true,
        title: "Adopt from A2UI",
        docPath: "/mastra/generative-ui/components/from-a2ui",
        summary:
          "Moving from the a2ui renderer (A2UI v0.9) to components and surfaces (A2UI 1.0): provider, catalog, runtime and bindings.",
        status: "partial",
        statusNote:
          "Wired to componentsAgent (a Mastra agent standing in for the section's BuiltInAgent; page prompt, no tools) on CopilotKit 1.87. render_ui reaches the model with its full schema, but not its guide: @ag-ui/mastra puts the run's context on requestContext, not in the prompt. Not browser-checked. Mounted: the After catalog; Airport/Arrow borrowed from aws-strands-ts.",
      },
      {
        path: "/generative-ui/open-generative-ui",
        hasDemo: true,
        title: "Open Generative UI",
        docPath: "/mastra/generative-ui/open-generative-ui",
        summary:
          "Agent-authored HTML/CSS/JS streamed into a sandboxed iframe; the advanced cell lets that iframe call host functions.",
        status: "partial",
        statusNote: "Built from the published code; not yet exercised against a live model in this harness.",
      },
      {
        path: "/generative-ui/mcp-apps",
        hasDemo: true,
        title: "MCP Apps",
        docPath: "/mastra/generative-ui/mcp-apps",
        summary:
          "Interactive iframes served by an MCP server, rendered in chat through the runtime's mcpApps option.",
        status: "partial",
        statusNote:
          "Runtime as published with a Mastra agent in place of the page's BuiltInAgent; needs an external ext-apps MCP server on :3108. Not yet run.",
      },
    ],
  },
  {
    title: "App Control",
    routes: [
      {
        path: "/frontend-tools",
        hasDemo: true,
        title: "Frontend Tools",
        docPath: "/mastra/frontend-tools",
        summary:
          "A tool the agent calls that executes in the browser, forwarded automatically over AG-UI.",
        status: "working",
      },
      {
        path: "/human-in-the-loop",
        title: "HITL Overview",
        docPath: "/mastra/human-in-the-loop/index",
        summary:
          "Orientation: tool-based HITL (useHumanInTheLoop) is the supported Mastra path; native interrupts are labelled unsupported.",
        status: "reference",
        statusNote:
          "No code on the page; a reference panel linking this harness's HITL routes.",
        path: "/webmcp",
        hasDemo: true,
        title: "WebMCP",
        docPath: "/mastra/webmcp",
        summary:
          "A frontend tool also published to document.modelContext so WebMCP browser agents can discover and call it in the page.",
        status: "broken",
        statusNote:
          "The published handler calls searchOrders, which the page never defines; registration works, every call throws. Needs Chrome 149+ with WebMCP enabled to see the browser side. Not yet run.",
      },
      {
        path: "/human-in-the-loop/tool-based",
        hasDemo: true,
        title: "Human in the Loop",
        docPath: "/mastra/human-in-the-loop/tool-based",
        summary:
          "A tool call that suspends the run until the user picks one of two options.",
        status: "working",
      },
      {
        path: "/human-in-the-loop/useInterrupt",
        title: "HITL · useInterrupt",
        docPath: "/mastra/human-in-the-loop/useInterrupt",
        summary:
          "A backend tool that suspends the Mastra run, rendered in chat by useInterrupt and resumed with the user's pick.",
        status: "broken",
        statusNote:
          "Reference-only: the suspend() tool the whole flow depends on is never published.",
      },
      {
        path: "/human-in-the-loop/headless",
        title: "HITL · Headless Interrupts",
        docPath: "/mastra/human-in-the-loop/headless",
        summary:
          "The same interrupt resolved outside the chat, via useInterrupt with renderInChat: false.",
        status: "broken",
        statusNote:
          "Reference-only: shares useInterrupt's unpublished backend tool.",
      },
      {
        path: "/human-in-the-loop/governed-actions",
        hasDemo: true,
        title: "HITL · Governed Actions",
        docPath: "/mastra/human-in-the-loop/governed-actions",
        summary:
          "An approval card gating a side-effecting action by policy verdict before the agent may run it.",
        status: "partial",
        statusNote:
          "useHumanInTheLoop variant is live; the useInterrupt variant is reference-only (no published backend). Built from the published code; not yet exercised against a live model in this harness.",
      },
      {
        path: "/background-tasks",
        hasDemo: true,
        title: "Background Tasks",
        docPath: "/mastra/background-tasks",
        summary:
          "Long-running work dispatched to a background worker, surfaced as AG-UI activity events.",
        status: "working",
      },
    ],
  },
  {
    title: "Shared State",
    routes: [
      {
        path: "/shared-state/in-app-agent-read",
        hasDemo: true,
        title: "Reading agent state",
        docPath: "/mastra/shared-state/in-app-agent-read",
        summary:
          "Reading Mastra working memory in your own UI through agent.state.",
        status: "working",
      },
      {
        path: "/shared-state/in-app-agent-write",
        hasDemo: true,
        title: "Writing agent state",
        docPath: "/mastra/shared-state/in-app-agent-write",
        summary: "Writing back into working memory with agent.setState.",
        status: "working",
      },
      {
        path: "/shared-state/predictive-state-updates",
        hasDemo: true,
        title: "Predictive State Updates",
        docPath: "/mastra/shared-state/predictive-state-updates",
        summary:
          "A document streamed into working memory and rendered live as the agent writes it.",
        status: "working",
      },
      {
        path: "/agent-app-context",
        hasDemo: true,
        title: "Agent App Context",
        docPath: "/mastra/agent-app-context",
        summary:
          "Sharing app state with the agent via useAgentContext, read back through requestContext.",
        status: "working",
      },
    ],
  },
  {
    title: "Multi-Agent",
    routes: [
      {
        path: "/multi-agent/subagents",
        hasDemo: true,
        title: "Sub-Agents",
        docPath: "/mastra/multi-agent/subagents",
        summary:
          "A supervisor that delegates to research, writing, and critique sub-agents exposed as tools.",
        status: "broken",
        statusNote:
          "Delegation runs and the log's writer is now published, but the published tool keys still don't match the published renderers, so no in-chat cards or banner appear. Built from the published code; not yet exercised against a live model in this harness.",
      },
    ],
  },
  {
    title: "Backend",
    routes: [
      {
        path: "/copilot-runtime",
        hasDemo: true,
        title: "Copilot Runtime",
        docPath: "/mastra/copilot-runtime",
        summary:
          "This repo's live runtime config, routing across all seven agents, and the local-vs-remote tradeoff.",
        status: "working",
      },
      {
        path: "/ag-ui",
        hasDemo: true,
        title: "AG-UI",
        docPath: "/mastra/ag-ui",
        summary:
          "A live capture of the raw AG-UI event stream flowing between the runtime and this page.",
        status: "working",
      },
    ],
  },
  {
    title: "Doc Sync",
    routes: [
      {
        path: "/doc-sync",
        title: "Doc drift",
        docPath: "/mastra",
        summary:
          "Re-fetches the markdown behind every tracked doc page and diffs it against the stored snapshot, flagging changes inside code blocks.",
        status: "reference",
      },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: "Working",
  partial: "Partial",
  reference: "Reference",
  broken: "Broken",
  "not-started": "Not started",
};
