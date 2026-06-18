<h1><img src="logo.svg" width="32" height="32" /> Task templates for Shrok</h1>

Ask your Shrok to install a task template by name (mention this repo explicitly for best results), or place one of the task template folders above into ~/.shrok/workspace/tasks. Then edit it to suit your needs

## Available task templates

| Task Template | Description |
|-------|-------------|
| morning-briefing | Daily briefing (scheduled — calendar, priorities, context) |
| email-digest | Digest of new mail in an inbox since the last run (skips marketing noise) |
| delivery-watch | Watches inbox(es) for package-delivery confirmations |
| news-watchlist | Notifies when topics on a personal watchlist actually become available |
| hacker-news-monitor | Surfaces only truly significant, immediately actionable HN stories |
| anime-season-watch | Recommends finished-season anime worth binging, by quality criteria |

## The watermark helper

Several feed-monitoring templates ship a self-contained `watermark.mjs` next to their `TASK.md`.
It tracks a single "last successfully processed" timestamp in a `watermark.json` beside it, in a
consistent local-offset format, and advances **only after a run succeeds** — so a failed run
re-covers its window on the next run (a duplicate is always preferred over a miss). Tasks call it
as `node watermark.mjs now|get|set <ts>|commit <ts>`; no task name, env var, or shared module
needed. Reuse it when you build your own feed monitor.

## Contributing

Each task template is a directory with a `TASK.md` and optional scripts. See the [tasks skill](https://github.com/getshrok/shrok/blob/main/skills/tasks/SKILL.md) for best practices. If you have a task template to contribute, feel free to open a PR.
