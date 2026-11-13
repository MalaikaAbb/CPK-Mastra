"use client";

/**
 * docs.copilotkit.ai/mastra/headless-threads — the page's snippets assembled.
 *
 * Verbatim from the page:
 *   - `ThreadSidebar` (step "List and manage threads with useThreads"), with
 *     the pagination step's `limit: 20` and "Load more" block merged in: the
 *     page prints them as two separate `ThreadSidebar.tsx` blocks that each
 *     destructure the same hook, so they are one hook call here.
 *   - `App` (step "Switch between threads").
 *
 * Published bugs kept (README §9):
 *   - `App` passes `onSelectThread` to `ThreadSidebar`, which takes no props
 *     and whose rows have no click handler, so picking a thread is impossible.
 *   - `useThreads({ agentId: "my-agent" })` while the page's runtime snippet
 *     registers only `default` (the agent `CopilotChat` runs on), so the list
 *     queries a different agent than the one the chat writes threads for.
 *
 * Harness changes only: `DemoFrame`, a `CopilotKitProvider` (the page prints
 * none) pointed at the dedicated Intelligence runtime `/api/copilotkit-threads`
 * with `useSingleEndpoint={false}` (that runtime is multi-route), and
 * `enableInspector` so exactly one inspector mounts (see lib/inspector.ts).
 */

import {
  CopilotKitProvider,
  useThreads,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

function ThreadSidebar() {
  const {
    threads,
    isLoading,
    renameThread,
    archiveThread,
    deleteThread,
    hasMoreThreads,
    isFetchingMoreThreads,
    fetchMoreThreads,
  } = useThreads({
    agentId: "my-agent",
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {threads.map((thread) => (
        <div key={thread.id}>
          <span>{thread.name ?? "New conversation"}</span>
          <button onClick={() => renameThread(thread.id, "Renamed")}>
            Rename
          </button>
          <button onClick={() => archiveThread(thread.id)}>
            Archive
          </button>
        </div>
      ))}
      {hasMoreThreads && (
        <button
          onClick={fetchMoreThreads}
          disabled={isFetchingMoreThreads}
        >
          {isFetchingMoreThreads ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

function App() {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  return (
    <div className="flex">
      {/* @ts-expect-error -- published: ThreadSidebar is declared with no props, App passes onSelectThread */}
      <ThreadSidebar onSelectThread={setActiveThreadId} />
      <CopilotChat threadId={activeThreadId} />
    </div>
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/headless-threads"
      subtitle='useThreads({ agentId: "my-agent" }) · runtime: /api/copilotkit-threads'
    >
      <CopilotKitProvider
        runtimeUrl="/api/copilotkit-threads"
        useSingleEndpoint={false}
        enableInspector={nestedInspectorSetting}
      >
        <App />
      </CopilotKitProvider>
    </DemoFrame>
  );
}
