import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildLlmsTxt } from "../lib/llms";

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(frontendRoot, "public/llms.txt");

writeFileSync(outputPath, buildLlmsTxt(), "utf8");
console.log(`Generated ${outputPath}`);
