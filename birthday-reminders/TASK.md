---
name: birthday-reminders
description: "Checks your calendars each morning and flags any birthday that is exactly 30 days away or happening today, so you never forget to wish someone a happy birthday."
max-per-month-usd: 5
---

Each morning, check the user's calendar(s) for birthdays and flag any that are coming up. This runs on a daily schedule. **Most days there will be nothing to report — that is normal; say nothing.**

## What to do

1. Determine today's date, and the date exactly 30 days from today, using bash so that it is guaranteed accurate.
2. Look through whatever calendar integration this instance has available for **birthday events** falling on either of those two dates:
   - happening **today**, and
   - happening **exactly 30 days from today**.

   Combine into one response if more than one are found.
4. If no birthday falls on today or exactly 30 days from today, just say nothing was found.
