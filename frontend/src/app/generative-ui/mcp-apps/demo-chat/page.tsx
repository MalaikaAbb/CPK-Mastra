"use client";

/**
 * docs.copilotkit.ai/mastra/generative-ui/mcp-apps
 *
 * Step 3 — Configure your agent: api/copilotkit-mcp-apps/[[...slug]]/route.ts
 *   (one runtime per MCP server: `/local` and `/live`).
 * Step 5 — Configure CopilotKit Provider: `Providers` below, pointed at the
 *   selected server's runtime instead of `/api/copilotkit`. The page's
 *   `app/layout.tsx` half is already this repo's root layout.
 * Step 6 — Add the chat interface: `Page` below.
 *
 * Not from the page: the server switch, and the status line — with a server
 * down the agent simply has no MCP tools and nothing reports it.
 */

import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import { useEffect, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

type ServerKey = "live" | "local";

const SERVERS: Record<
  ServerKey,
  { label: string; url: string; note: string; tryPrompt: string }
> = {
  live: {
    label: "Live server",
    url: "https://mcp.excalidraw.com/mcp",
    note: "Public Excalidraw MCP App — nothing to run locally.",
    tryPrompt:
      "Draw a simple diagram: a box labelled Browser with an arrow to a box labelled Server.",
  },
  local: {
    label: "Local server",
    url: "http://localhost:3108/mcp",
    note: "The page's own setup — start an ext-apps example on port 3108 first (see the notes page).",
    tryPrompt: "Help me allocate a $100K budget",
  },
};

// #region providers
// Step 5 — Configure CopilotKit Provider
function Providers({
  runtimeUrl,
  children,
}: {
  runtimeUrl: string;
  children: React.ReactNode;
}) {
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      useSingleEndpoint={false}
      enableInspector={nestedInspectorSetting}
    >
      {children}
    </CopilotKit>
  );
}
// #endregion

// #region page
// Step 6 — Add the chat interface
function Page() {
  return (
    <main>
      <h1>Your App</h1>
      <CopilotSidebar />
    </main>
  );
}
// #endregion

function McpServerStatus({ url }: { url: string }) {
  const [result, setResult] = useState<{ url: string; up: boolean } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    // Any HTTP response means the server is listening; a network error means
    // it is not.
    fetch(url, { method: "GET" })
      .then(() => !cancelled && setResult({ url, up: true }))
      .catch(() => !cancelled && setResult({ url, up: false }));
    return () => {
      cancelled = true;
    };
  }, [url]);

  const up = result?.url === url ? result.up : null;

  return (
    <p
      className={`text-xs ${
        up
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-amber-700 dark:text-amber-400"
      }`}
    >
      MCP server {url}:{" "}
      {up === null ? "checking…" : up ? "reachable" : "not reachable"}
    </p>
  );
}

export default function DemoPage() {
  const [server, setServer] = useState<ServerKey>("live");
  const active = SERVERS[server];

  return (
    <DemoFrame
      parentPath="/generative-ui/mcp-apps"
      subtitle={`BuiltInAgent · mcpApps → ${active.url}`}
    >
      <div className="space-y-3 p-8">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SERVERS) as ServerKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setServer(key)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                server === key
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {SERVERS[key].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {active.note} Try: <em>{active.tryPrompt}</em>
        </p>
        <McpServerStatus url={active.url} />

        {/* `key` remounts the provider, so switching servers starts a fresh chat. */}
        <Providers key={server} runtimeUrl={`/api/copilotkit-mcp-apps/${server}`}>
          <Page />
        </Providers>
      </div>
    </DemoFrame>
  );
}
