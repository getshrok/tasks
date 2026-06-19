---
name: birthday-reminders
description: "Reminds the user about upcoming birthdays — about a month ahead and again on the day — so they never forget to wish someone a happy birthday."
max-per-month-usd: 5
---

Remind the user about upcoming birthdays so they never forget to reach out. This task runs on a daily schedule. **Most days there will be nothing to send — that is normal and correct.**

## Where the data lives

All data lives in `MEMORY.md` in this task directory. It has two sections:

- **Birthdays** — a list of people, one per line, as `- Name — MM-DD` (append ` (YYYY)` if the birth year is known and you want to mention age).
- **Notification log** — a record of what you have already sent this year, so the same reminder is never sent twice. Format: `- Name — YYYY — one-month` or `- Name — YYYY — day-of`.

**If `MEMORY.md` does not exist yet** (fresh install), treat the birthday list as empty and send nothing. Create `MEMORY.md` with those two sections the first time the user asks to add a birthday (or the first time you need to write a log entry). Adding a birthday is just appending a line to the Birthdays section.

## What to do on each run

1. Determine today's date in the user's local timezone.
2. For each person in the Birthdays list, check two triggers:
   - **One month ahead** — their birthday falls within roughly the next month (about 30 days out) AND you have not already logged a one-month heads-up for them this year. This is a window on purpose: if a daily run is ever missed, the next day still catches it. Send it once per year.
   - **Day of** — today is their birthday AND you have not already logged a day-of reminder for them this year.
3. If anyone triggered, compose **one** message covering everyone who triggered today — do not send a separate message per person. Skip everyone who didn't trigger.
4. If nobody triggered today, **produce no output and send nothing.** Do not pad, do not send an "all clear." Silence is the correct result on a quiet day.
5. After sending, update the **Notification log** in `MEMORY.md` (name, year, and which trigger fired) so it is not repeated.

## How to deliver

Write the reminder as your **task output** — it routes to the user automatically.

**Do NOT message the birthday person, and do NOT message anyone other than the user.** This reminder is for the user themselves. Do not use email, Zoho Cliq, or any outbound messaging script to send it — task output only. (SMS delivery is planned for a later version; for now, plain task output is the only channel.)

## Tone / format

Warm and brief. Examples:

- One month ahead: `🎂 Heads up — Lisa's birthday is about a month away (May 4). Good time to plan if you want to do something for her.`
- Day of: `🎂 Today is Lisa's birthday! Don't forget to wish her a happy birthday.`

If a one-month heads-up and a day-of land on the same run (for different people), combine them under one short message.

## Date handling

- Match on **month and day**, not year.
- Leap-day birthdays (`02-29`): in non-leap years, treat Feb 28 as the day-of.
- Always use the user's local timezone to decide what "today" is.
