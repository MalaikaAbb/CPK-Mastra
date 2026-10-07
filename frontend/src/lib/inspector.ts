/**
 * Who owns the Inspector, decided in exactly one place.
 *
 * Harness scaffolding (not from any doc page). Two facts about
 * `CopilotKitInspector` drive it:
 *
 *  1. **It is bound to one core.** Each provider renders its own inspector
 *     against *its* instance. One on the root provider cannot see a nested
 *     provider's traffic, so it shows an empty event list and looks broken.
 *  2. **Two on one page is fatal.** Both are lit custom elements; mounting two
 *     spins lit-html into an unbounded assert loop that Next mirrors to the dev
 *     server. That can take out the tab, the server, and potentially the
 *     machine.
 *
 * So there must be exactly one inspector per page, and it must belong to the
 * provider the page's chat actually runs on. The demo routes below mount their
 * own `<CopilotKit>` (their published code configures a2ui / openGenerativeUI
 * per provider, against a dedicated runtime route), so on those routes the root
 * provider stands down and the nested one takes over.
 */

/** Kill switch — `NEXT_PUBLIC_COPILOTKIT_INSPECTOR=off` disables it everywhere. */
export const INSPECTOR_ENABLED =
  process.env.NEXT_PUBLIC_COPILOTKIT_INSPECTOR !== "off";

/**
 * Routes whose page mounts its own `<CopilotKit>`.
 *
 * Add to this list if you add another nested provider, or its inspector will
 * be the second one on the page.
 */
export const NESTED_PROVIDER_ROUTES = [
  "/generative-ui/a2ui/dynamic-schema/demo-chat",
  "/generative-ui/a2ui/fixed-schema/demo-chat",
  "/generative-ui/open-generative-ui/demo-chat",
  "/generative-ui/open-generative-ui/advanced/demo-chat",
  "/multi-agent/subagents/demo-chat",
] as const;

/**
 * What the app-wide provider should pass as `enableInspector`.
 *
 * It must be `enableInspector`: in @copilotkit/react-core 1.77 `showDevConsole`
 * is deprecated and no longer controls the Inspector at all, so passing it
 * leaves the root Inspector on everywhere.
 *
 * `undefined` keeps the package default (on in dev on localhost, off
 * otherwise); `false` means "a nested provider owns the inspector on this
 * route".
 */
export function rootInspectorSetting(pathname: string | null): boolean | undefined {
  if (!INSPECTOR_ENABLED) return false;
  if (pathname && (NESTED_PROVIDER_ROUTES as readonly string[]).includes(pathname)) {
    return false;
  }
  return undefined;
}

/**
 * What a nested `<CopilotKit>` should pass as `enableInspector`.
 *
 * `undefined` leaves the package's own default in place, which is the same
 * localhost-only rule the root provider uses. `false` honours the kill switch.
 */
export const nestedInspectorSetting: boolean | undefined = INSPECTOR_ENABLED
  ? undefined
  : false;
