/**
 * `searchOrders(status)` — called by both samples on
 * docs.copilotkit.ai/mastra/webmcp but never defined there. Sample orders stand
 * in for the signed-in user's real ones.
 *
 * Every call is also recorded, so the demo pages can show that a CopilotKit
 * agent call and a browser-agent (WebMCP) call run this same handler.
 */

export type OrderStatus = "open" | "shipped" | "delivered";

export interface Order {
  id: string;
  item: string;
  status: OrderStatus;
  total: string;
}

const ORDERS: Order[] = [
  { id: "ORD-1001", item: "Mechanical keyboard", status: "open", total: "$129.00" },
  { id: "ORD-1002", item: "USB-C hub", status: "open", total: "$39.99" },
  { id: "ORD-1003", item: "27\" monitor", status: "shipped", total: "$329.00" },
  { id: "ORD-1004", item: "Desk lamp", status: "delivered", total: "$24.50" },
  { id: "ORD-1005", item: "Noise-cancelling headphones", status: "delivered", total: "$199.00" },
];

export async function searchOrders(status: OrderStatus): Promise<Order[]> {
  const orders = ORDERS.filter((order) => order.status === status);
  record({ at: new Date().toLocaleTimeString(), status, count: orders.length });
  return orders;
}

// Call log, read by the demo pages with useSyncExternalStore.

export interface OrderSearchCall {
  at: string;
  status: OrderStatus;
  count: number;
}

let calls: OrderSearchCall[] = [];
const listeners = new Set<() => void>();

function record(call: OrderSearchCall) {
  calls = [call, ...calls].slice(0, 20);
  listeners.forEach((listener) => listener());
}

export function subscribeToCalls(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCalls() {
  return calls;
}

const NO_CALLS: OrderSearchCall[] = [];

export function getServerCalls() {
  return NO_CALLS;
}
