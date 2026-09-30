# VibeSlop Review

A small, deliberately silly React + TypeScript app: a fake code-review product for AI-generated slop. It has a queue of terrible PRs from fictional bots, a review screen with line comments, a leaderboard of the worst offenders, and settings that mostly do nothing.

## Run

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc -b && vite build
pnpm lint       # oxlint
```

Stack: Vite, React 19, TypeScript (strict), react-router v7, CSS Modules. No backend; state persists in `localStorage`.

## Routes

| Route | What's there |
|-------|--------------|
| `/` | Dashboard: stat tiles, Slop of the Day, 14-day trend, activity feed, Turbo Review Mode |
| `/queue` | Review queue: search, status chips, sort, pagination |
| `/review/:id` | Review detail: slop gauge, files with flagged lines, click-to-comment, Approve / Request changes / Reject |
| `/hall-of-slop` | Leaderboard of bots by average slop score |
| `/settings` | Profile form, review preference toggles, "Delete all slop" reset |
| anything else | 404 |
