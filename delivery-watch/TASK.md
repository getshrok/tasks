---
name: delivery-watch
description: >
  Watches one or more email inboxes for package-delivery confirmations and reports
  what actually arrived.
skill-deps:
  - gmail
max-per-month-usd: 10
---

# Delivery Watch

Check your configured inbox(es) for new delivery notifications using the Gmail
skill's `--since` parameter for server-side filtering.

> **Configure me:** list the inbox(es) to check below. With the `gmail` skill,
> select each account with `--account <alias>` (the skill manages credentials —
> this task never handles secrets directly).
>
> Inboxes to check:
> - `you@example.com`
> - (add more as needed)

## Instructions

The watermark is managed by the self-contained `watermark.mjs` helper next to this file
(`WM=$SHROK_TASKS_DIR/delivery-watch/watermark.mjs`); it enforces the timestamp format
(local offset, never UTC `Z`) and the advance-only-on-success rule.

1. Capture the run start: `now=$(node "$WM" now)`. Read the watermark: `last=$(node "$WM" get)`.
   If `last` is `never` (first run), set the baseline (`node "$WM" set "$now"`) and stop.
2. Use the Gmail skill with `--since "$last"` (the API filters server-side — no manual filtering).
   Query each configured inbox for keywords like "delivered", "has been delivered",
   "delivery complete".
3. Report ONLY emails returned by the API. Focus on actual delivery *confirmations* — exclude
   "out for delivery", "order confirmed", "shipment pending", etc. For each, include sender,
   delivery timestamp, and what was delivered.
4. **Only after the report succeeds**, commit: `node "$WM" commit "$now"`. On any failure, do not
   commit — leave the watermark so the next run re-covers the window.

## Output

```
📦 [what was delivered] — delivered [time]
   from [sender]
```

If nothing was delivered:
```
✓ Delivery watch ran — nothing delivered since last check.
```
