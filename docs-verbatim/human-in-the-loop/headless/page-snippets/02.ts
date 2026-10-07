// src/app/demos/interrupt-headless/page.tsx
import React from "react";
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import { generateFallbackSlots } from "../_shared/interrupt-fallback-slots";
import type { TimeSlot } from "../_shared/interrupt-fallback-slots";

// Shape the backend `schedule_meeting` tool suspends with, wrapped by the
// @ag-ui/mastra bridge under `mastra_suspend`.
type SuspendPayload = {
  topic?: string;
  attendee?: string;
  slots?: TimeSlot[];
};

export default function InterruptHeadlessDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="interrupt-headless">
      <Layout />
    </CopilotKit>
  );
}

function Layout() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Book a call with sales",
        message: "Book an intro call with the sales team to discuss pricing.",
      },
      {
        title: "Schedule a 1:1 with Alice",
        message: "Schedule a 1:1 with Alice next week to review Q2 goals.",
      },
    ],
    available: "always",
  });

  // Headless: the hook RETURNS the interrupt element (or null) instead of
  // publishing it into the chat, so we can place it in the app surface.
  const interruptEl = useInterrupt({
    agentId: "interrupt-headless",
    renderInChat: false,
    render: ({ event, resolve }) => {
      // Mastra wraps the suspend value as `{ type: "mastra_suspend",
      // suspendPayload, ... }`, JSON-stringified — parse then read
      // `suspendPayload` (not the raw wrapper).
      const raw = event.value ?? {};
      const parsed = (typeof raw === "string" ? JSON.parse(raw) : raw) as {
        suspendPayload?: SuspendPayload;
      } & SuspendPayload;
      const payload: SuspendPayload = parsed.suspendPayload ?? parsed;
      return (
        <TimeSlotPopup
          payload={payload}
          onPick={(slot) =>
            setTimeout(
              () =>
                resolve({ chosen_time: slot.iso, chosen_label: slot.label }),
              500,
            )
          }
          onCancel={() => setTimeout(() => resolve({ cancelled: true }), 500)}
        />
      );
    },
  });

  return (
    <div className="grid h-screen grid-cols-[1fr_420px] bg-[#FAFAFC]">
      <AppSurface interruptEl={interruptEl} />
      <div className="border-l border-[#DBDBE5] bg-white">
        <CopilotChat agentId="interrupt-headless" className="h-full" />
      </div>
    </div>
  );
}
