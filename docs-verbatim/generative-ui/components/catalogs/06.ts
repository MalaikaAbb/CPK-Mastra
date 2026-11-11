import { createGenerativeUI, standardUI } from "@copilotkit/react-core/v2/generative-ui";

export const appUI = createGenerativeUI({
  id: "acme/app@1",
  extends: [standardUI, cartUI],
  components: { Hero: { component: Hero, props: z.object({ title: z.string() }) } },
});
