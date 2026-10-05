# Copilot Runtime

> The Copilot Runtime is the backend that connects your frontend to your AI agents, providing authentication, middleware, routing, and more.



The Copilot Runtime is the backend layer that connects your frontend application to your AI agents. It's set up during the [quickstart](/mastra/quickstart) and is the recommended way to use CopilotKit.

## Runtime languages

**TypeScript is the default and most fully featured runtime. It is the only runtime that can run without CopilotKit Intelligence.** Use it for an open-source setup, or connect it to Intelligence when you need its services.

Python, Go, Ruby, and C#/.NET runtimes require an Intelligence project and server-side API key. They work with both [cloud-hosted](/mastra/intelligence/managed-intelligence-platform) and [self-hosted](/mastra/intelligence/self-hosting) Intelligence; they do not provide an in-memory or SQLite runner.

| Language | Host | Without Intelligence |
| --- | --- | --- |
| TypeScript | Next.js, Express, Hono, and other JavaScript servers | Yes |
| Python | ASGI, with Python 3.11+ | No |
| Go | `net/http`, with Go 1.22+ | No |
| Ruby | Rack, including Rails and Sinatra, with Ruby 2.7+ | No |
| C#/.NET | ASP.NET Core, with .NET 8 | No |

Your runtime language does not have to match your agent language. Each runtime can connect to a remote AG-UI agent. A Python agent can stay behind a TypeScript runtime, for example.

