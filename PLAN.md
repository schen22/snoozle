# Snoozle's Garden — plan

Milestones **M0 Plan** → **M1 Shell** → **M2 Care** → **M3 Moves** → **M4 Thoughts**
([ARCHITECTURE §8](ARCHITECTURE.md#8-milestones)).

## Now

- [ ] M0 · Sarah reviews [ARCHITECTURE.md](ARCHITECTURE.md) and answers its [open questions](ARCHITECTURE.md#10-open-questions).

## Next

- [ ] M1 Shell — `index.html` from the prototype, tokens, scene, Home + menu + Back, dialog, clock,
      `spec/copy.json`, gates (`budget.mjs`, copy check, puppeteer flows), first Pages deploy, `npm run perf`.
- [ ] **Sarah:** connect Cloudflare Pages to `schen22/snoozle` (Workers & Pages → Create → Pages → Connect to Git;
      build command none, output directory `/`).
- [ ] **Sarah:** rename the folder `~/Documents/projects/greninja` → `snoozle` (`mv`), then start new sessions there.
- [ ] Update the spec doc for the decisions below (no renaming, storage, accessibility deferred, menu morph).
- [ ] Export today (spec Backlog, next up after M4).

## Later

- Accessibility pass from the spec: screen-reader labels, focus ring and focus moves, WCAG AA contrast in both themes.
- Spec "Later ideas": learn the usual, big/small moves, hide the stepper, "Not sure?" sky helper.
- Self-host fonts if `npm run perf` misses the budget ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)).

## Done

- 2026-10-28 — M0 docs: `CLAUDE.md`, `PLAN.md`, `ARCHITECTURE.md`, docs gate; spec doc renamed to Snoozle's Garden.

## Decisions

<!-- Dated, append-only. -->
- 2026-10-28 — Name is **Snoozle** everywhere; spec doc retitled "Snoozle's Garden: Build Spec" (was "Sprig's Garden").
- 2026-10-28 — **No renaming** of Snoozle in v1 (Sarah: not convinced it's needed).
- 2026-10-28 — **Stored state: Future moves only**, in `localStorage`; they carry to the next day. Name, friendship,
  usual and the day are memory-only. Friendship is seen only as the one-line text and a 💞 burst, and its 6
  lines are reachable in a day, so it resets daily. Anything else a person wants to keep goes through Export.
- 2026-10-28 — **Accessibility section deferred** to Later (Sarah). Kept because free: real `<button>`s,
  `aria-live` dialog, `prefers-reduced-motion`.
- 2026-10-28 — Load time is a gated budget ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)).
- 2026-10-28 — Hosting: private GitHub repo `schen22/snoozle`, deployed by Cloudflare Pages ($0).
- 2026-10-28 — Animations audited ([ARCHITECTURE §6](ARCHITECTURE.md#6-animation-audit)); menu morph cut ★ pending Sarah.
