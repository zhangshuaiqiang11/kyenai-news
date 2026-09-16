# Loop Engineering Proof-of-Done Runbook

Version: 1.1.0  
Verified: 2026-07-30  
License: CC BY 4.0

Preferred citation: KyenAI. (2026). *Loop Engineering Proof-of-Done Pack* (Version 1.1.0). https://www.kyenai.com/guides/loop-engineering-ai-coding-agents

## Purpose

Use this runbook to wrap an AI coding agent in a bounded outer control loop. The agent proposes and acts; the loop decides whether evidence permits another attempt, a verified terminal state, or escalation.

## Before the run

1. Write one observable goal and the command or artifact that proves completion.
2. Record the immutable source revision and allowed paths.
3. Set iteration, repeated-failure, wall-clock, token, cost, and concurrency limits.
4. Name destructive, production, secret, permission, and network boundaries.
5. Assign an escalation owner who can approve, narrow, or stop the run.

## Per-iteration control loop

1. Plan from current evidence, not the previous summary.
2. Make the smallest scoped change.
3. Capture the diff, command receipt, logs, and any visual evidence.
4. Verify receipts were produced from the current source revision.
5. Transition only to an allowed state: `verified`, `review-required`, `blocked`, `stopped-by-budget`, or `stopped-by-policy`.

## Mandatory stop rules

- Stop when all required gates pass.
- Stop after two failures with the same root cause.
- Stop when a budget is exhausted.
- Stop before destructive work, production changes, secret access, or wider permissions.
- Stop when evidence is stale or does not match the current source revision.
- Stop when the next action cannot be justified from observed evidence.

## Evidence package

For every required gate, retain the source revision, command or reviewer, start and finish time, exit state, receipt location, and concise verdict. An agent's completion message is a claim, not a receipt.

## Limitations

This pack is an operational template, not a formal proof system. A passing gate proves only the named check under its stated trust model. It does not prove semantic program correctness, security, legality, or production fitness.
