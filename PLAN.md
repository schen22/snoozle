# Snoozle's Garden — plan

Milestones **M0 Plan** → **M1 Shell** → **M2 Care** → **M3 Moves** → **M4 Thoughts**
([ARCHITECTURE §8](ARCHITECTURE.md#8-milestones)).

## Now

- [ ] **Sarah:** play v1 on a phone at the Pages URL; visual sign-off. Also check Snoozle against a light sky
      (thicker outline + ground shadow) and the new screen layout; then decide on a darker patch behind him.

## Next

- [ ] **Sarah:** push the repo (no `origin` yet; `schen22/snoozle` doesn't exist on GitHub as of 2026-10-29):
      `gh repo create schen22/snoozle --private --source=. --remote=origin --push`.
- [ ] **Sarah:** connect Cloudflare Pages to `schen22/snoozle` (Workers & Pages → Create → Pages → Connect to Git;
      build command none, output directory `public`).
- [ ] **Sarah:** rename the folder `~/Documents/projects/greninja` → `snoozle` (`mv`), then start new sessions there.
- [ ] Update the spec doc for the decisions below (no renaming, storage, accessibility deferred, menu morph,
      moves cap counts used moves, new "Used it" line, screen titles cut, Back top + bottom, Moves order,
      Thoughts opening line and hints, one Back + back gesture, Moves copy said once, Recharge/Thoughts hints cut).
- [ ] `test/flows.mjs` takes expected copy from `COPY` (load [`copy.js`](public/js/copy.js)) instead of ~15 literal
      strings, so a copy edit doesn't break tests (2026-10-29 voice pass: 3 failures, one already stale).

## Later

- **v2: Export and load** ([ARCHITECTURE: Export and load](ARCHITECTURE.md#export-and-load)), first after v1 ships:
  - Today export: Markdown moments + `SNZ1.` Garden Code; Load restores it.
  - Thoughts and friendship export: every logged thought by date + friendship line, read-only, no code.
  - Thought log (v2 fact), Share / Copy / Download, copy drafted by Claude for Sarah ([Q11](ARCHITECTURE.md#10-open-questions)).

- Keep state and memory between visits without a code: options are a date-keyed `localStorage` mirror (~10 lines,
  one device), then user sessions with server storage (Cloudflare Worker + D1 or KV, a login, a privacy note for
  stored thoughts). Not needed now (Sarah, 2026-10-29); Export/load covers it.

- Accessibility pass from the spec: screen-reader labels, focus ring and focus moves, WCAG AA contrast in both themes.
  From the v1 batch review: the pop-ups need focus moved in, `inert` on the app and Escape; the tap-Snoozle and
  tap-to-skip actions are pointer-only; the live region doesn't re-announce an identical line.
- With the keyboard open (375×380 stand-in), Snoozle's top is 129 px off screen on Moves. If it matters on a phone:
  crop the scene's sky on sub-screens (~40 px) first, a pinned scene last (panel review, 2026-10-29).
- CLS is 0.087 against 0.1 from the font swap: if it passes 0.1, size the fallback to Nunito (`size-adjust`).
- `scripts/perf.mjs`: `npx -y lighthouse@12` floats minor versions, and the arm64 spoof needs Node ≥ 20.6 (only
  x64 Node on this Mac). Pin an exact version if it starts failing.
- **Moves by weather (pattern tracking):** keep a per-day record (`date`, `sky`, moves taught / used / saved /
  let go) to see how many moves a day each weather actually holds, then suggest the usual from it ("We usually
  carry about three"). Needs history across days, so it follows v2 Export/load or server state; on-device only,
  shown as Snoozle's words, never as charts or numbers (P2). Replaces the spec's "learn the usual" idea.
- Spec "Later ideas": big/small moves, hide the stepper, "Not sure?" sky helper.
- Self-host fonts if `npm run perf` misses the budget ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)).

## Done

- 2026-10-29 — **v1 done** (M1–M4). `npm run gate`: copy 168/168, sprites 54/54, flows 29/29, 14.3 KB brotli.
  `npm run perf` ×3: FCP 0.94–0.98 s, LCP 0.94–1.01 s, CLS 0.087, score 98. Gate 2 Sonnet batch review: SHIP.
- 2026-10-29 — M4 Thoughts + acceptance: all 7 kinds, screen routes, tap Snoozle, reduced motion, no digits,
  320 px with pop-ups, Reset. No page fixes needed; perf fixed by non-blocking font CSS.
- 2026-10-29 — M3 Moves: moves cap counts used moves; "phew~" never dropped; 6 flows.
- 2026-10-29 — M2 Care: Garden and Recharge already matched the spec; 5 flows added and hardened after review
  (fresh browser context per flow, exact asserts, polling instead of sleeps). Gate: flows 12/12.
- 2026-10-29 — M1 Shell: `public/index.html` restructured to the architecture (807 lines, 14.3 KB brotli);
  `npm run gate` = docs, budget, copy 168/168, sprites 54/54, tokens, browser flows 7/7.
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
- 2026-10-29 — M1 deviations accepted: extra facts `seq` (per-day move id counter) and `cared` as a card → tap-count
  Map (alternating replies); `newDay` cancels only script animations (a cancelled CSS loop wouldn't restart);
  "carrying more than N" uses unfinished moves; thought friendship keyed by kind (fresh-eyes finding, max 16/day).
- 2026-10-29 — Browser tests run outside the sandbox (Chrome can't start in it), approved by Sarah for the test
  commands only. Project `.claude/settings.json` exemption: Sarah to create (Claude's write was blocked).
- 2026-10-29 — First Haiku fresh-eyes pass (M1): 93k tokens; found 1 rule break Gate 1 missed (thought friendship
  farmable) + 1 minor. Evidence for the setup audit.
- 2026-10-29 — **Moves cap counts used moves** (Sarah, after a game-design review): today's load = used + unfinished;
  only Save for later / Let go lighten it, closing the "do one, add one" loophole. Strain when load > N and a move is
  unfinished; pop-up and pink borders use load; bundles still show unfinished only. The spec and prototype counted
  unfinished only, so this is a spec change, not a code bug. "Used it" line 1 becomes "Nice! That one’s done. Let’s
  let it count." (line 2 unchanged).
- 2026-10-29 — Second Haiku pass (M2 tests, 49k tokens) found 5 false-green/flaky tests; fixed.
- 2026-10-29 — Perf estimate (§5: ~1.0 s) held only after making the font CSS non-blocking; with it render-blocking,
  Lighthouse measured 2.9 s. IME composition no longer triggers Teach on Enter.
- 2026-10-29 — **Keep Snoozle in view** (Sarah, after a UX / product / content / game-design panel): screen titles
  and the screen-name chip cut ("Today’s garden" and "Future moves" stay); Back on the scene's corner and at the
  end of each screen; Moves order is add box, grid, stepper, Future moves; hints stay as muted lines. Thoughts
  opening is "Rustle, rustle… a wild thought appeared! Help us catalog and name it."; its hint keeps "Each thought
  has its own way through."; the moves hint drops "You can carry more, but it gets heavy." (the heavy reaction says it).
- 2026-10-29 — **Snoozle contrast**: light-mode body vs sky was 1.15:1. Outline 3 → 4 and a ground shadow; a darker
  sky everywhere was rejected (dulls sunny, P5). A darker patch behind him waits on Sarah's look.
- 2026-10-29 — **Snoozle's face**: in dark mode the face used `--line` (light) and vanished on the cream body (Sarah's
  phone). New `--face` token, dark in both themes. Snoozle, umbrella and shadow drawn 1.3× larger, shapes unchanged.
- 2026-10-29 — **One Back** (on the scene); the phone's back gesture returns Home via one history entry per visit.
- 2026-10-29 — **Moves copy says each number once** (game / product / content review): N in the hint, the usual in
  the stepper, feeling in Snoozle's lines. Cut the Recharge and Thoughts hints, "instead of your usual", and
  **"We usually carry about four"** (reverses Q4), and the Future moves hint while the list is empty.
- 2026-10-29 — **Copy in one file**: `public/js/copy.js` (classic script, global `COPY`), grouped by screen with a
  "when it shows" note per line. It is the source of truth; `spec/copy.json` and `check-copy` retired. Budget sums
  `index.html` + `public/js/*.js` (15.6 KB brotli). CSP `script-src` adds `'self'`.
- 2026-10-29 — **Three voices in the copy** (game design / UX review): Snoozle in first person ("we" always includes
  you), narrator in third person for the bond line and plant captions, choice buttons in the user's voice. Rules sit in
  the [`copy.js`](public/js/copy.js) header. 16 lines changed to fit: the carry exchange becomes "we", the Future moves
  hint drops "sunnier", "70%" becomes "mostly done" (digit exception removed), and the Thoughts opening becomes
  "Let’s name it together." and "Used it" line 1 becomes "…My leaves did a little wiggle." (both reverse earlier
  decisions). "Recharge Center" pun kept.
- 2026-10-29 — **Recharge: eight cards become six** (Sarah, option B). Food takes water ("Eat or drink"), move
  takes outside ("Stretch or step out"); Bathroom stays. Card limits: title ≤ 14 characters, small line ≤ 20,
  replies ≤ 2 sentences. `BOND_AT` unchanged; a day now reaches at most 14 friendship (was 16).
- 2026-10-29 — **File split** (Sarah: leaner plan; web dev engineer has the final say on refactor calls): CSS in
  `css/` (3 files), JS as 13 ES modules plus `copy.js`, the standard in [ARCHITECTURE §2](ARCHITECTURE.md#file-standard),
  gated by `check-size` (≤ 200 lines, `index.html` ≤ 150, `copy.js` exempt), `check-deps` and `check-preload`.
  CSP `script-src 'self'`; the tests send the CSP.
- 2026-10-29 — **Load-time targets** ([ARCHITECTURE §5](ARCHITECTURE.md#5-load-time)): LCP ≤ 2.0 s (warn 1.3), FCP ≤ 1.5 s,
  first tap ≤ 2.5 s, CLS ≤ 0.1 (warn 0.05), our requests ≤ 20, median of 5 runs. The split costs ~0.4 s in the lab
  (1.41 s); Early Hints and a short cache were tried and dropped; static first-paint copy (option B) gave no gain.
