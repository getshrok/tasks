---
name: news-watchlist
description: >
  Watches Google News for a personal list of topics and notifies only when a
  topic's release/availability criteria are actually met — not on announcements,
  trailers, or rumors.
skill-deps:
  - google-news
max-per-month-usd: 10
---

# News Watchlist

Check each topic in your watchlist against Google News. Notify only when the
criteria for that topic are met. Update `MEMORY.md` after every run.

This is a **pattern** — the watchlist at the bottom is yours to edit. The two
example topics show the shape: a couple of search queries plus a precise "notify
when" condition. The discipline is in the condition: notify on *availability*,
not on *news about* the thing.

## How to Run

The `last_checked` watermark lives in the self-contained `watermark.mjs` helper next to this file
(`WM=$SHROK_TASKS_DIR/news-watchlist/watermark.mjs`). Per-topic dedup (`fired_notifications`)
lives in `MEMORY.md`.

1. Capture `now=$(node "$WM" now)`. Read the watermark `last=$(node "$WM" get)` and the
   `fired_notifications` per topic from `MEMORY.md`. If `last` is `never` (first run), set the
   baseline (`node "$WM" set "$now"`) and stop.
2. For each topic in the watchlist below, search Google News (use the `google-news` skill,
   passing `--since "$last"` so the search is windowed to what's new).
3. Evaluate results against that topic's criteria. Use judgment — read snippets,
   and `web_fetch` the article URL if a snippet is ambiguous.
4. For any topic that qualifies:
   - Check `fired_notifications` for that topic — if this exact event was already
     notified, skip it.
   - Otherwise: print a notification and record it in `fired_notifications` (`MEMORY.md`).
5. **Only after all topics are processed successfully**, commit: `node "$WM" commit "$now"`.
   On any failure, do not commit (the next run re-covers the window).

## Notification Format

If nothing qualifies across all topics, print:
```
✓ News watchlist ran — nothing new to report.
```

## Evaluation Rules

**Default to NO notification.** The bar is: would you want to know about this right now?

- An article must be evidence the FULL thing is **actually available** — released,
  in theaters, streaming now, playable now. Double-check to avoid false positives.
  For episodic media, the season/run must be **complete** to qualify.
- Announcements, trailers, casting, production updates, delays, rumors = SKIP.
- If multiple articles confirm the same event, one notification is enough.
- For recurring topics: check `fired_notifications` — if the event description
  already appears there (e.g. "Season 3 released"), skip it even if new articles
  exist about it.

---

## Watchlist

> Replace these examples with the things you actually care about. Each topic is a
> name, one or more search queries, and a precise "Notify when" condition.

**Example — a specific movie**
- Queries: `"Some Movie" release` / `"Some Movie" streaming`
- Notify when: the film is confirmed in theaters or streaming — actually watchable now.

**Example — a recurring TV series**
- Queries: `"Some Show" new season streaming` / `"Some Show" season release`
- Notify when: a new season is confirmed fully available to stream right now
  (notify once per season, then record it and wait for the next).
