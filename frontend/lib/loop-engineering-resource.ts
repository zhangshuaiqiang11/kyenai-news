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

export const loopWorkflowSteps = [
  {
    id: "plan",
    label: "Plan",
    detail: "Define the repository task, allowed files, verification command, budget, and approval boundary.",
  },
  {
    id: "act",
    label: "Act",
    detail: "Let the agent make the smallest useful change, create the artifact, or run the selected tool.",
  },
  {
    id: "observe",
    label: "Observe",
    detail: "Read tests, logs, diffs, screenshots, GSC exports, or tool output before choosing the next action.",
  },
  {
    id: "verify",
    label: "Verify",
    detail: "Run the named check and compare the result with the done signal rather than relying on a summary.",
  },
  {
    id: "retry-stop",
    label: "Retry or stop",
    detail: "Retry with a changed strategy, escalate to a human, or stop when success, risk, repetition, or budget says so.",
  },
] as const;

export const loopStopRules = [
  "Stop when the verification command passes and the required artifact exists.",
  "Stop after two repeated failures with the same root cause unless a human approves a new strategy.",
  "Stop before production changes, permission expansion, data deletion, or secret access.",
  "Stop when the run reaches its token, time, cost, or parallel-agent budget.",
  "Stop when the agent cannot explain the next action from observed evidence.",
  "Stop when the loop would create a second page, branch, or tool path that competes with the original goal.",
] as const;

export const loopEngineeringExample = {
  title: "Example: turn a flaky coding-agent task into a bounded loop",
  scenario:
    "A team asks an AI coding agent to fix failing frontend tests after a dependency upgrade. The old prompt was: 'fix the tests.' The loop version names the files, the test command, the maximum attempts, and the stop rule.",
  steps: [
    "Plan: inspect the failing test output and list likely files without editing.",
    "Act: patch one cause at a time on a branch, keeping generated files out of scope.",
    "Observe: run the specific failing test first, then the wider test file if the focused check passes.",
    "Verify: run the project test command and capture the exact pass or fail state.",
    "Retry/stop: retry once with a different hypothesis; after the second same failure, produce a handoff note instead of rewriting more code.",
  ],
} as const;

export const loopEngineeringPseudoCode = `goal = "fix failing frontend tests after dependency upgrade"
verify = "npm test --prefix frontend -- guide"
max_iterations = 3
same_failure_count = 0

for attempt in range(1, max_iterations + 1):
    plan = agent.plan(goal, current_test_output, allowed_files)
    patch = agent.act(plan)
    result = run(verify)

    if result.passed:
        stop("done", patch, result)

    if result.failure_signature == previous_failure_signature:
        same_failure_count += 1
    else:
        same_failure_count = 0

    if same_failure_count >= 2 or touches_production_boundary(patch):
        escalate("human review", result, patch)

    current_test_output = result.output

stop("iteration cap reached", current_test_output)`;
