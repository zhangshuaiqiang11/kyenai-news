# Repository instructions

## Scope
- These instructions apply to the whole repository.
- Read a nearer AGENTS.md before editing files in a nested directory.

## Setup
- Install dependencies with `npm ci`.
- Start local development with `npm run dev`.

## Change rules
- Follow existing module boundaries and naming conventions.
- Do not change generated files or lockfiles unless the task requires it.
- Keep user-facing behavior backward compatible unless the request says otherwise.

## Verification
- Run `npm run lint`.
- Run `npm test`.
- Run `npm run build` for production-facing changes.

## Delivery
- Summarize changed files and verification results.
- Report skipped checks and remaining risks explicitly.
