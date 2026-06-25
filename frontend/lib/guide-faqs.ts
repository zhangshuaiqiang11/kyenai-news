import { buildGuideFaqs, type FaqItem } from "./seo";
import type { Guide } from "./types";

const guideFaqsBySlug: Record<string, FaqItem[]> = {
  "agents-md-vs-claude-md-cursorrules-copilot-instructions": [
    {
      question: "Which file should you use: CLAUDE.md, Copilot Instructions, or AGENTS.md?",
      answer:
        "Use AGENTS.md for Codex, CLAUDE.md for Claude Code, .github/copilot-instructions.md for broad GitHub Copilot repository guidance, and .cursor/rules/*.mdc for Cursor project rules. GitHub Copilot support for CLAUDE.md is surface-specific, so Copilot instructions remain the safer baseline for repository-wide Copilot coverage.",
    },
    {
      question: "Does GitHub Copilot read CLAUDE.md?",
      answer:
        "Sometimes, but not on every Copilot surface. GitHub documents instruction-file support by surface, so CLAUDE.md should be treated as a surface-specific Copilot input rather than a universal Copilot baseline. Keep .github/copilot-instructions.md for broad Copilot coverage and CLAUDE.md for Claude Code.",
    },
    {
      question: "Can one repository use AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules together?",
      answer:
        "Yes. Keep one short shared policy for setup commands, verification, security boundaries, and review expectations, then maintain concise tool-specific adapters. Update all affected files in the same reviewed change so adapters do not drift.",
    },
  ],
  "loop-engineering-ai-coding-agents": [
    {
      question: "What is loop engineering for AI coding agents?",
      answer:
        "Loop engineering means designing the operating loop around the agent instead of writing one better prompt. For coding agents, the practical loop is Plan → Act → Observe → Verify → Stop: give the agent a bounded goal, inspect tests or diffs, retry only with a changed strategy, and stop on token caps, repeated failure, or a required human checkpoint.",
    },
    {
      question: "When should an AI coding agent stop the loop?",
      answer:
        "Stop when verification passes, when an iteration cap is reached, when the same failure repeats, when the next action needs wider permissions, when cost crosses the budget, or when the agent can no longer tie its next action to observed evidence. Document stop rules in AGENTS.md, CLAUDE.md, Copilot instructions, or the workflow file that launches the loop.",
    },
    {
      question: "What belongs on an AI coding agent workflow checklist?",
      answer:
        "Name the goal and done signal, pick plan-execute-verify as the default pattern, attach tests or linters as observation, cap iterations, add human checkpoints before production or destructive actions, budget tokens before unattended runs, and assign a loop owner who reviews logs without secrets.",
    },
  ],
  "agents-md-template-for-ai-coding-agents": [
    {
      question: "What should an AGENTS.md template include?",
      answer:
        "A useful AGENTS.md template gives Codex copyable repo instructions: project purpose, install command, test command, safe edit boundaries, forbidden files, and review expectations. Start with one root file, then add nested AGENTS.md files only for packages that need different commands, ownership, or safety boundaries.",
    },
    {
      question: "When should you add a nested AGENTS.md file?",
      answer:
        "Add a nested AGENTS.md only when a folder genuinely needs different guidance, such as package-specific test commands, generated-file boundaries, ownership rules, or risk limits. Keep the root file for shared repo policy and the nested file for local exceptions.",
    },
    {
      question: "Who is this AGENTS.md template for?",
      answer:
        "Developers setting up Codex-compatible agents, team leads standardizing repo instructions, and maintainers cleaning stale agent rules across Node.js, Python, and monorepo layouts.",
    },
  ],
  "codex-vs-claude-code": [
    {
      question: "How do you compare Codex vs Claude Code fairly?",
      answer:
        "Run four tasks in the same clean repository state: fix one failing test, add one small API endpoint, refactor one UI component without behavior change, and add or repair one test. Record elapsed time, changed files, verification pass or fail, human interventions, and whether each tool followed AGENTS.md or CLAUDE.md correctly.",
    },
    {
      question: "When should you choose Codex over Claude Code?",
      answer:
        "Choose Codex when planning, code review, and task handoff already happen around OpenAI tools and you want AGENTS.md-style repository instructions inside an OpenAI-native workflow. Choose Claude Code when the team works from terminal sessions with CLAUDE.md memory, hooks, MCP servers, and subagents.",
    },
    {
      question: "Can public benchmark posts decide the tool for your repository?",
      answer:
        "No. Public same-prompt examples can help choose evaluation dimensions, but your decision should come from measured repository tasks, review effort, reproducibility, safety behavior, and whether the final diff is easy for the team to own.",
    },
  ],
  "secure-mcp-servers-ai-coding-agents": [
    {
      question: "What are MCP tool permissions boundaries?",
      answer:
        "MCP tool boundaries should be defined at the tool level, not only at the server level: decide which tools are visible, which are callable, which are read-only, and which require explicit approval before write, delete, network, secret, or production access.",
    },
    {
      question: "What should you review before launching an MCP server for coding agents?",
      answer:
        "Review authentication, token audience, scopes, read/write separation, secret isolation, network allowlists, audit logs, human approval for high-impact actions, and a tested revocation path before the agent can reach the server unattended.",
    },
    {
      question: "Who should own MCP security review?",
      answer:
        "Engineering leaders, security reviewers, platform teams, and developer tooling owners who can inventory the server owner, methods, credentials, deployment environment, and rollback plan before rollout.",
    },
  ],
  "claude-code-hooks-mcp-setup": [
    {
      question: "When should you use Claude Code hooks instead of MCP?",
      answer:
        "Use hooks for deterministic lifecycle events such as formatting, validation, or notifications. Use MCP when Claude needs structured access to an external tool, database, browser, repository, or internal system. Do not use MCP when a hook can run the deterministic local command.",
    },
    {
      question: "Why are Claude Code hooks not working?",
      answer:
        "Common causes are stale credentials, missing local binaries, slow hooks, incorrect working directories, over-broad MCP permissions, and unclear failure behavior. Log hook name, trigger, command, exit code, duration, and whether the hook blocked the task before widening permissions.",
    },
    {
      question: "How should you roll out hooks and MCP safely?",
      answer:
        "Start read-only, test hooks locally, document expected side effects, and add write capabilities only after the workflow proves useful and the owner agrees with the logs.",
    },
  ],
};

export function getVisibleGuideFaqs(guide: Guide): FaqItem[] {
  return guideFaqsBySlug[guide.slug] ?? buildGuideFaqs(guide);
}
