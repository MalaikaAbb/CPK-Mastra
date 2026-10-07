/**
 * REPO-AUTHORED — not published on any doc page.
 *
 * `a2ui-generate.ts` (published on /mastra/generative-ui/a2ui/fixed-schema)
 * imports `readForwardedA2uiContext` and `systemPromptFrom` from `./a2ui-context`,
 * but neither the page nor its demo Code tab ships that module. These two
 * functions were written for this harness so the published tool can run.
 *
 * They are grounded in two published facts rather than invented behaviour:
 *
 *  - `@ag-ui/mastra` stores the run's `RunAgentInput.context` on Mastra's request
 *    context as `requestContext.set("ag-ui", { context })` (see
 *    `applyInputContext` in the bridge). That is where the provider's catalog
 *    schema and generation guidelines arrive.
 *  - The published `foldHostContext` (open-gen-ui agents, agents/index.ts) reads
 *    that same key and formats each entry as `### <description>\n<value>`. The
 *    prompt builder below uses the identical format.
 */

type ContextEntry = Record<string, unknown>;

type ExecutionContextLike = {
  requestContext?: { get(key: string): unknown };
};

/** Context entries the bridge forwarded for this run, or `[]`. */
export function readForwardedA2uiContext(
  executionContext: unknown,
): ContextEntry[] {
  const agui = (executionContext as ExecutionContextLike | undefined)
    ?.requestContext?.get("ag-ui") as { context?: ContextEntry[] } | undefined;
  return Array.isArray(agui?.context) ? agui.context : [];
}

/** Flatten context entries into the inner `render_a2ui` call's system prompt. */
export function systemPromptFrom(entries: ContextEntry[] | undefined): string {
  return (entries ?? [])
    .map((entry) => `### ${String(entry.description ?? "")}\n${String(entry.value ?? "")}`)
    .join("\n\n");
}
