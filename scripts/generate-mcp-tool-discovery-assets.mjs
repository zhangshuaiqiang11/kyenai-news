import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  renderMcpDiscoveryCompatibilityCsv,
  renderMcpDiscoveryCompatibilityJson,
} from "../frontend/lib/mcp-tool-discovery.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resources = path.join(root, "frontend", "public", "resources");
fs.mkdirSync(resources, { recursive: true });
fs.writeFileSync(path.join(resources, "mcp-tool-discovery-compatibility.json"), renderMcpDiscoveryCompatibilityJson());
fs.writeFileSync(path.join(resources, "mcp-tool-discovery-compatibility.csv"), renderMcpDiscoveryCompatibilityCsv());
console.log("Generated MCP multi-client compatibility JSON and CSV.");
