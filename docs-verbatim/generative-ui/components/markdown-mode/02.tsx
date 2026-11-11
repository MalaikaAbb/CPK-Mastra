import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

<CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI, transport: "markdown" }}>
  {children}
</CopilotKitProvider>;
