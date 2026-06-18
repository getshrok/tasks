---
name: anime-season-watch
description: >
  Checks MyAnimeList for the just-finished anime season and identifies shows
  worth binging based on strict quality criteria.
max-per-month-usd: 5
---

# Anime Season Watch

Check MyAnimeList for the just-finished anime season and identify shows worth
binging based on strict quality criteria. Output a list of the new seasons/arcs.

## How to Run

1. Determine which season just ended based on today's date:
   - Mid-Jan → Fall season (Oct-Dec of previous year)
   - Mid-Apr → Winter season (Jan-Mar)
   - Mid-Jul → Spring season (Apr-Jun)
   - Mid-Oct → Summer season (Jul-Sep)

2. Fetch the MAL seasonal page:
   `https://myanimelist.net/anime/season/YEAR/SEASON`
   e.g. `https://myanimelist.net/anime/season/2026/winter`
   Season values: `winter` `spring` `summer` `fall`

3. If MAL is inaccessible, fall back to:
   - `https://anilist.co/search/anime?season=SEASON&seasonYear=YEAR&sort=SCORE_DESC`
   - Or web search: `best anime [season] [year] finished ranked`

4. For each show in the season, apply the filter criteria below.

5. Output recommendations (see format below) and update `MEMORY.md` so you don't
   re-recommend the same season next run.

## Filter Criteria

**Default to SKIP.** Only recommend shows that meet at least one ACCEPT condition
and none of the REJECT conditions. Edit these to match your own taste — the ones
below are an opinionated starting point.

### ACCEPT (season must be fully finished — all episodes aired):

1. **Sakuga / Exceptional Animation**
   - Studio reputation: ufotable, MAPPA, Wit Studio, Bones, Trigger
   - Community buzz around animation quality, sakuga clips

2. **Horror / Dark Fantasy / Psychological**
   - Themes: horror, psychological thriller, dark fantasy, seinen, disturbing

3. **High Buzz — Dominant Community Presence**
   - High score with high member count
   - "Anime of the season" contender
   - Phrases in community discussion: "must watch", "masterpiece", "peak fiction",
     "anime of the year"

### REJECT:

- Low-effort isekai (unless exceptional buzz or animation)
- Slice of life (unless generating massive buzz)
- Sports anime (unless exceptional)
- Shorts (under 10 min episodes)
- Recap/compilation entries

## Output Format

For each recommended show:
```
📺 [Title]
Studio: [studio] · [genres]
[1–2 sentence reason it cleared the bar]
```

If nothing clears the bar:
```
✓ Season checked — nothing worth recommending.
```

## State

`MEMORY.md` records the last season you reported on, so a scheduled run that fires
mid-season doesn't re-recommend shows you've already seen.
