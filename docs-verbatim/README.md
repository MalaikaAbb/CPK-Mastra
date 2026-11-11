# docs-verbatim — published code that cannot run here

Byte-exact copies of code published on docs.copilotkit.ai/mastra that this
harness **shows but does not compile or import**. Everything here is outside
`frontend/`, so the TypeScript build never sees it; the routes render it with
`SourceCode`.

These are kept because the code is incomplete. It references modules the page
and its demo Code tab never publish, so running it would mean writing the
missing half by hand, and these routes were chosen to stay reference-only
instead.

Sources: each page's fenced code blocks (`page-snippets/NN.*`, in page order),
and the per-framework demo **Code** tab bundle (`demo-code-tab/*`), extracted
from the docs site's demo registry (`mastra::<demo>` entries).

## human-in-the-loop/useInterrupt — `/mastra/human-in-the-loop/useInterrupt`

Referenced, never published:

| Symbol | Imported from | Used by |
| --- | --- | --- |
| `scheduleMeetingInterruptTool` | `@/mastra/tools` → `./interrupt` | `interruptAgent` — this is the tool that actually calls `suspend()`; the whole pause/resume path depends on it |
| `generateFallbackSlots` | `../_shared/interrupt-fallback-slots` | demo `page.tsx` |
| `openai` (header-forwarding wrapper) | `@/mastra/_header_forwarding` | `interruptAgent` |
| `useGenUiInterruptSuggestions` | `./suggestions` | demo `page.tsx` (it is in the bundle, but not on a visible tab) |
| `AskCard`, `ApproveCard`, `RequestAccessCard`, `lookupUserDepartment` | — | page snippets 03 and 04 (`enabled` and `handler` examples) |

## human-in-the-loop/headless — `/mastra/human-in-the-loop/headless`

Same backend as useInterrupt (`interruptAgent` + the unpublished
`scheduleMeetingInterruptTool`). In addition:

| Symbol | Imported from | Used by |
| --- | --- | --- |
| `generateFallbackSlots`, `TimeSlot` | `../_shared/interrupt-fallback-slots` | demo `page.tsx` |
| `useHeadlessInterrupt` | "defined above", but it is not defined anywhere on the page | page snippet 04 |
| `SLOTS` | — | page snippets 03 and 04 |

## human-in-the-loop/governed-actions — `/mastra/human-in-the-loop/governed-actions`

The `useHumanInTheLoop` variant **does** run, at
`frontend/src/app/human-in-the-loop/governed-actions/`. Kept here:

- `governed-action-approval.tsx` is the useInterrupt variant. It reads
  `interrupt?.metadata?.action`, the standard AG-UI interrupt channel. No
  backend that suspends with an action envelope is published, and
  `@ag-ui/mastra` puts its suspend payload under
  `metadata.mastra.suspendPayload` rather than `metadata.action`.
- `handle-approval.ts` is the resume-side check. It calls `executeSideEffect`,
  which is never defined.

## generative-ui/json-render — `/mastra/generative-ui/json-render`

Page snippets only (the page has no demo Code tab): `01` chat.tsx, `02`
json-render-renderer.tsx, `03` catalog.ts, `04` registry.tsx, `05` example
agent output. Referenced, never published:

| Symbol | Imported from | Used by |
| --- | --- | --- |
| the Mastra agent + its "answer in plain JSON" prompt (agent id `byoc_json_render`) | — | the whole flow; nothing emits a spec without it |
| runtime route, `page.tsx` (`<CopilotKit>`) | — | the demo |
| `JsonRenderSpec` | `./types` | 02 |
| `MetricCard`, `MetricCardComponentProps` | `./metric-card` | 04 |
| `BarChart` / `PieChart` (+ `…ComponentProps`) | `./charts/bar-chart`, `./charts/pie-chart` | 04 |
| `useByocJsonRenderSuggestions` | `./suggestions` | 01 |

Packages the code needs and this repo does not install: `@json-render/react`,
`@json-render/core` (0.18.0 per the page) and a `zod4` alias for zod 4 (the
root pin is zod 3.25.76 for A2UI).
