# KyenAI Agent Benchmark 2026 v1

Status: protocol published; no controlled tool run completed as of 2026-09-15.

## Purpose

This is a reproducible, same-repository task for measuring whether an AI coding client can update a consistent instruction-file set while preserving application code. It is a protocol and evidence package, not a claim that one client is faster or better.

## Controlled-run requirements

1. Pin the repository revision, operating system, client name, client version, model, and relevant settings.
2. Start from the same clean fixture for every client.
3. Use the task manifest and identical user request.
4. Record elapsed time, files changed, verification result, human interventions, and measured cost only from the run.
5. Attach a redacted raw log and a machine-readable result row.
6. Review the diff and verify that no application source file changed.
7. Publish failures and limitations alongside successful runs.

## Metrics

- elapsedSeconds: wall-clock duration from task dispatch to verified completion.
- filesChanged: count of changed fixture files, excluding the raw-log artifact.
- humanInterventions: manual actions needed before verification passed.
- measuredCostUsd: provider/client billable amount when directly attributable; otherwise null.
- verificationPassed: result of the named verification command.

A null value means that the run was not measured. It is never a zero and must not be imputed.

## Reproduction command

Use the fixture and verifier shipped in the KyenAI instruction package. Capture the exact command, environment, and result in the raw-log template at /resources/data/kyenai-agent-benchmark-2026-v1-raw-logs/README.md.

## Limitations

This protocol does not measure ranking, code quality beyond the stated checks, long-term maintenance, vendor reliability, or enterprise security. A result from one repository and one task cannot be generalized to every codebase.
