export type CodingAgentId = "codex" | "claude" | "copilot" | "cursor";

export type CodingAgentOption = {
  id: CodingAgentId;
  label: string;
  detail: string;
};

export type CodingAgentQuestion = {
  id: string;
  prompt: string;
  options: CodingAgentOption[];
};

export const codingAgentNames: Record<CodingAgentId, string> = {
  codex: "Codex",
  claude: "Claude Code",
  copilot: "GitHub Copilot",
  cursor: "Cursor",
};

export const codingAgentComparisonQuestions: CodingAgentQuestion[] = [
  {
    id: "starting-surface",
    prompt: "Where should most agent work begin?",
    options: [
      { id: "codex", label: "OpenAI agent workspace", detail: "Separate app threads, CLI work, cloud tasks, and editor handoff." },
      { id: "claude", label: "Terminal-first workflow", detail: "A command-line agent should stay close to the repository and shell." },
      { id: "copilot", label: "GitHub and existing IDEs", detail: "Repositories, pull requests, policy, and supported editors are the control plane." },
      { id: "cursor", label: "AI-first code editor", detail: "The team is willing to standardize on Cursor's editor and agent interface." },
    ],
  },
  {
    id: "instructions",
    prompt: "Which repository instruction system should be primary?",
    options: [
      { id: "codex", label: "AGENTS.md", detail: "Root and nested AGENTS.md files already own scoped repository guidance." },
      { id: "claude", label: "CLAUDE.md", detail: "Claude-specific memory, commands, hooks, and agent guidance are already in use." },
      { id: "copilot", label: "GitHub instructions", detail: "Repository-wide, path-specific, organization, personal, and agent instructions matter." },
      { id: "cursor", label: "Cursor rules", detail: "Versioned .cursor/rules files and editor-specific context are the team standard." },
    ],
  },
  {
    id: "parallel-work",
    prompt: "How should parallel or background work be supervised?",
    options: [
      { id: "codex", label: "Threads and worktrees", detail: "Review isolated agent tasks and diffs from one command center." },
      { id: "claude", label: "Terminal subagents", detail: "Delegate bounded roles while the primary session coordinates repository work." },
      { id: "copilot", label: "Issues, cloud agent, and /fleet", detail: "Parallel work should stay close to GitHub tasks and pull requests." },
      { id: "cursor", label: "Editor and cloud agents", detail: "Move between foreground editing and remote agents connected to approved source-control repositories." },
    ],
  },
  {
    id: "model-boundary",
    prompt: "Which model and vendor boundary is easiest to govern?",
    options: [
      { id: "codex", label: "OpenAI-native", detail: "One OpenAI workspace and Codex model path is preferred." },
      { id: "claude", label: "Anthropic-native", detail: "Claude models and Anthropic administration are already approved." },
      { id: "copilot", label: "GitHub model catalog", detail: "Model choice should be administered through GitHub plans and policy." },
      { id: "cursor", label: "Cursor model routing", detail: "Model choice should live inside an AI-first editor subscription." },
    ],
  },
  {
    id: "administration",
    prompt: "Which team already owns developer-AI identity and policy?",
    options: [
      { id: "codex", label: "OpenAI workspace owners", detail: "Identity, access, skills, plugins, and review already sit with OpenAI tooling." },
      { id: "claude", label: "Anthropic administrators", detail: "Claude access, API usage, hooks, and terminal policy already have owners." },
      { id: "copilot", label: "GitHub organization owners", detail: "Seats, repositories, models, audit, and pull-request policy belong in GitHub." },
      { id: "cursor", label: "Cursor team administrators", detail: "Editor rollout, privacy settings, models, and background-agent access have owners." },
    ],
  },
];

export function scoreCodingAgentComparison(answers: Record<string, CodingAgentId | undefined>) {
  const scores: Record<CodingAgentId, number> = { codex: 0, claude: 0, copilot: 0, cursor: 0 };
  let answered = 0;

  for (const question of codingAgentComparisonQuestions) {
    const answer = answers[question.id];
    if (!answer || !question.options.some((option) => option.id === answer)) continue;
    scores[answer] += 1;
    answered += 1;
  }

  if (answered === 0) return { scores, answered, leaders: [] as CodingAgentId[] };
  const highestScore = Math.max(...Object.values(scores));
  const leaders = (Object.keys(scores) as CodingAgentId[]).filter((id) => scores[id] === highestScore);
  return { scores, answered, leaders };
}
