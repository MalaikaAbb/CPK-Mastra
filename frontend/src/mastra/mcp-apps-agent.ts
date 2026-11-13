// MCP Apps — docs.copilotkit.ai/mastra/generative-ui/mcp-apps
//
// FRAMEWORK SWAP: the page builds a CopilotKit `BuiltInAgent`
// (`model: "openai/gpt-6-luna"`, `prompt: "You are a helpful assistant."`).
// This harness runs Mastra agents, so the same model and prompt are carried
// by a Mastra `Agent`, with no tools (the snippet defines none; MCP tools are
// added per run by the runtime's `mcpApps` middleware).
// #region mcp-apps-agent
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const mcpAppsAgent = new Agent({
  id: "mcp-apps-agent",
  name: "MCP Apps Agent",
  model: openai("gpt-6-luna"),
  instructions: "You are a helpful assistant.",
});
// #endregion
