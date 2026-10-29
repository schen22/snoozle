# Snoozle's Garden — plan

Milestones **M0 Plan** → **M1 Shell** → **M2 Care** → **M3 Moves** → **M4 Thoughts**
([ARCHITECTURE §8](ARCHITECTURE.md#8-milestones)).

## Now

- [ ] M1 Shell — `index.html` from the prototype, tokens, scene, Home + menu + Back, dialog, clock,
      `spec/copy.json`, gates (`budget.mjs`, copy check, puppeteer flows), first Pages deploy, `npm run perf`.

## Next

- [ ] **Sarah:** push the repo (no `origin` yet; `schen22/snoozle` doesn't exist on GitHub as of 2026-10-29):
      `gh repo create schen22/snoozle --private --source=. --remote=origin --push`.
- [ ] **Sarah:** connect Cloudflare Pages to `schen22/snoozle` (Workers & Pages → Create → Pages → Connect to Git;
      build command none, output directory `/`).
- [ ] **Sarah:** rename the folder `~/Documents/projects/greninja` → `snoozle` (`mv`), then start new sessions there.
- [ ] Update the spec doc for the decisions below (no renaming, storage, accessibility deferred, menu morph).

## Later

- **v2: Export and load** ([ARCHITECTURE: Export and load](ARCHITECTURE.md#export-and-load)), first after v1 ships:
  - Today export: Markdown moments + `SNZ1.` Garden Code; Load restores it.
  - Thoughts and friendship export: every logged thought by date + friendship line, read-only, no code.
  - Thought log (v2 fact), Share / Copy / Download, copy drafted by Claude for Sarah ([Q11](ARCHITECTURE.md#10-open-questions)).

- Keep state and memory between visits without a code: options are a date-keyed `localStorage` mirror (~10 lines,
  one device), then user sessions with server storage (Cloudflare Worker + D1 or KV, a login, a privacy note for
  stored thoughts). Not needed now (Sarah, 2026-10-29); Export/load covers it.

- Accessibility pass from the spec: screen-reader labels, focus ring and focus moves, WCAG AA contrast in both themes.
- **Moves by weather (pattern tracking):** keep a per-day record (`date`, `sky`, moves taught / used / saved /
  let go) to see how many moves a day each weather actually holds, then suggest the usual from it ("We usually
  carry about three"). Needs history across days, so it follows v2 Export/load or server state; on-device only,
  shown as Snoozle's words, never as charts or numbers (P2). Replaces the spec's "learn the usual" idea.
- Spec "Later ideas": big/small moves, hide the stepper, "Not sure?" sky helper.
- Self-host fonts if `npm run perf` misses the budget ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)).

## Done

- 2026-10-29 — M0 Plan: all open questions answered; ARCHITECTURE approved.
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
- 2026-10-28 — Expert panel on ARCHITECTURE.md (10 experts; Database and API swapped for State & data and
  Mobile web): round 1 **84.2** → round 2 **90.7**. Fixed: DOM helper + static skeletons (no `innerHTML`,
  focus kept), storage validation / `storage` event / unknown-version guard, public-site warning + `_headers`
  CSP + Access option, zero-console-error gate, `copy.json` placeholder rule, iOS keyboard and tab-discard risk.
  Lowest after round 2: UX 88, because a refresh wipes the day (accepted risk, [Q3](ARCHITECTURE.md#10-open-questions)).
- 2026-10-28 — Perf check is local `npx lighthouse`, not PageSpeed Insights (keyless API hit a shared daily quota).
- 2026-10-29 — Animation expert + game design engineer reviewed the animation audit and the state model:
  round 1 **76 / 72** → round 2 **91 / 90**. Changes: state holds facts only, with water/N/stage/heavy/friendship derived;
  `act()` pipeline diffs before/after to choose effects; friendship = distinct acts (Q9); moves get ids;
  thought → screen keeps the thought's line; `newDay` cancels sheets, typer and animations; nested motion groups
  with reaction priority (relief > sit > hop) and Web Animations one-shots; strain softened (Q10); typer no longer
  spams `aria-live`; dim lightning.
- 2026-10-29 — **Prototype sprites kept as drawn** ([reference/prototype.html](reference/prototype.html)); a gate check in M1
  fails if any SVG shape changes without updating the reference.
- 2026-10-29 — Sarah's calls: **Cloudflare Pages**; **public page, private repo**, no Access; keep Snorlax/Ditto for
  now; **cut the menu morph**; a refresh wiping the day is fine.
- 2026-10-29 — **Export and load instead of stored state** (M5): one Markdown export with a `SNZ1.` Garden Code on its
  last line, pasted back to restore friendship, thoughts, Future moves and (same day) today. Reuses the dragons
  Dispatch Code. Accounts and server state go to Later.
- 2026-10-29 — Yes to Q9 (friendship = distinct acts, all 6 lines kept), Q10 (softened strain), Q11 (Claude drafts
  export copy, Sarah approves).
- 2026-10-29 — **Second export, "Thoughts and friendship"**: every logged thought by date plus the friendship line
  reached, read-only with no code, so it can be shared safely. Thought log cap raised 60 → 100 (code ≤ ~37 KB).
- 2026-10-29 — **Export and load moved to v2** (both exports and Load): not needed for v1. v1 = M1–M4; v1 keeps
  no thought log, and friendship resets daily.
- 2026-10-29 — Q2: `usual` not stored, resets to 4 daily; pattern tracking of moves by weather goes to Later.
  Q4: keep "about four". Q6: no support link.