Use the [Intelligence quickstart](/mastra/intelligence/quickstart#connect-your-runtime) for language-specific installation, authentication, and server setup. Shared Intelligence capabilities do not imply identical runtime APIs: TypeScript options such as `BuiltInAgent`, custom `AgentRunner` classes, audio transcription, and Open Generative UI are not available in every implementation.

The examples below use the TypeScript runtime.


## Setting Up the Runtime

The runtime is a lightweight server endpoint that you add to your backend:

```npm
npm install @copilotkit/runtime
```

Here's a minimal example using Next.js. `createCopilotRuntimeHandler` returns a
plain fetch handler. It lives at a **catch-all**
path and exports **GET, POST, PATCH, and DELETE**, so the runtime can serve its sub-routes (`/info`,
agent runs, threads) rather than a single URL:

```ts title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const runtime = new CopilotRuntime({
  agents: {
    // your agents go here
  },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
```

With the route in place, `GET /api/copilotkit/info` returns a JSON description of the
runtime and the agents it has registered. That route is how tooling — and the frontend's
transport auto-detection — discovers your runtime, so it is the quickest way to confirm
the endpoint is wired up.

Then point your frontend at the endpoint:


```tsx
<CopilotKit runtimeUrl="/api/copilotkit" useSingleEndpoint={false}>
  <YourApp />
</CopilotKit>
```

<Callout type="warn">
  `useSingleEndpoint={false}` selects the REST transport, which is what
  `createCopilotRuntimeHandler` serves. Pass it explicitly: in released versions
  `<CopilotKit>` pins the flag to `true` — the single-route transport, which
  posts everything to the bare `runtimeUrl` — and a multi-route runtime answers
  that with a 404 while `GET /info` still returns 200, so the app looks
  connected. `<CopilotKitProvider>` already negotiates the transport from
  `/info` when the prop is omitted, and `<CopilotKit>` will too, at which point
  this stays correct but stops being necessary. See [Provider and handler
  pairs](/mastra/backend/runtime-endpoints#provider-and-handler-pairs).

  To keep a single POST-only URL instead, mount the runtime with
  `createCopilotEndpointSingleRoute` at a plain `route.ts` and omit this prop.
</Callout>




For setup with other backend frameworks (Express, NestJS, Node.js HTTP), see the [quickstart](/mastra/quickstart).

## Which name identifies an agent

The name you use to address an agent from the frontend must equal a **key of the
runtime's `agents` map**. That key is the only name the frontend can ask for. An
agent's own `name`, `id`, or class name is never used for routing, and the two are
free to differ.

```ts title="app/api/copilotkit/[[...slug]]/route.ts"
const runtime = new CopilotRuntime({
  agents: {
    // `my_agent` is the key — the one string the frontend may ask for.
    my_agent: new HttpAgent({ url: "http://localhost:8000/" }),
  },
});
```


```tsx title="app/providers.tsx"
<CopilotKit runtimeUrl="/api/copilotkit" agent="my_agent" useSingleEndpoint={false}>
  <YourApp />
</CopilotKit>
```




Most integrations write that key literally in the runtime route, as above, so the
binding is visible in one file. Some derive it instead, and that is where the rule
stops being obvious:

- **Mastra** — `MastraAgent.getRemoteAgents` and `getLocalAgents` both build the map
  from `listAgents()`, which is keyed by the **record key** in
  `new Mastra({ agents: { ... } })`, not by the agent's `id`. Given
  `new Agent({ name: "My Agent" })` exported as `myAgent` and registered as
  `agents: { myAgent }`, the runtime key is `myAgent`.
- **LangGraph** — `graphId` is a *separate* binding, from the runtime to a key in your
  deployment's `langgraph.json`. It does not have to equal the runtime's agents-map
  key, and it is not the name the frontend asks for. The starter template happens to
  use `sample_agent` for both.

<Callout type="warn" title="An agent's declared name is not its routing key">
  Asking for a name the runtime did not register resolves no agent, and the frontend
  raises `CopilotKitAgentDiscoveryError` — see [Agent discovery
  failed](/mastra/troubleshooting/error-reference). The error message lists the keys the
  runtime actually returned, which is the quickest way to see the real names.
</Callout>

To read the registered keys directly, hit `GET {runtimeUrl}/info`. It returns the
agents the runtime advertises, under exactly the names the frontend must use.


## The Default Agent

If you register an agent with the name `"default"`, CopilotKit's prebuilt UI components will use it automatically without any additional configuration on the frontend. This is useful when you have one primary agent and don't want to specify an `agentId` everywhere.

```ts title="app/api/copilotkit/[[...slug]]/route.ts"
const runtime = new CopilotRuntime({
  agents: {
    // Frontend APIs use this agent when no other agent id is selected.
    default: new HttpAgent({ url: "https://my-agent.example.com" }),
  },
});
```

When you register multiple agents, the `"default"` agent powers the chat unless a specific agent is selected. Other agents remain addressable through the frontend agent API.

## What the Runtime Provides

### Authentication and Security

The runtime runs on your server, which means agent communication stays server-side. This gives you a trusted environment to enforce authentication, validate requests, and keep API keys secure. When you use the runtime, safe defaults are put in place so your agent endpoints are not exposed to unauthenticated access.

### AG-UI Middleware

The [AG-UI protocol](/ag-ui-protocol) supports a middleware layer (`agent.use`) for logging, guardrails, request transformation, and more. Because the runtime runs server-side, this middleware executes in a trusted environment where it cannot be tampered with by the client.

### Agent Routing

When you register multiple agents with the runtime, it handles discovery and routing automatically. Your frontend doesn't need to know the details of where each agent lives or how to reach it.

### CopilotKit Intelligence

Features like [threads](/mastra/threads) and the [inspector](/mastra/inspector) are provided through the runtime and CopilotKit Intelligence. These give you conversation persistence and debugging capabilities out of the box.

## Built-in Middleware

The runtime supports two first-class middleware options you can enable directly on `CopilotRuntime` without calling `.use()` on each agent manually.

### A2UI

Pass `a2ui: {}` to automatically apply `A2UIMiddleware` to all registered agents:

```ts title="app/api/copilotkit/[[...slug]]/route.ts"
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {}, // enables A2UI rendering for all agents
});
```

To scope it to specific agents only, pass an `agents` list:

```ts
a2ui: {
  agents: ["my-agent"];
}
```

On the frontend, the A2UI renderer activates automatically. Configure `a2ui`
only when you want to override its defaults:


```tsx
<CopilotKit
  runtimeUrl="/api/copilotkit"
  useSingleEndpoint={false}
  a2ui={{ theme: myCustomTheme }}
>
  {children}
</CopilotKit>
```




### mcpApps

Pass `mcpApps` to configure MCP servers for all agents from a single place:

```ts title="app/api/copilotkit/[[...slug]]/route.ts"
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  mcpApps: {
    servers: [
      { type: "http", url: "http://localhost:3108/mcp", serverId: "my-server" },
    ],
  },
});
```

Each server entry optionally accepts an `agentId` field to scope that server to a single agent. Without it, the server is available to all agents.

## What If I Want to Connect to My AG-UI Agent Directly?

CopilotKit is built on the [AG-UI protocol](/ag-ui-protocol), which is an open standard. If you want to connect your frontend directly to an AG-UI-compatible agent without the runtime, pass the agent instance in your frontend configuration:


```tsx
import { HttpAgent } from "@ag-ui/client";

const myAgent = new HttpAgent({
  url: "https://my-agent.example.com",
});

<CopilotKit agents__unsafe_dev_only={{ "my-agent": myAgent }}>
  <YourApp />
</CopilotKit>;
```




<Callout type="warn">
  Direct agent connections are intended for development and prototyping. This
  approach is not recommended for production unless you are confident in your
  setup, and is not officially supported by CopilotKit. If you run into issues
  with a direct connection, you will need to troubleshoot on your own.
</Callout>

There are important things to understand before going this route:

1. **Authentication is your responsibility.** When you use the Copilot Runtime, safe defaults are put in place so that your agent endpoints are not exposed to unauthenticated access. When you connect directly, it is entirely up to you to secure your agent endpoint and manage authentication.

2. **Many ecosystem features won't work.** The AG-UI protocol supports a middleware layer designed to run on the backend. Many features in the CopilotKit ecosystem depend on this server-side middleware. Without the runtime, these features — including [threads](/mastra/threads) and other capabilities — will not be available.

### Comparison

|                        | With Runtime                | Direct Connection |
| ---------------------- | --------------------------- | ----------------- |
| **Authentication**     | Safe defaults provided      | You manage it     |
| **AG-UI Middleware**   | Runs server-side            | Not available     |
| **Agent Routing**      | Automatic                   | Manual            |
| **Ecosystem Features** | Full support                | Limited           |
| **CopilotKit Support** | Supported                   | Not supported     |
| **Setup**              | Requires a backend endpoint | Frontend-only     |


## Local vs remote agents

There are two ways to mount Mastra agents on Copilot Runtime, and the choice is
decided by where your agent runs — not by preference.

- **Remote** — your Mastra instance already runs as its own process (`mastra dev`,
  a container, a deployed service). `MastraAgent.getRemoteAgents` reaches it over
  HTTP and leaves it exactly where it is. **Choose this for any project that
  already runs a Mastra service.**
- **Local** — your Mastra instance lives inside the same process as the runtime
  route, and you import it directly. `MastraAgent.getLocalAgents` bridges it
  in-process. This suits a greenfield single-process app, where there is no
  separate agent to preserve.

<Callout type="warn" title="The local path collapses two processes into one">
  Adopting the local shape in a repository that already runs a Mastra service means
  moving that service into your frontend — which deletes the process you were trying
  to keep. If your agent exists today, use the remote path.
</Callout>

### Remote agents

`getRemoteAgents` is asynchronous: it calls `listAgents()` on your Mastra server
and returns one AG-UI agent per agent that server reports, keyed by agent id.

```ts
import { CopilotRuntime, createCopilotRuntimeHandler, InMemoryAgentRunner } from "@copilotkit/runtime/v2";
import { MastraAgent } from "@ag-ui/mastra";
import { MastraClient } from "@mastra/client-js";

const mastraClient = new MastraClient({
  baseUrl: process.env.MASTRA_BASE_URL ?? "http://127.0.0.1:4111",
});

const runtime = new CopilotRuntime({
  agents: () =>
    MastraAgent.getRemoteAgents({
      mastraClient,
      resourceId: "user-1",
    }),
  runner: new InMemoryAgentRunner(),
});
```

Pass it as a **factory**, as above, rather than calling it at module scope. `agents`
does accept the promise itself — `agents: MastraAgent.getRemoteAgents({ ... })` — but
that starts the HTTP call when the module loads with nothing awaiting it yet. If the
agent server is not up, the rejection is unhandled and Node terminates the process.

The factory has no such window. Nothing runs until a request arrives, a failure
surfaces as a `500`, and the next request tries again — so a route that started
before its agent server did recovers on its own once that server comes up. The cost
is one `listAgents()` call per request; cache the result in a module-scope variable
if that matters to you.

Resolving per request is also what lets `resourceId` follow the caller, since the
factory receives the request:

```ts
const runtime = new CopilotRuntime({
  agents: ({ request }) =>
    MastraAgent.getRemoteAgents({
      mastraClient,
      resourceId: userIdFrom(request),
    }),
  runner: new InMemoryAgentRunner(),
});
```

`GetRemoteAgentsOptions`:

| Option | Required | Purpose |
| --- | --- | --- |
| `mastraClient` | yes | A `MastraClient` from `@mastra/client-js`, pointed at your agent server's base URL. |
| `resourceId` | yes | Mastra's memory *resource* — the key working memory is stored under. Falls back to the thread id when the value is unset. |
| `observationalMemory` | no | Surface Mastra Observational Memory as AG-UI activity events. `true` for every agent, or an array of agent ids. Off by default. |
| `tracingOptions` | no | Forwarded to each run. See [Execution tracing](#execution-tracing). |

**Base URL convention.** Read the address from the environment and default to the
local Mastra dev port, so the same route works locally and against a deployed
service:

```ts
baseUrl: process.env.MASTRA_BASE_URL ?? "http://127.0.0.1:4111"
```

Prefer `127.0.0.1` over `localhost`: on machines that resolve `localhost` to IPv6
first, the loopback name can miss an agent server bound to IPv4 only.

### Local agents

`getLocalAgents` is synchronous and takes the `Mastra` instance itself instead of
a client. It also accepts `requestContext` and `untilIdle`, neither of which has a
remote equivalent — `untilIdle` is what [background tasks](/mastra/background-tasks)
build on, so a run that needs it has to be embedded.

```ts
const runtime = new CopilotRuntime({
  agents: MastraAgent.getLocalAgents({ mastra, resourceId: "user-1" }),
  runner: new InMemoryAgentRunner(),
});
```

## Execution tracing

When you embed a Mastra agent in Copilot Runtime, its tracing is carried through
AG-UI end to end, so runs show up in your Mastra observability backend with no
extra wiring.

- **Inbound** — pass `tracingOptions` alongside `mastra` in
  `MastraAgent.getLocalAgents` to anchor each run under a caller-chosen trace.
  `getRemoteAgents` takes the same option. The shape is
  `{ traceId?: string; metadata?: Record<string, unknown> }`:

  ```ts
  const runtime = new CopilotRuntime({
    agents: MastraAgent.getLocalAgents({
      mastra,
      resourceId: "user-1",
      tracingOptions: {
        traceId: myTraceId,
        metadata: { feature: "support-chat", tenant: tenantId },
      },
    }),
  });
  ```

- **Outbound** — the execution `traceId` Mastra assigns to a run is surfaced on
  the `RUN_FINISHED` event's `result` field as `{ traceId }`, so you can anchor
  feedback or scores back to the exact run (e.g. `createFeedback({ traceId })`).
