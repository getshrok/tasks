---
name: birthday-reminders
description: "Checks your calendars each morning and flags any birthday that is exactly 30 days away or happening today, so you never forget to wish someone a happy birthday."
max-per-month-usd: 5
---

Each morning, check the user's calendar(s) for birthdays and flag any that are coming up. This runs on a daily schedule. **Most days there will be nothing to report — that is normal; say nothing.**

## What to do

1. Determine today's date, and the date exactly 30 days from today, in the user's local timezone.
2. Look through whatever calendar integration this instance has available (e.g. `zoho-calendar`, or any other connected calendar) for **birthday events** falling on either of those two dates:
   - happening **today**, and
   - happening **exactly 30 days from today**.

   A birthday event is typically an all-day, yearly-recurring event whose title mentions a birthday (e.g. "Lisa's Birthday", "🎂", "bday"). Some calendars also have a dedicated Birthdays calendar — include it if present.
3. Report what you find:
   - 30 days out: `🎂 Heads up — Lisa's birthday is in 30 days (May 4).`
   - Today: `🎂 Today is Lisa's birthday! Don't forget to wish her a happy birthday.`

   Combine into one short message if more than one lands on the same run.
4. If no birthday falls on today or exactly 30 days from today, **produce no output and send nothing.** Silence is the correct result on a quiet day.

## How to deliver

Write the reminder as your **task output** — it routes to the user automatically. Do **not** message the birthday person or anyone other than the user, and do not use email, Zoho Cliq, or any send script — task output only. (SMS delivery may come in a later version.)

## Notes

- Match birthdays on month and day, not year.
- This task is intentionally simple and stateless: it runs once daily and matches on the *exact* day (today and today + 30), so each birthday naturally surfaces once at 30 days out and once on the day — no tracking file needed.
- Always use the user's local timezone to decide what "today" is.
