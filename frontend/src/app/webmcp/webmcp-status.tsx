"use client";

import { useSyncExternalStore } from "react";

import { getCalls, getServerCalls, subscribeToCalls } from "./search-orders";

// `document.modelContext` does not change while the page is open, so nothing
// to subscribe to; `null` on the server, where `document` does not exist.
const noSubscription = () => () => {};
const readModelContext = () =>
  (document as { modelContext?: unknown }).modelContext != null;
const readModelContextOnServer = () => null;

/**
 * Test the complete path, Step 3 — "Confirm that `document.modelContext`
 * exists" — plus every `searchOrders` handler call, whichever agent made it.
 */
export function WebMCPStatus() {
  const available = useSyncExternalStore(
    noSubscription,
    readModelContext,
    readModelContextOnServer,
  );

  const calls = useSyncExternalStore(subscribeToCalls, getCalls, getServerCalls);

  return (
    <div className="space-y-3 text-sm">
      <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
        <p className="font-medium">document.modelContext</p>
        <p
          className={
            available
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-amber-700 dark:text-amber-400"
          }
        >
          {available === null
            ? "Checking…"
            : available
              ? "Available — searchOrders is published to browser agents."
              : "Not available — WebMCP registration is skipped. Enable chrome://flags/#enable-webmcp-testing (Chrome 149+) and reload."}
        </p>
      </div>

      <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
        <p className="font-medium">searchOrders calls</p>
        {calls.length === 0 ? (
          <p className="text-slate-500">None yet.</p>
        ) : (
          <ul className="mt-1 space-y-1 font-mono text-xs">
            {calls.map((call, index) => (
              <li key={`${call.at}-${index}`}>
                {call.at} · status: {call.status} → {call.count} order
                {call.count === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
