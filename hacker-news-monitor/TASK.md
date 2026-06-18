---
name: hacker-news-monitor
description: >
  Checks Hacker News top stories on a schedule and notifies when a story passes
  strict scale and usability criteria. Designed to surface only truly significant,
  immediately actionable tech news — not research, politics, or corporate drama.
max-per-month-usd: 5
---

# Hacker News Monitor

Fetch Hacker News top stories, apply a strict filter, and print anything that
passes. Default to silence — noise is worse than missing a story.

## How to Run

The `last_checked` watermark lives in the self-contained `watermark.mjs` helper next to this file
(`WM=$SHROK_TASKS_DIR/hacker-news-monitor/watermark.mjs`). The `notified_ids` dedup list stays in
`MEMORY.md`. (Dedup here is by story ID, not by timestamp — the watermark is just a run record.)

1. Capture `now=$(node "$WM" now)`.

2. Fetch top story IDs:
   `https://hacker-news.firebaseio.com/v0/topstories.json`

3. Fetch details for the top 10 stories:
   `https://hacker-news.firebaseio.com/v0/item/ID.json`
   Fields to use: `title`, `url`, `score`, `descendants` (comment count), `id`

4. Read `notified_ids` from `MEMORY.md` — skip any story already seen. Apply filter criteria.

5. For stories that pass: print notification and append the story `id` to `notified_ids` in `MEMORY.md`.

6. **At the end of a successful run**, commit: `node "$WM" commit "$now"`.

## Filter Criteria

**DEFAULT TO REJECT.** Only pass stories meeting ALL of the following:

### HARD BLOCKS — never notify, no exceptions:
- Politics, government, military, geopolitics, world events
- Corporate funding rounds, IPOs, acquisitions, valuations
- Executive appointments, leadership changes, company drama
- Research papers or academic breakthroughs (unless immediately usable today)
- Manufacturing, logistics, supply chain news
- Obituaries or retrospectives

### MUST PASS BOTH:

**SCALE TEST** — Does this affect millions of users or developers?
- A new major language/framework release: yes
- A significant breach or outage affecting a platform millions use: yes
- A niche library update: no
- A tool used by thousands but not millions: no

**USABILITY TEST** — Can I use or benefit from this RIGHT NOW, today?
- New model or API available to use: yes
- Security patch I should apply now: yes
- Research paper about future capabilities: no
- Announcement of something coming soon: no

### SCORE FLOOR:
- Story score should be 200+ as a baseline signal. Can override for something
  exceptional, but below 100 almost never passes.

## Notification Format

```
🔥 [Story Title]
[URL]
Score: [score] | Comments: [comment count]
```

If nothing passes:
```
✓ HN checked — nothing worth surfacing.
```

## State

- `last_checked` — run timestamp, managed by `watermark.mjs` (do **not** write it in `MEMORY.md`).
- `notified_ids` (in `MEMORY.md`) — append the HN story `id` (integer) for each notified story.
  Use story IDs (not titles) for dedup — they're stable and compact.

## Tuning

Adjust the score floor and the SCALE/USABILITY bars to taste. Lower the floor if
HN is too quiet for you; raise it if you get too many notifications.
