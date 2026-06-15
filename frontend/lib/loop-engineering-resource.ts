export const loopEngineeringVerifiedAt = "June 15, 2026";

export type LoopPatternRecord = {
  id: string;
  pattern: string;
  bestFor: string;
  termination: string;
  toolExamples: string;
  risk: string;
};

export const loopPatterns: LoopPatternRecord[] = [
  {
    id: "plan-execute-verify",
    pattern: "Plan → execute → verify",
    bestFor: "Contained repo tasks with a clear success command such as tests, type checks, or builds",
    termination: "Stop when verification passes or the iteration cap is reached",
    toolExamples: "Claude Code agent sessions, Cursor Agent mode, Codex with AGENTS.md verification rules",
    risk: "Unbounded retries that churn files without reading failing output",
  },
  {
    id: "retry-with-cap",
    pattern: "Retry with capped iterations",
    bestFor: "Flaky commands, migration steps, or setup tasks where one more attempt often succeeds",
    termination: "Hard cap on attempts per item, then escalate to a human",
    toolExamples: "Claude Code /loop on a schedule, Cursor Automations with explicit max-run notes",
    risk: "Burning tokens on the same bad assumption instead of changing strategy",
  },
  {
    id: "evaluator-optimizer",
    pattern: "Evaluator → optimizer",
    bestFor: "Work with clear quality criteria: reviews, docs, test plans, or refactor proposals",
    termination: "Stop when the evaluator accepts the output or improvement stalls",
    toolExamples: "Claude Code subagents (maker + checker), Codex subagents in .codex/agents/",
    risk: "Two agents agreeing on a polished but wrong answer without ground-truth checks",
  },
  {
    id: "explore-narrow",
    pattern: "Explore → narrow → implement",
    bestFor: "Unfamiliar codebases, incident triage, or tasks where the first file guess is often wrong",
    termination: "Stop when the target files and change scope are identified, then switch to bounded edits",
    toolExamples: "Read-only subagents, Ask mode, then Agent mode on a scoped branch",
    risk: "Endless exploration with no handoff to a bounded implementation loop",
  },
  {
    id: "scheduled-wake",
    pattern: "Scheduled wake-up loop",
    bestFor: "Recurring hygiene: dependency alerts, nightly test triage, changelog scans, backlog grooming",
    termination: "Each run ends with a summary, ticket, or no-op; the schedule does not imply infinite in-run retries",
    toolExamples: "Claude Code /loop and cron, Cursor Automations, GitHub Actions agent jobs",
    risk: "Treating a cron job as a loop without in-run observation and stop rules",
  },
  {
    id: "human-checkpoint",
    pattern: "Human-in-the-loop checkpoint",
    bestFor: "Production changes, permission widening, schema migrations, or destructive operations",
    termination: "Pause until a named human approves, rejects, or narrows scope",
    toolExamples: "Hooks before deploy, MCP approval gates, PR-required cloud agent output",
    risk: "Automating past the checkpoint because the loop 'almost' finished",
  },
];

export const loopBuildingBlocks = [
  {
    id: "goal",
    title: "Clear goal and done signal",
    detail: "State what finished means: passing command, merged PR, ticket filed, or report delivered.",
  },
  {
    id: "tools",
    title: "Observable tools",
    detail: "Give the agent tests, linters, logs, diffs, or MCP access so each cycle produces evidence.",
  },
  {
    id: "context",
    title: "Context budget",
    detail: "Load repo instructions, skills, and scoped files deliberately; trim between iterations.",
  },
  {
    id: "termination",
    title: "Termination and escalation",
    detail: "Cap iterations, name escalation paths, and stop when the same error repeats.",
  },
  {
    id: "cost",
    title: "Cost and concurrency limits",
    detail: "Budget tokens, parallel agents, and runtime so loops cannot run unbounded overnight.",
  },
] as const;
