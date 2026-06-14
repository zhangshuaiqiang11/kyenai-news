#!/usr/bin/env node
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.argv[2] || "example-repository");
const required = [
  "AGENTS.md",
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/project-guidance.mdc",
];

let failed = false;
for (const path of required) {
  const pathname = resolve(root, path);
  try {
    if (!statSync(pathname).isFile() || readFileSync(pathname, "utf8").trim() === "") {
      throw new Error("missing content");
    }
    console.log(`ok ${path}`);
  } catch {
    failed = true;
    console.error(`missing or empty: ${path}`);
  }
}

if (failed) {
  process.exitCode = 1;
}
