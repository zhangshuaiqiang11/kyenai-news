export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  longDefinition: string;
  related: string[];
  updatedAt: string;
};

const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "loop-engineering",
    term: "Loop Engineering",
    definition:
      "Loop engineering is the practice of designing the repeatable control system around an AI coding agent — goal, context, tools, observation, verification, retry policy, and stop rules — instead of optimizing a single prompt.",
    longDefinition:
      "For AI coding agents, loop engineering replaces task-by-task babysitting with a durable Plan → Act → Observe → Verify → Stop cycle. The agent is given a bounded goal, reads repository evidence (test output, compiler errors, diffs, logs) before its next step, retries only with a changed strategy, and stops on token or cost caps, repeated failure, wider-permission requests, or a required human checkpoint. This makes agent work auditable: every retry has a reason, every escalation has an owner, and every completed run leaves a concise artifact. Loop engineering is distinct from prompt engineering, which improves one instruction, and from a cron job, which runs a fixed command on a schedule without observing state.",
    related: ["/guides/loop-engineering-ai-coding-agents", "/guides/codex-vs-claude-code"],
    updatedAt: "2026-06-27",
  },
  {
    slug: "ai-coding-agent",
    term: "AI Coding Agent",
    definition:
      "An AI coding agent is an autonomous or semi-autonomous system that reads a codebase, plans changes, edits files, runs tests, and iterates toward a goal with minimal per-step human prompting.",
    longDefinition:
      "Modern AI coding agents combine a large language model with tool access (file edit, shell command, browser, MCP servers), a context window, instruction-file discovery, and a control loop. Examples include OpenAI Codex, Anthropic Claude Code, GitHub Copilot agent surfaces, and the Cursor agent. Unlike a code-completion assistant that suggests the next line, an agent can break a task into steps, observe intermediate results, and revise its approach. Reviewable safety controls — repository instructions, hooks, MCP permission boundaries, iteration caps, and human-in-the-loop checkpoints — determine whether an agent stays inside trusted boundaries while it works.",
    related: ["/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions", "/guides/secure-mcp-servers-ai-coding-agents"],
    updatedAt: "2026-06-27",
  },
];

export function getGlossaryTerms(): GlossaryTerm[] {
  return glossaryTerms;
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.slug === slug);
}
