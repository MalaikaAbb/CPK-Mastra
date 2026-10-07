import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

import {
  a2uiFixedSchemaAgent,
  backgroundAgentsAgent,
  colleaguesContactAgent,
  declarativeGenUiAgent,
  languageAgent,
  myAgent,
  openGenUiAdvancedAgent,
  openGenUiAgent,
  searchAgent,
  streamingAgent,
  subagentsSupervisorAgent,
  weatherAgent,
} from "./agents";

/**
 * The Mastra instance the Copilot Runtime binds with `getLocalAgents`.
 *
 * Note there is no separate agent server in this repo. Mastra is a TypeScript
 * framework and the Quickstart's bring-your-own path imports the instance
 * directly into the Next.js route, so agents run in the same process as the app.
 *
 * `storage` and `backgroundTasks` come from the Background Tasks page — the
 * background worker needs somewhere to persist queued work, so both are
 * required for that route and harmless for every other one.
 */
export const mastra = new Mastra({
  agents: {
    myAgent,
    weatherAgent,
    languageAgent,
    streamingAgent,
    searchAgent,
    colleaguesContactAgent,
    backgroundAgentsAgent,
    // Registered under the agent id the Sub-Agents page uses
    // (`useAgent({ agentId: "subagents" })`), so the published page resolves
    // it on the main runtime route without renaming anything.
    subagents: subagentsSupervisorAgent,
    // Served by dedicated runtime routes (api/copilotkit-ogui,
    // api/copilotkit-declarative-gen-ui, api/copilotkit-a2ui-fixed-schema),
    // which look these up by key with `getLocalAgent`.
    openGenUiAgent,
    openGenUiAdvancedAgent,
    declarativeGenUiAgent,
    a2uiFixedSchemaAgent,
  },
  storage: new LibSQLStore({ id: "mastra-storage", url: ":memory:" }),
  backgroundTasks: { enabled: true },
});
