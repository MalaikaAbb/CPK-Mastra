import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";

props: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),
