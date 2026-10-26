# Node.js repository instructions

## Scope
- These instructions apply to the whole Node.js repository.
- Read a nearer AGENTS.md before editing a nested package.

## Setup
- Install the locked dependency graph with `npm ci`.
- Start local development with `npm run dev`.

## Project map
- Application code: `src/`
- Tests: `tests/` or colocated `*.test.*` files
- Generated output: `dist/`, `.next/`, and coverage folders

## Change rules
- Reuse existing modules before adding a production dependency.
- Do not edit generated output or dependency lockfiles unless the task requires it.
- Keep public APIs backward compatible unless the request explicitly changes them.
- Never expose secrets, tokens, or customer data in code, fixtures, logs, or output.

## Verification
- Run `npm run lint`.
- Run `npm test`.
- Run `npm run build` for production-facing changes.

## Delivery
- Summarize changed files and observable behavior.
- Report exact verification results, skipped checks, and remaining risks.
