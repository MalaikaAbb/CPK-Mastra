import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

const catalog = exportA2UICatalog(appUI, { title: "Acme app" });
fs.writeFileSync("acme-catalog.json", JSON.stringify(catalog, null, 2));
