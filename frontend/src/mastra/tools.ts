import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { buildA2uiOperations } from "./a2ui/a2ui-generate";
/**
 * Every tool the agents in this harness expose.
 *
 * All three come from documentation pages — nothing here was invented for this
 * repo. Each is marked with the page it belongs to.
 */

// #region weather-info
// Tool Rendering — docs.copilotkit.ai/mastra/generative-ui/tool-rendering
export const weatherInfo = createTool({
  id: "weatherInfo",
  inputSchema: z.object({
    location: z.string(),
  }),
  description: `Fetches the current weather information for a given location`,
  execute: async ({ location }) => {
    // Tool logic here (e.g., API call)
    console.log("Using tool to fetch weather information for", location);
    return { temperature: 20, conditions: "Sunny" };
  },
});
// #endregion


// Fixed-schema A2UI flight search for the Beautiful Chat cell. Mirrors
// langgraph-python `beautiful_chat.py::search_flights`: the tool RESULT is a
// complete `a2ui_operations` envelope (a flat Row of literal FlightCards on the
// `app-dashboard-catalog`), so the A2UI middleware paints the cards directly —
// no dynamic `generate_a2ui` round-trip. Distinct from the shared
// `searchFlightsTool` (plain `{ flights }`) that the tool-rendering cells render
// via their own frontend `FlightListCard`.
const FLIGHT_SURFACE_ID = "flight-search-results";
const FLIGHT_CATALOG_ID = "copilotkit://flight-fixed-catalog";
// Each flight is composed from the frontend catalog's primitives
// (my-copilot-app/app/definitions.ts): the catalog `Card` only takes a single
// `child` id, so the flight fields have to live on the nested components:
//   Card > Column > [Title, Row(Airport, Arrow, Airport), Text(times),
//                    Row(AirlineBadge, PriceTag), Button > Text]
// Values are inlined literals, so no data model / path bindings are needed.
function buildFlightCardComponents(
  flights: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  const cardIds: string[] = [];
  const components = flights.flatMap((flight, index) => {
    const id = `flight-card-${index}`;
    cardIds.push(id);
    const str = (key: string) =>
      typeof flight[key] === "string" ? (flight[key] as string) : "";
    const part = (name: string) => `${id}-${name}`;
    const status = str("status");
    return [
      { id, component: "Card", child: part("body") },
      {
        id: part("body"),
        component: "Column",
        children: [
          part("title"),
          part("route"),
          part("times"),
          part("footer"),
          part("book"),
        ],
      },
      {
        id: part("title"),
        component: "Title",
        text: `${str("flightNumber")} · ${str("date")}`,
      },
      {
        id: part("route"),
        component: "Row",
        align: "center",
        children: [part("origin"), part("arrow"), part("destination")],
      },
      { id: part("origin"), component: "Airport", code: str("origin") },
      { id: part("arrow"), component: "Arrow" },
      {
        id: part("destination"),
        component: "Airport",
        code: str("destination"),
      },
      {
        id: part("times"),
        component: "Text",
        variant: "caption",
        text: [
          `${str("departureTime")} → ${str("arrivalTime")}`,
          str("duration"),
          status,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      {
        id: part("footer"),
        component: "Row",
        justify: "spaceBetween",
        align: "center",
        children: [part("airline"), part("price")],
      },
      { id: part("airline"), component: "AirlineBadge", name: str("airline") },
      { id: part("price"), component: "PriceTag", amount: str("price") },
      {
        id: part("book"),
        component: "Button",
        child: part("book-label"),
        action: {
          event: {
            name: "book_flight",
            context: {
              flightNumber: str("flightNumber"),
              airline: str("airline"),
              date: str("date"),
              price: str("price"),
            },
          },
        },
      },
      { id: part("book-label"), component: "Text", text: "Book flight" },
    ];
  });
  return [
    // No `gap`: the basic catalog's Row is `.strict()` and only accepts
    // children / justify / align / accessibility / weight. The showcase line
    // this came from targets a different catalog.
    { id: "root", component: "Row", children: cardIds },
    ...components,
  ];
}
export const searchFlightsA2uiTool = createTool({
  id: "search-flights-a2ui",
  description:
    "Search for flights and display the results as rich A2UI cards. Return " +
    'exactly one flight.flight must have: airline (e.g. "United ' +
    'Airlines"), airlineLogo (Google favicon API, e.g. ' +
    '"https://www.google.com/s2/favicons?domain=united.com&sz=128"), ' +
    "flightNumber, origin, destination, date (short readable, near-future, " +
    'e.g. "Tue, Mar 18"), departureTime, arrivalTime, duration (e.g. ' +
    '"5h 30m"), status (e.g. "On Time"), and price (e.g. "$289").',
  inputSchema: z.object({
    flights: z
      .array(z.record(z.unknown()))
      .describe("The flights to display as A2UI flight cards."),
  }),
  // Return the OBJECT (not a JSON string): the @ag-ui/mastra bridge encodes the
  // tool result once for the wire, so a single-encoded `a2ui_operations`
  // container is what the A2UI middleware detects and paints.
  execute: async ({ flights }) =>
    buildA2uiOperations({
      surfaceId: FLIGHT_SURFACE_ID,
      catalogId: FLIGHT_CATALOG_ID,
      components: buildFlightCardComponents(flights),
    }),
});

// #region add-search
// State Rendering — docs.copilotkit.ai/mastra/generative-ui/state-rendering
export const addSearch = createTool({
  id: "addSearch",
  inputSchema: z.object({
    query: z.string(),
  }),
  description: "Add a search to the agent's list of searches",
  execute: async ({ query }) => {
    // Tool implementation - working memory is automatically updated
    return { success: true, query };
  },
});
// #endregion

// #region deep-research
// Background Tasks — docs.copilotkit.ai/mastra/background-tasks
//
// The doc elides this tool's body (`execute: async ({ topic }) => { /* ... */ }`),
// so everything inside it is this repo's. It is written to make the background
// lifecycle observable rather than to do real research: a body that returns
// immediately produces a card that is already `completed` on its first paint,
// which tests nothing.
//
// `writer` is the tool-execution context's `ToolStream`. Each `write` becomes a
// Mastra `task.output` event → a `background-task-output` chunk → an
// ACTIVITY_DELTA appending to the activity message's `outputs` array, which is
// what the card renders as progress. Reaching the frontend at all depends on
// `untilIdle` plus the agent having its own `memory` — see the note on
// `backgroundAgentsAgent` and docs/background-tasks-stuck-on-working.md.
//
// Total runtime is kept near 7s because the *model* picks the timeout: Mastra
// injects a `_background` override field into every background-eligible tool's
// schema, and `resolveBackgroundConfig` ranks the LLM's value above the tool's
// and above the manager default of 300_000ms. gpt-4o has sent both
// `timeoutMs: 300000` and `timeoutMs: 10000` unprompted on this same tool, so
// the work has to fit inside the smaller of those or it ends `failed`.
const STAGES = [
  "Gathering sources",
  "Reading primary material",
  "Cross-checking dates and figures",
  "Writing the summary",
];

const STAGE_MS = 1800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runDeepResearchTool = createTool({
  id: "run_deep_research",
  description:
    "Kick off a long-running deep-research task on a topic. This runs in " +
    "the background while the conversation continues.",
  inputSchema: z.object({
    topic: z.string().describe("The topic to research in depth."),
  }),
  background: { enabled: true },
  execute: async ({ topic }, { writer }) => {
    // Runs when the background worker executes the task. Each stage is
    // announced *before* its delay, so the card shows a stage immediately
    // rather than sitting blank for the first interval.
    for (const [index, stage] of STAGES.entries()) {
      await writer?.write({
        stage,
        step: index + 1,
        totalSteps: STAGES.length,
      });
      await wait(STAGE_MS);
    }

    return JSON.stringify({
      topic,
      summary: `Deep research on "${topic}" completed.`,
    });
  },
});
// #endregion
