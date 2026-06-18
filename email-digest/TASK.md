---
name: email-digest
description: >
  Checks an email inbox for new messages since the last run and delivers a digest
  of anything worth your attention, skipping obvious marketing noise.
skill-deps:
  - gmail
max-per-month-usd: 10
---

# Email Digest

Check the configured inbox for new emails since last time checked, and provide a
digest. You can ignore obvious marketing emails — keep anything that genuinely
matters (personal mail, bills, security alerts, things you'd want to act on).

> **Configure me:** set the inbox you want to monitor. With the `gmail` skill,
> select the account with `--account <alias>` (the skill manages credentials — this
> task never handles secrets directly). To monitor more than one inbox, copy this
> task into a second directory with its own name (the watermark is per-directory),
> or run the digest once per account.

## Watermark

The "since last time" window is tracked by the self-contained `watermark.mjs` helper next to this
file (`WM=$SHROK_TASKS_DIR/email-digest/watermark.mjs`) — it enforces the timestamp format and the
advance-only-on-success rule.

1. Capture `now=$(node "$WM" now)` at the start; read `last=$(node "$WM" get)`.
2. Use `last` as the Gmail `--since`. If `last` is `never` (first run), set the baseline
   (`node "$WM" set "$now"`) and stop — no backlog digest.
3. **Only after the digest is produced**, commit: `node "$WM" commit "$now"`. On any failure,
   don't commit — the next run re-covers the window.

## What to report

A digest, not a dump. Group by importance, lead with anything time-sensitive
(bills due, appointments, security alerts), and summarize the rest in a line or
two. If nothing arrived worth mentioning, say so in one line.
