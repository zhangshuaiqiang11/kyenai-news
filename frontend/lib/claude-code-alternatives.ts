export type ClaudeCodeAlternativeId =
  | "stay"
  | "codex"
  | "copilot"
  | "cursor"
  | "gemini"
  | "cline"
  | "aider"
  | "opencode";

export type ClaudeCodeAlternativeOption = {
  id: ClaudeCodeAlternativeId;
  label: string;
  trigger: string;
  fit: string;
  tradeoff: string;
  nextStep: string;
};

export const claudeCodeAlternativeOptions: ClaudeCodeAlternativeOption[] = [
  {
    id: "stay",
    label: "Stay with Claude Code",
    trigger: "The terminal, CLAUDE.md, Anthropic models, and current approval flow already fit.",
    fit: "Avoid migration cost when the current workflow has no measured failure.",
    tradeoff: "You keep the current vendor, model, and administration boundary.",
    nextStep: "Document the current baseline and fix the specific workflow gap before adding another tool.",
  },
  {
    id: "codex",
    label: "Codex",
    trigger: "You want an OpenAI-native command center across app threads, CLI, IDE, and cloud work.",
    fit: "Teams that want separate delegated tasks and AGENTS.md-centered repository guidance.",
    tradeoff: "Migration changes the model, workspace, instruction, and administration boundary.",
    nextStep: "Pilot one bounded task in a separate thread or worktree and compare the verified diff with Claude Code.",
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    trigger: "GitHub identity, issues, pull requests, existing IDEs, and organization policy must stay central.",
    fit: "Teams that want an agent inside a GitHub and multi-editor control plane.",
    tradeoff: "Capabilities and instruction support vary by Copilot surface and organization policy.",
    nextStep: "Name the exact IDE, CLI, cloud-agent, and review surfaces before running the pilot.",
  },
  {
    id: "cursor",
    label: "Cursor",
    trigger: "You want an AI-first editor with foreground work and remote Cloud Agents.",
    fit: "Teams willing to standardize the daily development surface around Cursor.",
    tradeoff: "The editor becomes part of the migration, not just the coding model or agent.",
    nextStep: "Test one local editor task and one Cloud Agent task with approved repository and network access.",
  },
  {
    id: "gemini",
    label: "Gemini CLI",
    trigger: "You want Google's open-source terminal agent, GEMINI.md, scripting, and Google Cloud authentication paths.",
    fit: "Terminal teams aligned with Gemini, Google accounts, Gemini API, or Vertex AI.",
    tradeoff: "Quotas, models, authentication, and enterprise setup vary by access path.",
    nextStep: "Verify the current quota and auth route, then run the same repository task from a clean commit.",
  },
  {
    id: "cline",
    label: "Cline",
    trigger: "You want an open-source agent in the editor or terminal with explicit approvals and provider choice.",
    fit: "Teams that value visible human approval and bring-your-own-provider flexibility.",
    tradeoff: "Provider, model, billing, and enterprise controls still need separate evaluation.",
    nextStep: "Choose one provider path and test the restrictive approval configuration before enabling automation.",
  },
  {
    id: "aider",
    label: "Aider",
    trigger: "You want a lightweight terminal pair programmer with strong Git integration and broad model connectivity.",
    fit: "Developers who prefer local Git workflows, explicit file context, and provider-level control.",
    tradeoff: "It is a different operating model from a managed multi-surface agent workspace.",
    nextStep: "Run Aider inside a disposable branch and measure test results, commits, undo behavior, and review effort.",
  },
  {
    id: "opencode",
    label: "OpenCode",
    trigger: "You want an open-source terminal, desktop, or IDE agent with provider choice and AGENTS.md support.",
    fit: "Teams that want a multi-provider client and are prepared to own more configuration.",
    tradeoff: "Open-source software does not remove model charges, provider terms, or governance work.",
    nextStep: "Select an approved provider, initialize AGENTS.md, keep Plan mode read-only, and pilot one bounded change.",
  },
];

export function getClaudeCodeAlternative(id: string | undefined): ClaudeCodeAlternativeOption | undefined {
  return claudeCodeAlternativeOptions.find((option) => option.id === id);
}
