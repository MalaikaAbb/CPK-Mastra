"use client";

/**
 * docs.copilotkit.ai/mastra/headless-threads
 *
 * Step 1 — Configure your Runtime with CopilotKit Intelligence:
 *   api/copilotkit-threads/[[...slug]]/route.ts (shared with the Threads
 *   Drawer). The provider below points at it; `useSingleEndpoint={false}`
 *   because that runtime is multi-route.
 * Step 2 — List and manage threads with useThreads: `ThreadSidebar`.
 * Step 3 — Switch between threads: `App`.
 * Step 4 — Add pagination for large thread lists: merged into `ThreadSidebar`.
 *
 * Differences from the published code (README §9 item 21): `agentId` is
 * "default" rather than "my-agent", `ThreadSidebar` accepts `onSelectThread`
 * and calls it on row click, and layout/styling is added.
 */

import { CopilotKitProvider } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

// #region thread-sidebar
// Step 2 — List and manage threads with useThreads
import { useThreads } from "@copilotkit/react-core/v2";

function ThreadSidebar({
  activeThreadId,
  onSelectThread,
}: {
  activeThreadId?: string;
  onSelectThread: (threadId: string) => void;
}) {
  const {
    threads,
    isLoading,
    renameThread,
    archiveThread,
    deleteThread,
    // Step 4 — Add pagination for large thread lists
    hasMoreThreads,
    isFetchingMoreThreads,
    fetchMoreThreads,
  } = useThreads({
    // Published as "my-agent"; the runtime registers its agent as `default`.
    agentId: "default",
    limit: 20,
  });

  if (isLoading)
    return (
      <div className="w-72 shrink-0 border-r border-slate-200 p-3 text-sm dark:border-slate-800">
        Loading...
      </div>
    );

  return (
    <div className="flex w-72 shrink-0 flex-col gap-1 overflow-y-auto border-r border-slate-200 p-3 dark:border-slate-800">
      {threads.length === 0 && (
        <p className="text-sm text-slate-500">No threads yet — send a message.</p>
      )}
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onSelectThread(thread.id)}
          className={`cursor-pointer rounded-md border px-2 py-1.5 text-sm ${
            thread.id === activeThreadId
              ? "border-[var(--accent)] bg-slate-100 dark:bg-slate-800"
              : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900"
          }`}
        >
          <span className="block truncate">{thread.name ?? "New conversation"}</span>
          <div className="mt-1 flex gap-3 text-xs text-slate-500">
            <button
              className="underline"
              onClick={(e) => {
                e.stopPropagation();
                renameThread(thread.id, "Renamed");
              }}
            >
              Rename
            </button>
            <button
              className="underline"
              onClick={(e) => {
                e.stopPropagation();
                archiveThread(thread.id);
              }}
            >
              Archive
            </button>
          </div>
        </div>
      ))}
      {/* Step 4 — Load more */}
      {hasMoreThreads && (
        <button
          className="mt-2 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
          onClick={fetchMoreThreads}
          disabled={isFetchingMoreThreads}
        >
          {isFetchingMoreThreads ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
// #endregion

// #region app
// Step 3 — Switch between threads
import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

function App() {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  return (
    <div className="flex h-full">
      <ThreadSidebar
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
      />
      <div className="min-w-0 flex-1">
        <CopilotChat threadId={activeThreadId} />
      </div>
    </div>
  );
}
// #endregion

export default function Page() {
  return (
    <DemoFrame
      parentPath="/headless-threads"
      subtitle="useThreads + CopilotChat threadId"
    >
      {/* Step 1 — Runtime with CopilotKit Intelligence */}
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
