export type CodexCopilotChoice = "codex" | "copilot" | "pilot";

export type CodexCopilotOption = {
  id: CodexCopilotChoice;
  label: string;
  detail: string;
  codexPoints: number;
  copilotPoints: number;
};

export type CodexCopilotQuestion = {
  id: string;
  prompt: string;
  options: CodexCopilotOption[];
};

const pilotOption: CodexCopilotOption = {
  id: "pilot",
  label: "No strong preference",
  detail: "Keep this dimension neutral and verify it with the same repository task.",
  codexPoints: 0,
  copilotPoints: 0,
};

export const codexCopilotQuestions: CodexCopilotQuestion[] = [
  {
    id: "starting-surface",
    prompt: "Where should most delegated work begin?",
    options: [
      {
        id: "codex",
        label: "Codex app, ChatGPT, or CLI",
        detail: "The team wants one OpenAI agent experience across app, local, IDE, cloud, and mobile handoff.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "GitHub, IDE, or Copilot CLI",
        detail: "The team wants agent work embedded in GitHub repositories and its existing editor estate.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
  {
    id: "instructions",
    prompt: "Which instruction system should be canonical?",
    options: [
      {
        id: "codex",
        label: "Root and nested AGENTS.md",
        detail: "The repository already owns Codex-compatible scoped instructions.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "GitHub instruction ecosystem",
        detail: "The team needs repository-wide, path-specific, personal, organization, and agent instructions by surface.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
  {
    id: "parallelism",
    prompt: "How should parallel tasks be organized?",
    options: [
      {
        id: "codex",
        label: "Visual threads with isolated worktrees",
        detail: "Reviewing several independent local agent diffs in one command center is the priority.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "GitHub agents and CLI /fleet",
        detail: "The team wants cloud issue-to-PR work or CLI subagents inside GitHub's control plane.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
  {
    id: "models",
    prompt: "How important is a broad model catalog?",
    options: [
      {
        id: "codex",
        label: "OpenAI-native model path",
        detail: "The team prefers Codex models and one OpenAI account and workspace relationship.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "Multiple model providers",
        detail: "Choosing among supported OpenAI, Anthropic, Google, and other models is a procurement requirement.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
  {
    id: "billing",
    prompt: "Which usage and billing model is easier to govern?",
    options: [
      {
        id: "codex",
        label: "ChatGPT plan plus optional credits",
        detail: "The organization already manages ChatGPT access and Codex usage there.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "GitHub plans and AI Credits",
        detail: "Copilot seats, pooled allowances, model token rates, and GitHub billing fit existing controls.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
  {
    id: "governance",
    prompt: "Which administration boundary already owns developer AI?",
    options: [
      {
        id: "codex",
        label: "OpenAI workspace and Codex controls",
        detail: "Security approval, identity, plugins, skills, hooks, and review already live with OpenAI tooling.",
        codexPoints: 2,
        copilotPoints: 0,
      },
      {
        id: "copilot",
        label: "GitHub organization and enterprise policy",
        detail: "Repositories, pull requests, Copilot policy, seats, and audit ownership already live in GitHub.",
        codexPoints: 0,
        copilotPoints: 2,
      },
      pilotOption,
    ],
  },
];

export function scoreCodexCopilotDecision(answers: Record<string, CodexCopilotChoice | undefined>) {
  let codexPoints = 0;
  let copilotPoints = 0;
  let answered = 0;

  for (const question of codexCopilotQuestions) {
    const answer = answers[question.id];
    if (!answer) continue;
    const option = question.options.find((candidate) => candidate.id === answer);
    if (!option) continue;
    codexPoints += option.codexPoints;
    copilotPoints += option.copilotPoints;
    answered += 1;
  }

  const difference = codexPoints - copilotPoints;
  const recommendation: CodexCopilotChoice = difference >= 3 ? "codex" : difference <= -3 ? "copilot" : "pilot";
  return { codexPoints, copilotPoints, answered, recommendation };
}
