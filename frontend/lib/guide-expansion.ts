import type { Guide } from "./types";

export const expansionGuides: Guide[] = [
  {
    id: "guide-codex-vs-claude-code",
    title: "Codex vs Claude Code",
    slug: "codex-vs-claude-code",
    summary:
      "Use Codex when you want an OpenAI coding agent tied to ChatGPT and Codex workflows; use Claude Code when your team prefers a terminal-first agent with strong project memory, hooks, MCP, and subagent patterns.",
    intent: "Developers want a plain comparison of Codex and Claude Code before choosing an AI coding agent.",
    audience: "Developers, staff engineers, and team leads comparing agentic coding tools for real repositories.",
    pageType: "Comparison decision guide",
    secondaryKeywords: ["OpenAI Codex vs Claude Code", "Codex alternatives", "Claude Code alternatives", "AI coding agent comparison"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Choose Codex if your team already works inside OpenAI and wants a coding agent connected to ChatGPT-style review, code changes, and shareable work. Choose Claude Code if you want a terminal-first workflow where project memory, hooks, MCP servers, and subagents are part of the daily setup.",
        ],
      },
      {
        heading: "Simple way to decide",
        body: [
          "If the work starts from a product question, a plan, or a review in ChatGPT, Codex is usually the easier first stop.",
          "If the work starts inside a repo with commands, local files, and repeated engineering routines, Claude Code is often the more natural fit.",
          "Neither choice removes review. Treat both tools as agents that can draft, edit, and test, not as a replacement for ownership.",
        ],
      },
      {
        heading: "Where the difference matters",
        body: [
          "The practical difference is workflow shape. Codex fits teams that want OpenAI-native agent work and a bridge from discussion to code. Claude Code fits teams that want command-line control, local project memory, and explicit automation boundaries.",
          "For a small team, the best test is one real bug fix and one real refactor. Watch which tool asks for clearer instructions, which one handles test failures better, and which one leaves a diff that is easier to review.",
        ],
      },
    ],
    recommendedPlay: [
      "Run the same small bug fix in both tools before deciding.",
      "Score the output by review effort, test behavior, safety prompts, and how easy the final diff is to understand.",
      "Keep the page updated with product behavior and official docs, not vague model claims.",
    ],
    decisionTable: {
      title: "Codex and Claude Code fit map",
      intro: "Use this table to pick the starting tool by workflow, not by brand preference.",
      columns: ["Choose Codex when", "Choose Claude Code when", "Check before rollout"],
      rows: [
        {
          label: "Daily workspace",
          values: [
            "Planning, code review, and task handoff already happen around OpenAI tools",
            "The team works from terminal sessions and repository-local context",
            "Confirm where instructions, logs, and generated artifacts are stored",
          ],
        },
        {
          label: "Repository guidance",
          values: [
            "You want AGENTS.md-style repository instructions for Codex-compatible workflows",
            "You rely on CLAUDE.md memory and Claude-specific workflow notes",
            "Keep commands and security rules consistent across files",
          ],
        },
        {
          label: "Automation",
          values: [
            "You need agent work that can move from conversation to code artifacts",
            "You want hooks, MCP, and subagents as explicit control points",
            "Start read-only or low-risk until the workflow proves useful",
          ],
        },
        {
          label: "Team review",
          values: [
            "You want reviewable outputs that fit OpenAI/Codex collaboration habits",
            "You want terminal-local changes that can be checked with existing commands",
            "Require tests, diff review, and rollback for both",
          ],
        },
      ],
    },
    actionSteps: [
      {
        title: "Pick one real task",
        body: "Use a small bug, a failing test, or a contained UI change so both tools face the same job.",
      },
      {
        title: "Give both tools the same boundary",
        body: "Name the files they may touch, the command that proves success, and the parts of the repo they should not change.",
      },
      {
        title: "Review the diff, not the demo",
        body: "Compare final code, test output, reasoning notes, and any extra files created along the way.",
      },
      {
        title: "Choose by workflow fit",
        body: "Pick the tool that your team can review and repeat safely, even if the other tool produced a flashier first answer.",
      },
    ],
    pitfalls: [
      {
        title: "Ranking tools without a task",
        fix: "Use one actual repository task instead of judging from product descriptions.",
      },
      {
        title: "Ignoring review cost",
        fix: "A fast answer is not useful if the diff takes longer to trust.",
      },
      {
        title: "Mixing instruction files",
        fix: "Keep shared project rules consistent across AGENTS.md, CLAUDE.md, and other tool-specific files.",
      },
    ],
    internalLinks: [
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AI coding agent instruction files",
        reason: "Tool choice is easier when repository instructions are already clean.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents examples",
        reason: "Claude Code becomes more useful when delegation patterns are clear.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template",
        reason: "Codex workflows need clear repo instructions before serious use.",
      },
    ],
    checklist: [
      "Use one real bug fix for the comparison.",
      "Use the same prompt and repo boundary for both tools.",
      "Run the same verification command.",
      "Compare review effort, not only completion speed.",
      "Record which tool handled failures more clearly.",
      "Update the decision after product behavior changes.",
    ],
    evidence: [
      {
        title: "OpenAI Codex AGENTS.md documentation",
        url: "https://github.com/openai/codex/blob/main/docs/agents_md.md",
        publisher: "OpenAI",
        note: "Official repository guidance for AGENTS.md behavior.",
      },
      {
        title: "Claude Code overview",
        url: "https://code.claude.com/docs/en/overview",
        publisher: "Anthropic",
        note: "Official Claude Code workflow overview.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "claude-code-dynamic-workflows-parallel-subagents"],
    updatedAt: "2026-06-06",
    metaTitle: "Codex vs Claude Code: Which AI Coding Agent Fits?",
    metaDescription:
      "A plain Codex vs Claude Code comparison with answer-first guidance, workflow fit, review checks, and rollout risks.",
  },
  {
    id: "guide-agents-md-template",
    title: "AGENTS.md template for AI coding agents",
    slug: "agents-md-template-for-ai-coding-agents",
    summary:
      "Start AGENTS.md with the repo purpose, safe edit boundaries, install commands, test commands, style rules, and review expectations. Keep it short enough that an agent can follow it during a real task.",
    intent: "Developers want a copyable AGENTS.md template instead of another explanation of what instruction files are.",
    audience: "Developers setting up Codex-compatible agents, team leads standardizing repo instructions, and maintainers cleaning stale agent rules.",
    pageType: "Template and checklist",
    secondaryKeywords: ["AGENTS.md template", "AI coding agent instructions template", "Codex AGENTS.md example", "repository instructions template"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "A useful AGENTS.md tells the agent what the repo is, which commands prove work is done, what files are sensitive, and how the team wants changes reviewed. Do not turn it into a long policy essay; the best template is short, specific, and easy to verify.",
        ],
      },
      {
        heading: "Copyable starter template",
        body: [
          "Use this structure: project purpose, install command, development command, test command, formatting command, safe edit boundaries, files to avoid, pull request expectations, and known failure notes.",
          "For small repos, one AGENTS.md at the root is enough. For monorepos, add short nested files only where commands or ownership really differ.",
          "For teams, add one security section: no secrets in prompts, no production writes without approval, and no generated code merge without review.",
        ],
      },
      {
        heading: "What not to put in it",
        body: [
          "Do not paste secrets, access tokens, private customer data, or vague motivational rules. Avoid rules like 'write clean code' unless you explain what command or reviewer checks that rule.",
          "Do not copy the same paragraph into every instruction file. Keep one source of truth and link tool-specific files back to it when possible.",
        ],
      },
    ],
    recommendedPlay: [
      "Create a root AGENTS.md first, then add nested files only when a folder has different commands or ownership.",
      "Keep every command copy-pasteable from a clean checkout.",
      "Review AGENTS.md whenever CI, package managers, test commands, or security boundaries change.",
    ],
    decisionTable: {
      title: "AGENTS.md template blocks",
      intro: "Use these blocks as a practical template. Delete anything that is not true for the repo.",
      columns: ["What to write", "Example", "Keep it out when"],
      rows: [
        {
          label: "Repo purpose",
          values: ["One sentence on what the project does", "Next.js marketing site with a FastAPI admin backend", "The repo is private and purpose details reveal sensitive plans"],
        },
        {
          label: "Commands",
          values: ["Install, dev, test, build, lint", "npm run test; npm run build", "The command is stale or only works on one developer machine"],
        },
        {
          label: "Safe boundaries",
          values: ["Allowed files, risky files, generated files", "Do not edit migrations without approval", "The team has not agreed on ownership yet"],
        },
        {
          label: "Review rule",
          values: ["How to prove the change is done", "Show changed files, test result, and known risk", "The rule is only style preference and not checked anywhere"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the root file",
        body: "Start with the project purpose, commands, safe boundaries, and review expectations.",
      },
      {
        title: "Test every command",
        body: "Run the listed commands once so the agent does not inherit broken instructions.",
      },
      {
        title: "Add folder-specific notes only when needed",
        body: "Use nested AGENTS.md files for monorepo packages, generated folders, or high-risk areas with different rules.",
      },
      {
        title: "Add a drift owner",
        body: "Name the person or team that updates instructions when CI, package managers, or release flow changes.",
      },
    ],
    pitfalls: [
      {
        title: "Writing a policy novel",
        fix: "Keep the file practical: commands, boundaries, and review steps beat long philosophy.",
      },
      {
        title: "Listing commands nobody runs",
        fix: "Only include commands that work from a clean checkout or explain the required setup.",
      },
      {
        title: "Hiding secrets in instructions",
        fix: "Describe environment variable names and access boundaries, never credential values.",
      },
    ],
    internalLinks: [
      {
        slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        anchor: "AGENTS.md vs CLAUDE.md comparison",
        reason: "Readers who need to choose the right instruction file can start there.",
      },
      {
        slug: "codex-vs-claude-code",
        anchor: "Codex vs Claude Code",
        reason: "AGENTS.md setup matters most when choosing a Codex-compatible workflow.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Team instructions should connect to broader approval and audit rules.",
      },
    ],
    checklist: [
      "Explain what the repo does in one sentence.",
      "List install, test, build, and lint commands.",
      "Name files or folders the agent should not edit without approval.",
      "Explain how to verify a completed task.",
      "Keep secrets and customer data out of the file.",
      "Review the file when CI or package managers change.",
    ],
    evidence: [
      {
        title: "OpenAI Codex AGENTS.md documentation",
        url: "https://github.com/openai/codex/blob/main/docs/agents_md.md",
        publisher: "OpenAI",
        note: "Official AGENTS.md behavior and precedence reference.",
      },
      {
        title: "GitHub Copilot custom instructions",
        url: "https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions",
        publisher: "GitHub",
        note: "Official repository instruction reference for Copilot workflows.",
      },
    ],
    relatedArticleSlugs: ["openai-codex-plugins-sites-annotations", "github-copilot-sdk-general-availability"],
    updatedAt: "2026-06-06",
    metaTitle: "AGENTS.md Template for AI Coding Agents",
    metaDescription:
      "Copy a practical AGENTS.md template for AI coding agents with commands, safe boundaries, review rules, and common mistakes.",
  },
  {
    id: "guide-agent-mode-vs-chat-mode",
    title: "Agent mode vs chat mode in IDEs",
    slug: "agent-mode-vs-chat-mode-in-ide",
    summary:
      "Use chat mode for questions and small explanations. Use agent mode when the assistant must inspect files, edit code, run commands, react to errors, and bring a task closer to done.",
    intent: "Developers want to know when to use agent mode instead of ordinary chat in VS Code, Cursor, Visual Studio, or similar IDEs.",
    audience: "Developers trying AI-assisted IDE workflows without wanting a vendor-heavy feature comparison.",
    pageType: "Decision tree",
    secondaryKeywords: ["AI agent mode vs chat mode", "VS Code agent mode", "AI coding agent vs chat", "IDE agent mode"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Chat mode is for asking; agent mode is for doing. If you need an explanation, a short snippet, or help thinking through an error, use chat. If you need cross-file edits, command output, test failures, or a task finished as a diff, use agent mode.",
        ],
      },
      {
        heading: "Use chat mode when",
        body: [
          "The question is small, the answer can fit in one reply, and the assistant does not need to touch files. Examples: explain a stack trace, compare two APIs, rewrite a small function, or ask what a config option means.",
          "Chat mode is also safer when the task is vague. Ask the assistant to help shape the task first, then switch to agent mode after the boundary is clear.",
        ],
      },
      {
        heading: "Use agent mode when",
        body: [
          "The task has a clear done condition: edit these files, run this command, fix this failing test, or update this UI. Agent mode is useful because it can loop through code, commands, errors, and fixes.",
          "Give it a narrow job. A good prompt says what to change, what not to change, and how to prove the work is done.",
        ],
      },
    ],
    recommendedPlay: [
      "Start in chat mode when you are still deciding what the task is.",
      "Switch to agent mode only after you can name the target files, constraints, and verification command.",
      "For risky work, ask the agent to propose a patch first and wait before applying it.",
    ],
    decisionTable: {
      title: "Chat mode and agent mode decision tree",
      intro: "Choose the mode by what the assistant must do, not by how complex the topic sounds.",
      columns: ["Use chat mode", "Use agent mode", "Safety note"],
      rows: [
        {
          label: "Explaining",
          values: ["Explain code, error messages, APIs, or tradeoffs", "Only if explanation needs codebase inspection across files", "Do not let the assistant edit while the question is still vague"],
        },
        {
          label: "Editing",
          values: ["Small snippet or one-file suggestion", "Multi-file change, refactor, UI update, or test fix", "Name the files and the verification command"],
        },
        {
          label: "Debugging",
          values: ["Understand the likely cause", "Reproduce, inspect logs, patch, and rerun checks", "Avoid broad rewrites before the cause is known"],
        },
        {
          label: "Reviewing",
          values: ["Ask for a second opinion on a diff", "Ask for changes only after review findings are clear", "Keep final merge responsibility with a human reviewer"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the task in one sentence",
        body: "If you cannot write the desired outcome clearly, stay in chat mode and clarify the task first.",
      },
      {
        title: "Name the allowed area",
        body: "Tell the agent which files, folders, or modules it may inspect and edit.",
      },
      {
        title: "Give the proof command",
        body: "Add the test, build, or manual check that proves the change worked.",
      },
      {
        title: "Review the final diff",
        body: "Agent mode can move faster than your attention, so read the changed files before merging.",
      },
    ],
    pitfalls: [
      {
        title: "Using agent mode for unclear work",
        fix: "Ask chat mode to turn the vague idea into a bounded task first.",
      },
      {
        title: "Letting the agent decide the scope",
        fix: "Give allowed files, forbidden files, and the success check in the prompt.",
      },
      {
        title: "Treating a passing command as full review",
        fix: "Tests help, but still inspect the diff for product and security mistakes.",
      },
    ],
    internalLinks: [
      {
        slug: "local-vs-cloud-ai-coding-agent",
        anchor: "local vs cloud AI coding agent",
        reason: "Mode choice often leads to where the agent should run.",
      },
      {
        slug: "claude-code-subagents-examples",
        anchor: "Claude Code subagents examples",
        reason: "When agent mode is not enough, subagent delegation may be the next workflow.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Teams should define when agent actions need approval.",
      },
    ],
    checklist: [
      "Use chat for explanation and planning.",
      "Use agent mode for bounded edits with a proof command.",
      "Name files the agent may change.",
      "Name files the agent must avoid.",
      "Review the final diff before merging.",
      "Record risky prompts that need approval next time.",
    ],
    evidence: [
      {
        title: "VS Code agent mode",
        url: "https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode",
        publisher: "Microsoft",
        note: "Official VS Code documentation for agent mode behavior.",
      },
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official GitHub concept reference for coding agents.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-vscode-agents-window-may-2026", "visual-studio-agent-mode-mcp-general-availability"],
    updatedAt: "2026-06-06",
    metaTitle: "Agent Mode vs Chat Mode in IDEs",
    metaDescription:
      "Know when to use IDE chat mode and when to switch to agent mode for file edits, commands, tests, and reviewable diffs.",
  },
  {
    id: "guide-local-vs-cloud-agent",
    title: "Local vs cloud AI coding agent",
    slug: "local-vs-cloud-ai-coding-agent",
    summary:
      "Use a local coding agent when privacy, local tools, and quick feedback matter most. Use a cloud coding agent when the task is long-running, isolated, or better handled as an asynchronous branch or pull request.",
    intent: "Developers and team leads want to decide whether AI coding agents should run locally or in a cloud environment.",
    audience: "Engineering teams comparing local IDE or CLI agents with cloud sandboxes and asynchronous coding agents.",
    pageType: "Decision matrix",
    secondaryKeywords: ["local coding agent vs cloud coding agent", "AI coding agent sandbox", "cloud coding agent", "local AI coding agent"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Local agents are better for fast feedback, private context, and work that depends on your machine. Cloud agents are better for isolated execution, longer tasks, and work that can arrive as a branch or pull request. The safe choice depends on data access, command risk, and review flow.",
        ],
      },
      {
        heading: "When local is better",
        body: [
          "Use local agents when the task needs your exact dev environment, local services, editor context, or quick interactive steering. Local work is easier to watch, but it also means the agent is closer to your files, credentials, and shell.",
          "Local is usually the safer first step for small fixes, reading code, writing tests, and changes that need tight human review.",
        ],
      },
      {
        heading: "When cloud is better",
        body: [
          "Use cloud agents when a task can run in an isolated environment, take longer, or be reviewed later as a branch. Cloud sandboxes can reduce risk to a developer machine, but they still need scoped credentials and audit logs.",
          "Cloud is useful for repetitive migration work, background investigation, dependency updates, or tasks that should not block the developer's local session.",
        ],
      },
    ],
    recommendedPlay: [
      "Start new workflows locally or in a low-risk cloud sandbox before giving broad write permissions.",
      "Use cloud agents for long-running tasks only when branch, log, and rollback rules are clear.",
      "Treat local and cloud agents as different risk profiles, not as good versus bad options.",
    ],
    decisionTable: {
      title: "Local and cloud coding agent matrix",
      intro: "Use this matrix before giving an agent access to a real repository.",
      columns: ["Prefer local", "Prefer cloud", "Guardrail"],
      rows: [
        {
          label: "Data access",
          values: ["Sensitive files stay on the developer machine", "A clean repo snapshot is enough", "Do not expose secrets unless the workflow explicitly needs them"],
        },
        {
          label: "Task length",
          values: ["Short, interactive, or exploratory work", "Long-running branch work or background checks", "Require a clear completion report"],
        },
        {
          label: "Commands",
          values: ["Commands rely on local services or hardware", "Commands can run in an isolated Linux or hosted environment", "Separate read, write, network, and deploy permissions"],
        },
        {
          label: "Review",
          values: ["Developer reviews each step closely", "Team reviews a branch, PR, or artifact after completion", "Keep logs and changed files visible"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Classify the task",
        body: "Mark whether it needs local services, secrets, network access, or production data.",
      },
      {
        title: "Choose the smallest useful environment",
        body: "Prefer a limited local session or sandbox before giving a cloud agent broad repository access.",
      },
      {
        title: "Set the review path",
        body: "Decide whether the output is a diff, branch, PR, report, or checklist before the agent starts.",
      },
      {
        title: "Write down rollback",
        body: "For cloud work, make sure the branch can be closed and credentials can be revoked quickly.",
      },
    ],
    pitfalls: [
      {
        title: "Assuming cloud is automatically safer",
        fix: "Cloud isolation helps, but bad credentials or broad write access can still create damage.",
      },
      {
        title: "Running local agents with too much access",
        fix: "Limit files, shell commands, and network use for high-risk tasks.",
      },
      {
        title: "Skipping audit logs",
        fix: "Keep a record of prompt, tool calls, changed files, command output, and approval steps.",
      },
    ],
    internalLinks: [
      {
        slug: "agent-mode-vs-chat-mode-in-ide",
        anchor: "agent mode vs chat mode",
        reason: "Local and cloud choices usually come after deciding whether the assistant should act.",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        anchor: "agent governance checklist",
        reason: "Environment choice should follow the team's permission and audit rules.",
      },
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "secure MCP servers",
        reason: "MCP tools can change the risk profile of both local and cloud agents.",
      },
    ],
    checklist: [
      "Classify data sensitivity before choosing an environment.",
      "Use local agents for interactive, machine-specific tasks.",
      "Use cloud agents for isolated long-running tasks.",
      "Scope credentials and network access.",
      "Keep logs and changed files visible.",
      "Define rollback before deployment-related work.",
    ],
    evidence: [
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official reference for asynchronous coding agent workflows.",
      },
      {
        title: "Cloud and local sandboxes for GitHub Copilot",
        url: "https://github.blog/changelog/2026-06-02-cloud-and-local-sandboxes-for-github-copilot-now-in-public-preview/",
        publisher: "GitHub",
        note: "Official changelog for local and cloud sandbox behavior.",
      },
      {
        title: "VS Code agent mode",
        url: "https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode",
        publisher: "Microsoft",
        note: "Official local IDE agent mode reference.",
      },
    ],
    relatedArticleSlugs: ["github-copilot-cloud-local-sandboxes-preview", "github-copilot-vscode-agents-window-may-2026"],
    updatedAt: "2026-06-06",
    metaTitle: "Local vs Cloud AI Coding Agent",
    metaDescription:
      "Compare local and cloud AI coding agents by privacy, sandboxing, task length, commands, review flow, and team risk.",
  },
  {
    id: "guide-agent-governance-checklist",
    title: "Agent governance checklist for software teams",
    slug: "agent-governance-checklist-for-software-teams",
    summary:
      "A useful coding agent governance checklist covers identity, permissions, tool access, logs, human approval, sandboxing, cost limits, and incident response. Start with a small pilot before wider rollout.",
    intent: "Engineering leaders and platform teams want a one-page governance checklist for adopting AI coding agents.",
    audience: "Engineering managers, platform teams, security reviewers, and developer-experience teams rolling out coding agents.",
    pageType: "Governance checklist",
    secondaryKeywords: ["AI coding agent governance", "AI coding agent audit logs", "coding agent policy", "AI agent permissions checklist"],
    sections: [
      {
        heading: "Quick answer",
        body: [
          "Before a software team rolls out coding agents, decide who can use them, what tools they can call, what they may change, what needs approval, where logs are stored, and how to roll back bad changes. Governance is not paperwork; it is how the team keeps agent work reviewable.",
        ],
      },
      {
        heading: "Minimum governance set",
        body: [
          "Start with identity, permission tiers, allowed tools, approval rules, audit logs, sandbox policy, cost controls, and incident response. If any of these are missing, keep the rollout small.",
          "The first rollout should use low-risk repos, read-heavy tasks, and clear human review. Add write access only when the team can explain what happened after each agent run.",
        ],
      },
      {
        heading: "Good policy feels practical",
        body: [
          "A good policy tells developers what they can do today. It should not read like a legal memo. Use simple rules: which tasks are allowed, which tasks need approval, which data is off-limits, and which command or review proves the work is safe.",
        ],
      },
    ],
    recommendedPlay: [
      "Run a two-week pilot with one team, one repository, and a narrow set of agent permissions.",
      "Write approval rules before enabling write, deploy, external network, or production-data access.",
      "Review logs weekly during the pilot and update the policy from real incidents, not imagined edge cases.",
    ],
    decisionTable: {
      title: "Coding agent governance checklist",
      intro: "Use this as a first-pass policy map before enabling agents across a software team.",
      columns: ["Minimum rule", "Why it matters", "Launch gate"],
      rows: [
        {
          label: "Identity",
          values: ["Know which user, team, and repo started the agent", "Makes accountability possible", "Agent activity is tied to a user or service account"],
        },
        {
          label: "Permissions",
          values: ["Split read, write, command, network, and deploy access", "Limits damage when context is wrong", "High-risk actions need approval"],
        },
        {
          label: "Logs",
          values: ["Record prompt summary, tools, changed files, commands, and approvals", "Makes review and incident response possible", "Logs avoid secrets but keep useful traceability"],
        },
        {
          label: "Review",
          values: ["Require a human diff review before merge", "Agents can pass tests and still change the wrong thing", "No auto-merge for high-risk repos"],
        },
      ],
    },
    actionSteps: [
      {
        title: "Write the pilot boundary",
        body: "Choose one team, one repository type, allowed tasks, forbidden tasks, and a review owner.",
      },
      {
        title: "Create permission tiers",
        body: "Separate read-only, limited write, command execution, network access, and deployment paths.",
      },
      {
        title: "Define audit fields",
        body: "Record actor, repo, session, tools called, files changed, commands run, approval state, and final outcome.",
      },
      {
        title: "Review after two weeks",
        body: "Keep what developers actually used, remove confusing rules, and close gaps found in logs or reviews.",
      },
    ],
    pitfalls: [
      {
        title: "Starting with a company-wide rollout",
        fix: "Start with a small pilot so the policy learns from real work before it scales.",
      },
      {
        title: "Treating all tools as equal",
        fix: "A read-only docs lookup and a deploy command need different approval paths.",
      },
      {
        title: "Logging either too much or too little",
        fix: "Keep traceability, but do not store secrets or unnecessary private payloads.",
      },
    ],
    internalLinks: [
      {
        slug: "secure-mcp-servers-ai-coding-agents",
        anchor: "MCP security checklist",
        reason: "MCP permissions are one of the most common governance boundaries.",
      },
      {
        slug: "local-vs-cloud-ai-coding-agent",
        anchor: "local vs cloud AI coding agent",
        reason: "Environment choice affects permissions, logs, and rollback.",
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        anchor: "AGENTS.md template",
        reason: "Some governance rules should be visible inside repo instructions.",
      },
    ],
    checklist: [
      "Name the pilot team and repository scope.",
      "Separate read, write, command, network, and deploy permissions.",
      "Require approval for destructive or production-facing actions.",
      "Keep audit logs without storing secrets.",
      "Require human review before merging agent changes.",
      "Write an incident response path before broad rollout.",
    ],
    evidence: [
      {
        title: "GitHub Copilot coding agent",
        url: "https://docs.github.com/en/copilot/concepts/coding-agent/coding-agent",
        publisher: "GitHub",
        note: "Official reference for agentic coding workflows and review paths.",
      },
      {
        title: "Cursor Enterprise organizations",
        url: "https://cursor.com/changelog/enterprise-organizations",
        publisher: "Cursor",
        note: "Official product reference for organization-level governance controls.",
      },
      {
        title: "OWASP Top 10 for LLM Applications",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        publisher: "OWASP",
        note: "Security reference for common LLM application risks.",
      },
    ],
    relatedArticleSlugs: [
      "github-copilot-cloud-local-sandboxes-preview",
      "cursor-enterprise-organizations-governance",
      "visual-studio-agent-mode-mcp-general-availability",
    ],
    updatedAt: "2026-06-06",
    metaTitle: "Agent Governance Checklist for Software Teams",
    metaDescription:
      "A plain governance checklist for software teams adopting AI coding agents: permissions, logs, approval, sandboxing, and review.",
  },
];
