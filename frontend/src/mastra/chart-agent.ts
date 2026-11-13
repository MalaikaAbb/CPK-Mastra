// Components as Tools — docs.copilotkit.ai/mastra/generative-ui/tool-based
// (page file title: src/mastra/agents/chart-agent.ts), verbatim.
//
// The page prints this file as two blocks, the agent first and SYSTEM_PROMPT
// second. A `const` read before its declaration throws at module load, so the
// prompt block is placed first here; neither block's text is changed.
// #region chart-agent
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

const SYSTEM_PROMPT = `You are a data visualization assistant.

When the user asks for a chart, call the frontend \`render_bar_chart\` tool
with a concise title and a \`data\` array of \`{label, value}\` items.

Keep chat responses brief and let the chart do the talking.`;

// `render_bar_chart` is intentionally NOT declared here. It is a
// frontend-only tool registered via `useComponent`, and the adapter
// forwards it as a client tool on every run.
export const chartAgent = new Agent({
  id: "chart-agent",
  name: "Chart Agent",
  model: openai("gpt-6-luna"),
  instructions: SYSTEM_PROMPT,
});
// #endregion
