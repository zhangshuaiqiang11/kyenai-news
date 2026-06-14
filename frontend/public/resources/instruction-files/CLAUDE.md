# Project context

This repository is a production application. Prefer small, reviewable changes that follow existing patterns.

## Key locations
- Application code: `src/`
- Tests: `tests/`
- Documentation: `docs/`

## Workflow
1. Read the affected module and its nearest tests before editing.
2. Reuse existing helpers and dependencies.
3. Add or update focused tests for behavior changes.
4. Run `npm test` and `npm run lint`.

## Guardrails
- Never expose credentials or copy secrets into output.
- Do not rewrite unrelated code.
- Ask before destructive data, schema, or dependency changes.

## Completion
State what changed, what was verified, and any known limitation.
