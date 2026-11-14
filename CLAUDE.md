# Snoozle's Garden — agent brief

A mobile-first web page where Snoozle, a small original creature, helps people who are burnt out or over-commit
check in, recharge and plan lighter days. One static `index.html`, no backend, on Cloudflare Pages (public repo).
Plan: [ARCHITECTURE.md](ARCHITECTURE.md). Status and decisions: [PLAN.md](PLAN.md). Run locally: [README.md](README.md).

## Start here

1. Read [PLAN.md](PLAN.md): what's now, and every decision so far.
2. Behaviour and copy: [Snoozle's Garden: Build Spec](https://claude.ai/artifact/9GVosVjYu739Cb4ncPLCQC)
   (a Claude Doc; read it with the Claude Docs tools, never web-fetch). Copy lives in [`public/js/copy.js`](public/js/copy.js) (source of truth; curly quotes).
   Visual reference: [prototype](https://claude.ai/artifact/G8WajKiR8gzECqxB3Y7gGD). Spec wins over the prototype;
   [PLAN Decisions](PLAN.md#decisions) win over the spec.
3. How it's built: [ARCHITECTURE §2 Code layout](ARCHITECTURE.md#2-code-layout).
4. Docs check: `npm run gate:fast`. Full check before commit: `npm run gate`.

## Success rubric (the spec's design principles)

| # | Every change must keep this true |
|---|---|
| P1 | Every tap gets immediate, visible feedback. Nothing changes silently. |
| P2 | No numbers or scorekeeping shown (only N, B and the usual stepper). |
| P3 | Soft limits: going over is shown, never blocked. |
| P4 | Doing less earns the warmest reaction; moves never grow the garden. |
| P5 | Every weather is equally valid. |
| P6 | Companion, not coach: "we", no "should", nothing clingy. |
| P7 | Missing a day costs nothing. |

## Constraints

- Static files in `public/` ([ARCHITECTURE §2](ARCHITECTURE.md#2-code-layout)): `index.html`, `css/`, ES modules in `js/`, `_headers`. Vanilla JS and CSS. No framework, build, backend, accounts, analytics, or network calls
  beyond Google Fonts. No new dependency without a named need (dev-only `puppeteer-core` is the one allowed).
- Stored: Future moves only (`localStorage` `snoozle:v1`). Nothing else persists in v1; export and load are v2 ([ARCHITECTURE: Export and load](ARCHITECTURE.md#export-and-load)).
- Load: ≤ 20 KB brotli HTML, LCP ≤ 2.0 s on Slow 4G ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)).
- Mobile first: no horizontal scroll from 320 px, tap targets ≥ 44 px, inputs 16 px, safe-area padding.
- Sprites: keep the prototype's SVG shapes as drawn ([reference/prototype.html](reference/prototype.html)); redraws are deliberate.
- Animation: loops are CSS classes, one-shots `el.animate()`; state never waits on an animation ([ARCHITECTURE §6](ARCHITECTURE.md#6-animation-audit)).
- User text goes into the page with `textContent`, never `innerHTML`.
- Not in v1: renaming, the spec's accessibility section ([PLAN Later](PLAN.md#later)).
- No screenshots in helpers; compare computed values. Visual sign-off is Sarah's.

## Working rules

YAGNI is global (`~/.claude/CLAUDE.md`, stakes in `working-model`); reviews follow `review-gates` (Gate 1 inline,
a Sonnet reviewer for risky JS changes).
Where Snoozle sits on that scale: a personal v1 on a public URL with no user data on the server, so nearer
quick than production. It gets gates and the architecture rules, but no extra abstraction, config or tests
beyond the spec's acceptance criteria.

## Lessons

<!-- Dated, append-only. Sort with the ladder at end of session. -->
- 2026-10-28 · Measure the load budget before setting it: Nunito is one variable `woff2` (39 KB) for all three
  weights, so dropping weights saves nothing.
- 2026-10-29 · Lane M1 hit 158k tokens in 16 tool calls before writing any gate. Its brief had two big items
  (restructure the 789-line prototype + five gate scripts), and each rewrite of the whole file rode along on
  every later step. One item per helper here, and gate scripts in their own lane.
- 2026-10-29 · Chrome (puppeteer) can't start inside the Claude Code sandbox: run `node test/flows.mjs` /
  `npm run gate` with the sandbox off (approved for test commands only); say so in every lane brief.
- 2026-10-29 · The static-checks lane used 75k reading the 24 KB spec. Copy now lives in `public/js/copy.js`, so
  lanes read that (188 lines), never the spec doc, for wording.
- 2026-10-29 · Lanes that own different files ran side by side cleanly (copy lane + design review); everything in one
  `index.html` forced serial work. Split by file before parallelising.
- 2026-10-29 · Flow tests hardcode some copy: a copy-only edit to `moves.bye` passed `gate:fast` but failed
  `npm run gate` (`test/flows.mjs:411` expected the old line). After any copy change, grep `test/` for the old
  string and run the full gate, until the tests read from `COPY`.
- 2026-10-29 · The lesson above (split by file) was on the page but not used: the six-cards change was planned as
  serial work until Sarah asked. When writing a plan table, give each step its owned files and mark which can run
  as parallel lanes.
- 2026-10-29 · Time load speed with `npm run perf` (Lighthouse), never puppeteer's network/CPU throttling: a throttled
  first-tap flow took 43–57 s even on the old one-file page, while every file had loaded by ~6 s.
