"use client";

import {
  CopilotChat,
  messageGroup,
  messageRow,
  type Message,
  type MessageGroupWrapperProps,
  type MessageRow,
} from "@copilotkit/react-core/v2";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

type Level = "classes" | "props" | "component" | "transform" | "group";

const LEVELS: { id: Level; label: string; blurb: string }[] = [
  {
    id: "classes",
    label: "1 · Tailwind classes",
    blurb:
      "A class string merges with the slot's own classes. Nothing is replaced.",
  },
  {
    id: "props",
    label: "2 · Props override",
    blurb:
      "An object sets props on the default component — className, autoFocus.",
  },
  {
    id: "component",
    label: "3 · Custom component",
    blurb: "Your own component replaces a slot, plus a custom layout.",
  },
  {
    id: "transform",
    label: "4 · Reshape messages",
    blurb:
      "A transform function can hide, reorder, or replace messages before they render.",
  },
  {
    id: "group",
    label: "5 · Group messages",
    blurb:
      "To render several messages together, pass groupMessages to the message view.",
  },
];

const CustomMessageView = ({ messages, isRunning }) => (
  <div className="space-y-4 p-6">
    {messages?.map((msg) => (
      <div
        key={msg.id}
        className={msg.role === "user" ? "text-right" : "text-left"}
      >
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

// Define wrappers at module level. One created inside groupMessages is a new
// component on every call, so React would remount it each time.
function ToolActivity({
  messages,
  children,
  state,
  setState,
}: MessageGroupWrapperProps<boolean>) {
  const open = state ?? false;
  return (
    <div className="rounded-lg border">
      <button onClick={() => setState(!open)}>
        {messages.length} tool steps {open ? "▾" : "▸"}
      </button>
      {open && children}
    </div>
  );
}

// An assistant message that also carries text stays on its own row, so the
// text (or a card waiting on the user) is never folded into a closed group.
const isToolStep = (m: Message) =>
  m.role === "tool" ||
  (m.role === "assistant" && !!m.toolCalls?.length && !m.content);

export function Chat() {
  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return <CopilotChat messageView={{ groupMessages }} />;
}

export default function Page() {
  const [level, setLevel] = useState<Level>("classes");
  const active = LEVELS.find((l) => l.id === level)!;

  const transformMessages = useCallback(
    (messages: Message[]) =>
      messages.filter((message) => message.role !== "tool"),
    [],
  );

  const groupMessages = useCallback((messages: Message[]): MessageRow[] => {
    const rows: MessageRow[] = [];
    let run: Message[] = [];
    const flush = () => {
      if (run.length > 0) {
        rows.push(
          messageGroup({ key: run[0].id, messages: run, wrapper: ToolActivity }),
        );
      }
      run = [];
    };
    for (const message of messages) {
      if (isToolStep(message)) run.push(message);
      else {
        flush();
        rows.push(messageRow(message));
      }
    }
    flush();
    return rows;
  }, []);

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle={active.blurb}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                level === l.id
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1">
          {level === "classes" && (
            <CopilotChat
              agentId="myAgent"
              key="classes"
              messageView={{
                assistantMessage: "bg-blue-50 rounded-xl p-2",
                userMessage: "bg-blue-100 rounded-xl",
              }}
              input="border-2 border-[var(--accent)] rounded-xl text-purple-800"
              labels={{
                welcomeMessageText:
                  "Slot level 1 — classes merged into messageView and input.",
              }}
            />
          )}

          {level === "props" && (
            <CopilotChat
              agentId="myAgent"
              key="props"
              messageView={{
                className: "rounded-lg bg-slate-50 dark:bg-slate-300 p-4",
              }}
              input={{ autoFocus: true }}
              labels={{
                welcomeMessageText:
                  "Slot level 2 — the input is focused automatically via a prop override.",
              }}
            />
          )}

          {level === "component" && (
            <CopilotChat
              agentId="myAgent"
              key="component"
              messageView={CustomMessageView}
              labels={{
                welcomeMessageText:
                  "Slot level 3 — the streaming cursor and the whole layout are ours.",
              }}
            />
          )}

          {level === "transform" && (
            <CopilotChat
              agentId="myAgent"
              key="transform"
              messageView={{ transformMessages }}
              labels={{
                welcomeMessageText:
                  "Slot level 4 — tool messages are hidden before the list is rendered.",
              }}
            />
          )}

          {level === "group" && (
            <CopilotChat
              agentId="myAgent"
              key="group"
              messageView={{ groupMessages }}
              labels={{
                welcomeMessageText:
                  "Slot level 5 — runs of tool messages are grouped into collapsible rows.",
              }}
            />
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
