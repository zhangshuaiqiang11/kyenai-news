# Monorepo instructions

## Scope and precedence
- This root AGENTS.md defines shared policy for every workspace.
- Read the nearest nested AGENTS.md before editing a package.
- A nested file should override only commands, paths, or ownership that differ locally.

## Setup
- Install the full workspace from the repository root with `npm ci`.
- Do not run a second package manager inside a workspace.

## Workspace map
- Applications: `apps/`
- Shared packages: `packages/`
- Generated artifacts: `generated/`, `dist/`, and build-cache folders

## Change rules
- Keep package-specific edits inside the owning workspace when possible.
- Coordinate public API changes with every consuming workspace and its tests.
- Do not edit generated artifacts, deployment manifests, migrations, or lockfiles without task-specific justification.
- Never expose repository, CI, or production credentials.

## Verification
- Run root lint and unit tests.
- Run the affected workspace's focused tests and build.
- Run cross-workspace integration checks when a shared package changes.

## Delivery
- List affected workspaces, changed public APIs, and generated outputs.
- Report focused and root verification results, skipped checks, and rollout risks.
