# Python repository instructions

## Scope
- These instructions apply to the Python service in this repository.
- Follow a nearer AGENTS.md when a package has different commands or ownership.

## Setup
- Create a virtual environment with `python -m venv .venv`.
- Install dependencies with `.venv/bin/python -m pip install -r requirements.txt`.

## Project map
- Application code: `src/` or the documented package directory
- Tests: `tests/`
- Migrations: the repository's migration directory

## Change rules
- Use the project virtual environment for commands and tests.
- Do not edit migrations, lockfiles, generated clients, or production data without approval.
- Keep secrets out of source, fixtures, snapshots, logs, and prompts.
- Preserve public function and API behavior unless the request explicitly changes it.

## Verification
- Run `.venv/bin/python -m pytest`.
- Run the repository's configured formatter and linter.
- Run type checking when the project configures it.

## Delivery
- Summarize changed modules and behavior.
- Report exact test results, skipped checks, migration impact, and remaining risks.
