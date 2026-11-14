# Snoozle's Garden

A mobile-first page where Snoozle, a small creature, helps you check in, recharge and plan lighter days.
One static `public/index.html`, no build, no backend.

## Run locally

```sh
python3 -m http.server -d public 8000
```

Open <http://localhost:8000> (use your browser's device toolbar for phone widths). Any static server works;
serve over HTTP rather than opening the file directly. `public/_headers` (the CSP) only applies on Cloudflare Pages.

## Checks

Needs Node ≥ 20.6 and an installed Google Chrome. Run `npm install` once.

| Command | What it checks |
|---|---|
| `npm run gate:fast` | Docs links, size budget, copy, sprites, colour tokens (< 2 s) |
| `npm run gate` | `gate:fast` + browser flows at 320/390/460 px; run before every commit |
| `npm run perf` | Lighthouse on simulated Slow 4G; needs network for fonts |

## Docs

- [PLAN.md](PLAN.md): status and decisions.
- [ARCHITECTURE.md](ARCHITECTURE.md): how it's built.
- [CLAUDE.md](CLAUDE.md): agent brief and constraints.

## Built with Claude Code

Built in two days with [Claude Code](https://claude.com/claude-code): 70 of 71 commits are
co-authored by Claude. I set the goals, the constraints and the copy and reviewed every change;
Claude planned, built and tested inside them.

- [CLAUDE.md](CLAUDE.md) is the brief Claude works from: constraints, gates, lessons.
- [PLAN.md](PLAN.md) has every decision, dated.
- `npm run gate` runs before every commit.
- The workflow (skills, hooks, review gates) is in [claude-config](https://github.com/schen22/claude-config).

## License

[MIT](LICENSE).
