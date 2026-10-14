#!/usr/bin/env python3
"""Build the versioned AGENTS.md template starter ZIP with a deterministic manifest."""

from __future__ import annotations

import hashlib
import json
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend/public/resources/instruction-files"
OUTPUT = SOURCE / "kyenai-agents-md-starter-pack.zip"
TEMPLATES = ["AGENTS.md", "AGENTS.node.md", "AGENTS.python.md", "AGENTS.monorepo.md"]

README = """# KyenAI AGENTS.md Starter Pack

Version: 1.0.0
License: MIT
Canonical guide: https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents

## Choose a template

- `AGENTS.md`: concise repository-root baseline.
- `AGENTS.node.md`: Node.js package scripts, tests, build, and generated-file rules.
- `AGENTS.python.md`: virtual environment, pytest, formatting, and migration rules.
- `AGENTS.monorepo.md`: root policy plus app/package boundaries and focused verification.

## Example repository structure

```text
repository/
├── AGENTS.md
├── apps/
│   └── web/
│       └── AGENTS.md
└── packages/
    └── shared/
```

Copy one template to the repository root as `AGENTS.md`, replace placeholders, and keep the verification commands runnable. Use nested `AGENTS.md` files only for genuine local exceptions.

Run `python3 verify_pack.py` from the unpacked directory to verify checksums and required sections.
"""

LICENSE = """MIT License

Copyright (c) 2026 KyenAI

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
"""

VERIFY = """#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
for item in manifest["files"]:
    path = root / item["path"]
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    assert digest == item["sha256"], f"checksum mismatch: {item['path']}"
    if item["path"].endswith(".md") and item["path"].startswith("templates/"):
        text = path.read_text(encoding="utf-8")
        assert "## Verification" in text, f"missing Verification section: {item['path']}"
print(f"Verified {len(manifest['files'])} files from KyenAI AGENTS.md Starter Pack v{manifest['version']}.")
"""


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="kyenai-agents-pack-") as temp_name:
        temp = Path(temp_name)
        templates = temp / "templates"
        templates.mkdir()
        for name in TEMPLATES:
            (templates / name).write_bytes((SOURCE / name).read_bytes())
        (temp / "README.md").write_text(README, encoding="utf-8")
        (temp / "LICENSE").write_text(LICENSE, encoding="utf-8")
        (temp / "verify_pack.py").write_text(VERIFY, encoding="utf-8")
        files = sorted(path for path in temp.rglob("*") if path.is_file())
        manifest = {
            "name": "KyenAI AGENTS.md Starter Pack",
            "version": "1.0.0",
            "license": "MIT",
            "generatedAt": "2026-07-30",
            "canonicalUrl": "https://www.kyenai.com/guides/agents-md-template-for-ai-coding-agents",
            "files": [{"path": str(path.relative_to(temp)), "sha256": sha256(path)} for path in files],
        }
        (temp / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for path in sorted(temp.rglob("*")):
                if path.is_file():
                    archive.write(path, path.relative_to(temp))
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    main()
