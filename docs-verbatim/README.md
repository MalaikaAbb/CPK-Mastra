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

## generative-ui/components — `/mastra/generative-ui/components`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.sh` Install, `02.sh` .env.local, `03.ts` Runtime + agent, `04.tsx` Provider, `05.tsx` Layout, `06.tsx` Page, `07.txt` Prompt to try.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| TanStack `BuiltInAgent` + `convertInputToTanStackAI` (03) | `@copilotkit/runtime/v2`, `@tanstack/ai*` | would be swapped for a Mastra agent with the snippet's prompt (framework-own rule) |
| `@tanstack/ai`, `@tanstack/ai-openai` | install line (01) | not installed; not needed once swapped |

## generative-ui/components/surfaces — `/mastra/generative-ui/components/surfaces`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` Page target, `02.tsx` Limit the components, `03.tsx` Scroll, `04.css` Scroll margin, `05.tsx` One target per item, `06.tsx` Error boundary.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `Product`, `ProductRow`, `product` | — | 01, 05 |
| `shopUI` | `./catalog` (Catalogs page) | 01, 02, 06 |

## generative-ui/components/catalogs — `/mastra/generative-ui/components/catalogs`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` app/catalog.tsx, `02.tsx` Provider, `03.tsx` Typed props, `04.ts` zod, `05.ts` Valibot, `06.ts` Combine catalogs, `07.ts` Export for A2UI tools, `08.tsx` Positional parameter order.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `cartUI`, `Hero` | — | 06 |
| `Panel` | — | 08 |
| `fs` (Node) | — | 07 |
| `valibot`, `@valibot/to-json-schema` | packages | 05 |

## generative-ui/components/standard-catalog — `/mastra/generative-ui/components/standard-catalog`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` Provider, `02.ts` Add your own components, `03.ts` Drop components, `04.tsx` Replace a component.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `ProductCard`, `productSchema` | — | 02 |

## generative-ui/components/state-and-actions — `/mastra/generative-ui/components/state-and-actions`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` State + bind, `02.tsx` useGenerativeUIState, `03.tsx` Functions + events, `04.tsx` useGenerativeUIFunction, `05.tsx` Event result in a component, `06.ts` Who may call a function, `07.ts` Events to the agent, `08.tsx` Writable prop, `09.tsx` Keep what the user types.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `Cart` type, `cart.addItem` | — | 02, 04 |
| `ProductCard` / `CheckoutForm` wiring into one `shopUI` | — | 01, 03, 05, 08, 09 (fragments) |

## generative-ui/components/theming — `/mastra/generative-ui/components/theming`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` Provider theme, `02.ts` GenerativeUITheme, `03.html` Dark class, `04.tsx` Color-scheme script, `05.tsx` Theme per mode, `06.tsx` Theme map, `07.css` CSS variables.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| — | — | fragments only |

## generative-ui/components/transports — `/mastra/generative-ui/components/transports`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` Tool transport, `02.ts` Runtime, `03.tsx` Markdown transport, `04.tsx` Only some agents.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `agent` | — | 02 |

## generative-ui/components/markdown-mode — `/mastra/generative-ui/components/markdown-mode`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.md` Example reply, `02.tsx` Turn it on, `03.tsx` sendContext: false, `04.json` Forwarded catalog, `05.py` Build your own prompt (Python).
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `MY_PROMPT`, Python `input` | — | 05 (Python, not Mastra) |

## generative-ui/components/from-a2ui — `/mastra/generative-ui/components/from-a2ui`

React-tab page snippets (Angular tabs skipped; no demo Code tab), in page order: `01.tsx` Provider, before, `02.tsx` Provider, after, `03.ts` Runtime, before, `04.ts` Runtime, after, `05.ts` Catalog, before, `06.ts` Catalog, after.
Need `@copilotkit/react-core` ≥ 1.81 (`/v2/generative-ui`); this repo is now on 1.87.1, and the runnable parts are mounted in the route's `demo-chat/` (main README, item 26). Referenced, never defined on the page:

| Symbol | From | Used by |
| --- | --- | --- |
| `myCatalog`, `agents` | — | 01–04 |
| `Airport`, `Arrow` | — | 05, 06 |
