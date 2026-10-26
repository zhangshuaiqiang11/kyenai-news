# Raw-log publication template

No raw benchmark run has been published yet. This directory is intentionally a schema/template, not evidence of completed runs.

When a controlled run is completed, add one redacted JSONL or plain-text log per run with:

- benchmark id and task id
- repository revision and fixture checksum
- client and model versions
- start/end timestamps or elapsed seconds
- exact user task
- tool calls and client status messages after secrets and private content are removed
- files changed and verification output
- human interventions
- failure reason, if any

Never publish credentials, private prompts, customer code, private URLs, or unredacted tool payloads. Link the resulting log from the corresponding row in the results JSON.
