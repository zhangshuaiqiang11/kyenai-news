# Copilot repository instructions

## Repository conventions
- Use the existing language, framework, and folder patterns.
- Prefer existing utilities over adding dependencies.
- Keep public APIs backward compatible unless the task explicitly changes them.

## Implementation
- Read nearby code and tests before proposing edits.
- Make the smallest complete change that solves the request.
- Add tests for fixes and user-visible behavior.
- Do not modify generated artifacts manually.

## Validation
- Run `npm run lint`.
- Run `npm test`.
- Run `npm run build` when build output or routing changes.

## Response
- Cite the files changed.
- Include exact validation results.
- Call out assumptions, skipped checks, and security implications.
