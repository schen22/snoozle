# Snoozle's Garden — agent brief

A mobile-first web page where Snoozle, a small original creature, helps people who are burnt out or over-commit
check in, recharge and plan lighter days. One static `index.html`, no backend, on Cloudflare Pages (private repo).
Plan: [ARCHITECTURE.md](ARCHITECTURE.md). Status and decisions: [PLAN.md](PLAN.md).

## Start here

1. Read [PLAN.md](PLAN.md): what's now, and every decision so far.
2. Behaviour and copy: [Snoozle's Garden: Build Spec](https://claude.ai/artifact/9GVosVjYu739Cb4ncPLCQC)
   (a Claude Doc; read it with the Claude Docs tools, never web-fetch). Copy is final: use it exactly, curly quotes.
   Visual reference: [prototype](https://claude.ai/artifact/G8WajKiR8gzECqxB3Y7gGD). Spec wins over the prototype;
   [PLAN Decisions](PLAN.md#decisions) win over the spec.
3. How it's built: [ARCHITECTURE §2 Code layout](ARCHITECTURE.md#2-code-layout-inside-indexhtml).
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

- One `public/index.html` (the only page served, with `public/_headers`), inline CSS + vanilla JS. No framework, build, backend, accounts, analytics, or network calls
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

- Always hold a You Aren't Gonna Need It mentality. Do not overengineer. Never expand scope without permission.
- Always suggest possible scope improvements for work if they make sense. All work must be justifiable.
- Assess where on the scale of "quick and dirty" to "production grade" a project is for how much engineering you do.
  Snoozle today: a personal v1 on a public URL with no user data on the server. That puts it nearer quick than
  production: gates and the architecture rules, but no extra abstraction, config or tests beyond the spec's
  acceptance criteria.
- Always spin up a sub agent with minimal context using a cheap model, with the job of reviewing your changes, to
  sus out possible problems with fresh eyes. Brief it with the diff and the rules it touches only (no history),
  `model: "haiku"`, read-only, blockers only, ≤ 10 lines. This applies to every change, and it overrides the
  `delegate` skill's "separate reviewer only for risky tasks".

## Lessons

<!-- Dated, append-only. Sort with the ladder at end of session. -->
- 2026-10-28 · Measure the load budget before setting it: Nunito is one variable `woff2` (39 KB) for all three
  weights, so dropping weights saves nothing.
