import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/a2ui/fixed-schema";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Callout tone="warn" title="Harness-written: the runtime route">
        <p>
          The demo page&apos;s <code>/api/copilotkit-a2ui-fixed-schema</code>{" "}
          route is not published. It is supplied here with exactly the
          page&apos;s <code>injectA2UITool: false</code> runtime snippet.
        </p>
        <p className="mt-2">
          The <code>./a2ui-context</code> helpers{" "}
          (<code>readForwardedA2uiContext</code>, <code>systemPromptFrom</code>)
          that <code>generateA2uiTool</code> imports are now printed on the page
          and copied verbatim; the earlier repo-authored version is gone.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The catalog is fixed: Title, Airport, Arrow, AirlineBadge and
          PriceTag, plus the basic Card, Column, Row and Button. The agent owns
          its own A2UI tool, so the runtime is told not to inject one. On
          Mastra the tool still makes a second, forced model call to assemble
          the operations container (<code>createSurface</code> →{" "}
          <code>updateComponents</code> → <code>updateDataModel</code>) that the
          middleware paints.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Find me a flight from SFO to JFK on United for $289."]}
            expect="A flight card in chat: SFO → JFK, a United badge, $289, and a button that flips to “Booked” when clicked."
            fail="No card, or React error #31 (“object with keys {path}”), meaning a bound prop reached the renderer unresolved."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Catalog id mismatch in the published code">
        The frontend catalog registers as{" "}
        <code>copilotkit://flight-fixed-catalog</code>, but the tool&apos;s
        fallback when the inner model omits <code>catalogId</code> is{" "}
        <code>copilotkit://app-dashboard-catalog</code>. Both are kept as
        published. A surface pinned to the fallback id will not match this
        catalog.
      </Callout>

      <Panel title="Provider + catalog (published)">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/demo-chat/page.tsx` },
            { file: `${DIR}/a2ui/catalog.ts` },
            { file: `${DIR}/a2ui/definitions.ts` },
            { file: `${DIR}/a2ui/renderers.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The tool (published) and its helpers (harness-written)">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/mastra/a2ui/a2ui-generate.ts" },
            { file: "frontend/src/mastra/a2ui/a2ui-context.ts" },
          ]}
        />
      </Panel>

      <Panel title="Agent and runtime">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/mastra/agents.ts", region: "a2ui-agents" },
            { file: "frontend/src/app/api/copilotkit-a2ui-fixed-schema/route.ts" },
          ]}
        />
      </Panel>
    </>
  );
}
