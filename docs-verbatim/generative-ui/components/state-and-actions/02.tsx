import { useGenerativeUIState } from "@copilotkit/react-core/v2/generative-ui";

function CartState({ cart }: { cart: Cart }) {
  useGenerativeUIState(shopUI, "cart", { items: cart.items });
  return null;
}
