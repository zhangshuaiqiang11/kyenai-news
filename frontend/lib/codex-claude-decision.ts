export type CodingAgentChoice = "codex" | "claude" | "pilot";

export type CodingAgentDecisionOption = {
  id: CodingAgentChoice;
  label: string;
  detail: string;
  codexPoints: number;
  claudePoints: number;
};

export type CodingAgentDecisionQuestion = {
  id: string;
  prompt: string;
  options: CodingAgentDecisionOption[];
};

const pilotOption: CodingAgentDecisionOption = {
  id: "pilot",
  label: "No strong preference",
  detail: "Keep this dimension neutral and settle it with a same-repository pilot.",
  codexPoints: 0,
  claudePoints: 0,
};

export const codingAgentDecisionQuestions: CodingAgentDecisionQuestion[] = [
  {
    id: "workspace",
    prompt: "Where should most agent work start?",
    options: [
      { id: "codex", label: "OpenAI app, IDE, or cloud", detail: "The team wants task handoff across Codex surfaces and GitHub-oriented review.", codexPoints: 2, claudePoints: 0 },
      { id: "claude", label: "Terminal sessions", detail: "The team wants a terminal-native workflow close to local commands and files.", codexPoints: 0, claudePoints: 2 },
      pilotOption,
    ],
  },
  {
    id: "instructions",
    prompt: "Which repository instruction system already has an owner?",
    options: [
      { id: "codex", label: "AGENTS.md", detail: "The repository maintains Codex-compatible root and nested instructions.", codexPoints: 2, claudePoints: 0 },
      { id: "claude", label: "CLAUDE.md", detail: "The repository maintains Claude Code project memory and workflows.", codexPoints: 0, claudePoints: 2 },
      pilotOption,
    ],
  },
  {
    id: "parallelism",
    prompt: "How should parallel work be isolated?",
    options: [
      { id: "codex", label: "Built-in worktrees and agent threads", detail: "The team wants a visual command center for separate tasks and diffs.", codexPoints: 2, claudePoints: 0 },
      { id: "claude", label: "Subagents inside a terminal workflow", detail: "The team wants delegated specialists coordinated from Claude Code.", codexPoints: 0, claudePoints: 2 },
      pilotOption,
    ],
  },
  {
    id: "automation",
    prompt: "Which extension model fits existing operations?",
    options: [
      { id: "codex", label: "Skills, apps, and Codex automations", detail: "Reusable Codex skills and OpenAI-connected workflows fit current operations.", codexPoints: 2, claudePoints: 0 },
      { id: "claude", label: "Hooks, MCP, and headless CLI", detail: "Shell hooks, MCP configuration, and scripted CLI runs are already governed.", codexPoints: 0, claudePoints: 2 },
      pilotOption,
    ],
  },
  {
    id: "deployment",
    prompt: "Which enterprise control plane is easier to approve?",
    options: [
      { id: "codex", label: "OpenAI workspace controls", detail: "Identity, usage, and review already live in an OpenAI workspace.", codexPoints: 2, claudePoints: 0 },
      { id: "claude", label: "Anthropic API, Bedrock, or Vertex AI", detail: "The organization wants Claude Code through its existing cloud or Anthropic control plane.", codexPoints: 0, claudePoints: 2 },
      pilotOption,
    ],
  },
];

export function scoreCodingAgentDecision(answers: Record<string, CodingAgentChoice | undefined>) {
  let codexPoints = 0;
  let claudePoints = 0;
  let answered = 0;

  for (const question of codingAgentDecisionQuestions) {
    const answer = answers[question.id];
    if (!answer) continue;
    const option = question.options.find((candidate) => candidate.id === answer);
    if (!option) continue;
    codexPoints += option.codexPoints;
    claudePoints += option.claudePoints;
    answered += 1;
  }

  const difference = codexPoints - claudePoints;
  const recommendation: CodingAgentChoice = difference >= 3 ? "codex" : difference <= -3 ? "claude" : "pilot";
  return { codexPoints, claudePoints, answered, recommendation };
}
