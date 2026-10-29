# Snoozle's Garden: Build Spec (text copy)

Plain-text copy of the [spec doc](https://claude.ai/artifact/9GVosVjYu739Cb4ncPLCQC), rev 64, 2026-10-28, for agents without Claude Docs access. Table cells are separated by ` | `. The doc wins if they differ; [PLAN Decisions](../PLAN.md#decisions) win over both.

Summary
Build Snoozle’s Garden as one self-contained, mobile-first web page: a small companion creature, Snoozle, helps people who are burnt out or tend to over-commit check in, recharge and plan lighter days. It has no backend, no accounts, and everything resets each new day.
The app draws on CBT (self-monitoring, naming thoughts, testing plans against reality) and growth mindset, in a light-hearted, nostalgic tone inspired by Pokémon. It should feel like hanging out with a friend, never like one more tracker to fill in. Its two goals for the person are to recover and to find a healthy balance.
The working prototype is the visual and behavioral reference: Snoozle’s Garden prototype. Where the prototype and this spec differ, this spec wins.
Design principles
Every screen, animation and line of copy must follow these. When a detail isn’t specified, decide it by these rules.
Every tap gets immediate, visible feedback. Snoozle or the scene reacts in the same moment. Nothing changes silently in the background.
No numbers or scorekeeping. No points, HP, scores, streaks, badges or achievements are shown. Friendship exists only as Snoozle’s behavior and one line of text.
Soft limits, never hard ones. Suggested amounts can always be exceeded. Going over is shown (Snoozle strains under a heavy backpack), never blocked.
Doing less earns the warmest reaction. Saving or letting go of a move triggers relief. Moves never grow the garden; only care (Recharge) and weather do, so the garden can’t become a productivity scoreboard.
Every weather is equally valid. No sky is ranked as better. Rain waters the garden.
Companion, not coach. Snoozle shares its own experience and says “we.” Avoid directives, “should,” and lines that read as clingy or creepy, such as “I’m so glad you told me” or “I’m so glad you’re here.”
Missing a day costs nothing. There is no streak to break and no history to fall behind on.
Experience flow
The app is one page with a home menu and four screens. Snoozle, the scene and the dialog box stay at the top at all times; only the area below the dialog changes.
Home (default). Shows the scene, the friendship line, the dialog box and a 2×2 menu: Garden, Recharge, Moves, Thoughts. Nothing is selected. On first visit of the day Snoozle types: “Hi! I’m Snoozle. Thanks for stopping by! Any chance you want to hang out with me?”
Selecting an option. The ▸ cursor appears beside the choice and blinks twice. Snoozle hops and types that screen’s intro line. After about 320 ms the other three options fade out (200 ms). The chosen option then morphs into a label chip beside a “◂ Back” button (360 ms, cubic-bezier(.2,.8,.2,1)), and the screen’s content fades up into place (300 ms).
Back. Returns to Home with nothing selected. Snoozle types: “What sounds nice right now?”
Reset prototype. A small underlined link under the Home menu, for testing only. It clears the day and shows the first-visit greeting again.
New day. At local midnight everything resets and the next open shows the first-visit greeting (see Technical requirements).
The user can tap the dialog text to skip the typing animation.
Screens and copy
All copy below is final; use it exactly, with curly apostrophes and quotes. {Name} is Snoozle’s current name, N is today’s comfortable number of moves, B is the person’s usual.
Garden
Title: “What’s your forecast?” Intro line when Garden is chosen before any pick: “Take a breath, close your eyes, and pick the closest sky you see. I’ll match it. Every kind of weather grows our garden.” If a sky is already picked, the intro is that sky’s line.
Four buttons sit in one row. Tapping one is the whole check-in.
Sky
 | Snoozle says
 | Snoozle’s motion
 | Scene
 | Water added
 | Comfortable moves
 | 
☀️ Sunny
 | “Sunshine dance! My leaves are all warm.”
 | Quick bounce
 | Sun, one small cloud
 | 1
 | B
 | 
⛅ Cloudy
 | “Ooh, it’s cloud-watching time. I spy a Snorlax! No, wait, or is it a Ditto?!?”
 | Slow sway, ±2°, 3.6 s
 | Dimmed sun, several clouds
 | 1
 | B
 | 
🌧️ Drizzly
 | “Our garden’s getting watered now! I love listening to the pitter-patter of rain. Listen with me?”
 | Gentle droop, eyes closed
 | Grey sky, light slow rain (one third of the drops, 2.2 s fall), leaf shelter
 | 2
 | B × 0.75, rounded up
 | 
⛈️ Stormy
 | “Storms can be loud and tiring. Let’s tuck in somewhere cozy. The Recharge Center’s open if we need anything.”
 | Slow sleepy breathing, eyes closed, “z z”
 | Dark sky, heavy fast rain, lightning flash every 5 s, leaf shelter
 | 2
 | B ÷ 2, rounded, minimum 1
 | 
The person can change the sky later that day; the old sky’s water is swapped for the new one’s. Friendship only rises on the day’s first pick. No closing line is added after any sky’s line.
Below the buttons, a “Today’s garden” card shows the plant and a caption. Rain days start the second line with “Watered by today’s rain.”
Stage
 | Water
 | Caption
 | Second line
 | 
Seed
 | 0
 | “A seed, tucked in.”
 | “It’ll grow with weather or a recharge.”
 | 
Sprout
 | 1–2
 | “A little sprout!”
 | “Every bit of care helps it along.”
 | 
Bud
 | 3–4
 | “A bud is forming.”
 | “Almost there. No rush.”
 | 
Bloom
 | 5 or more
 | “In full bloom.”
 | “Look what today grew.”
 | 
Recharge Center
Title: “Recharge Center.” Hint: “{Name} gets hungry, thirsty and sleepy too. Whatever you do, {Name} recharges with you.” Intro line: “Pick anything, big or small. It all counts.”
Eight cards in two columns. Reactions alternate on repeat taps.
Card
 | Second line
 | Snoozle’s reactions
 | 
🍙 Share food
 | Have you eaten?
 | “We’re munching side by side. Best picnic ever.” / “Crunch crunch. Thanks for feeding us both.”
 | 
💧 Sip some water
 | Have you hydrated?
 | “Big slurp! My leaves just perked right up.” / “Ahh. Plants and people both run on water.”
 | 
😴 Rest
 | Even five minutes
 | “I’m curling up next to you. We recharge together.” / “Shh… nap time. The garden grows while we sleep.”
 | 
🚻 Bathroom break
 | Bodies first
 | “Good call. I’ll hold down the fort.” / “Bodies first, everything else after.”
 | 
🌳 Step outside
 | Smell the fresh air
 | “Fresh air! I’m rolling around in the grass.” / “Look at the sky with me for a sec.”
 | 
📞 Phone a friend
 | Grace them with your presence
 | “I love hearing your friend’s voice. You sound lighter.” / “Good teams take turns carrying each other.”
 | 
🎨 Make something
 | Messy counts
 | “Ooh, can I add a leaf to it?” / “Making just for fun. No grades around here.”
 | 
🤸 Wiggle around
 | Stretch, dance, walk
 | “Wiggle wiggle! My roots feel looser.” / “That felt good. Want to do a little more, or rest?”
 | 
Each tap adds 1 water and 1 friendship. If the plant reaches a new stage, Snoozle adds “ Look, our plant grew!” to the reaction. A tapped card gets a tinted background and a 🍃 after its title, and stays tappable.
Move tutor
Title: “Move tutor.” Under it, one hint line:
When today’s number is below the usual: “{sky emoji} {Sky} today, so N feels right instead of your usual B. You can carry more, but it gets heavy.”
Otherwise: “N feels right today. You can carry more, but it gets heavy.”
Then a stepper: “Your usual on a sunny day: − B +”, range 1 to 10, default 4. Changing it makes Snoozle hop and say “Got it. On a sunny day, we’ll aim for B.”
Intro line when Moves is chosen:
No sky picked: “I can comfortably carry N moves today. Share your forecast in the Garden and I’ll know how many feel right.”
Carrying more than N: “It’s {sky} today, so N moves feels like plenty. Want to save one for the future?”
N below the usual: “{Sky} weather. Let’s keep it to N moves today. Smaller is braver than it looks.”
Otherwise: “Clear enough for N moves. Pick the ones that matter most.”
Moves show in a two-column grid with at least N cells. Empty cells are dashed with “—”. Moves beyond N get a dashed pink border. Each move card has two buttons, “Used it” and “Save for later.” Once used, the text is crossed out and both buttons disappear; there is no undo.
Below the grid: a text input (placeholder “Something you want to do…”, 40 characters max) and a “Teach” button. Enter also teaches.
Action
 | What Snoozle says
 | 
Teach, still within N
 | “I learned {move}!”
 | 
Teach, going past N
 | Still learns it, then a pop-up: “I learned {move}! My backpack’s getting heavy, though. We usually carry about four. Want to try that?” Options: “Sure, save one for later” and “I’ll carry it today.”
 | 
“Sure, save one for later”
 | Pop-up “Which one can wait?” listing current moves; picking one says “{move} is safe in Future moves. Ahh, that’s lighter.”
 | 
“I’ll carry it today”
 | “Okay, I’ve got it! Let me know if it gets too heavy.”
 | 
Used it
 | One of: “Nice! That one’s done. No need to fill the slot right away.” / “Move used! Take a breath before the next one.”
 | 
Save for later
 | “{move} is saved in Future moves. It’ll wait.”
 | 
“About four” stays hard-coded in v1, whatever the usual is set to.
Future moves sits below, with the hint “Moves saved here will wait for a sunnier day.” Each saved move has “Bring back” and “Let go.” Bring back behaves like Teach, but says “Welcome back, {move}!” Let go says “Bye, {move}. Letting go is a move too.” When empty it reads “Nothing saved yet. That’s a nice, light feeling.”
Thoughts
Title: “Rustling in the tall grass.” Hint: “A thought appeared! Help us catalog and name it. Each thought has its own way through.” Intro line: “Rustle, rustle… something’s moving in the tall grass.”
An optional text box labeled “What’s the thought? (optional)” with placeholder “I have to say yes to everything or…”, then “What kind of thought is it?” and a list of kinds. Choosing a kind opens a pop-up: “Looks like {kind, lowercase}. {question}” with its options.
Kind (button / subline)
 | Snoozle’s question
 | Options and what Snoozle says
 | 
“I should…” / A should statement
 | Whose rule is that one, anyway?
 | Swap “should” for “could”: “‘I could…’ Feels lighter, right? Could means it’s a choice, not a debt.” · Save it for Future moves (opens Moves): “It doesn’t have to be today. Teach it to me later, or tuck it into Future moves.”
 | 
“I can push through” / Running on empty
 | Pushing through works for one battle, not every day.
 | Recharge first (opens Recharge): “Let’s top up first. Pick anything here and I’ll do it with you.” · Lighten today’s moves (opens Moves): “Which move could wait? Saving one for later isn’t quitting.”
 | 
“I can’t say no” / People-pleasing
 | Every yes to them is a no to something else, sometimes you.
 | Borrow a soft no: “Try: ‘I’d love to, but I can’t take that on right now.’ Kind, short, done.” · Buy some time: “Try: ‘Let me check and get back to you.’ You don’t owe an answer on the spot.”
 | 
“They’ll think I’m lazy” / Mind reading
 | Has anyone actually said that?
 | What would I tell a friend?: “You’d tell them rest isn’t lazy. Same rules apply to you.” · Check the evidence: “If no one said it, it’s a guess, not a fact. Guesses can be wrong.”
 | 
“If it’s not perfect, it doesn’t count” / All-or-nothing
 | Is there a good-enough middle?
 | Find the good-enough version: “What would 70% look like? Good enough is still good.” · Name one part that went okay: “There’s always one. Even ‘I showed up’ counts.”
 | 
“It’s all going to go wrong” / Fortune telling
 | What’s most likely, not worst?
 | Picture the most likely version: “Most days land somewhere in the middle. This one probably will too.” · One tiny step for the next hour (opens Recharge): “Just the next hour. What would help right now?”
 | 
Not sure / That’s fine
 | Noticing it is enough. Thoughts are weather too.
 | Just sit with it a sec: “Okay. I’ll sit here with you. No fixing needed.”
 | 
Every kind also offers “Let it wander off”: “The thought wandered back into the tall grass. You don’t have to catch every one.” Any choice adds 1 friendship and clears the form. Typed thoughts are not kept in v1 (see Backlog).
Renaming and small touches
The name tag on the dialog box (“SNOOZLE ✎”) is a button. It opens: “Want to give me a new name? I’ll answer to anything.” with a 14-character input, “Save name” and “Keep my name.” Saving says “{Name}! I love it. That’s me now.” The new name replaces “Snoozle” everywhere.
Tapping Snoozle gives one of: “Hi! I’m right here.” / “Hehe, that tickles.” / “You came to say hi? That’s the best.”
The friendship line under the scene grows with friendship. It never goes down.
Friendship reached
 | Line
 | 
0
 | “{Name} is peeking at you from behind a leaf.”
 | 
2
 | “{Name} is warming up to you.”
 | 
6
 | “{Name} hums a little when you’re around.”
 | 
12
 | “{Name} follows you everywhere now.”
 | 
20
 | “{Name} falls asleep right next to you. Total trust.”
 | 
35
 | “You and {Name} have been through every kind of weather together.”
 | 
Snoozle and the scene
Snoozle is an original creature drawn in inline SVG, matching the prototype: a round, cream seed-shaped body with a dark outline, two green leaves sprouting from the top, small green feet, dot eyes with highlights, rosy cheeks and a small smile. It must never copy the design of a real Pokémon or other known character.
The scene is a 320 × 190 SVG with rounded corners and a thick outline: sky, sun, clouds, rain, lightning and a grass strip. Today’s plant grows on the ground to Snoozle’s right and always stays out in the rain. On drizzly and stormy days, a large leaf springs up from the ground on Snoozle’s left and arches over its head; Snoozle never holds it. It shrinks back into the ground when the sky clears.
Backpack. With no unfinished moves, Snoozle carries nothing. With one or more, a small brown backpack with a strap appears, and one colorful bundle per unfinished move pokes out of the top (up to 5 drawn). A new bundle pops in with a springy scale.
Action
 | Visible reaction
 | 
Pick a sky
 | Scene and Snoozle’s motion change; if the plant reaches a new stage it pops and ✨ appears on it; hearts near Snoozle on sunny and cloudy only
 | 
Choose a menu option
 | ▸ cursor blinks twice, Snoozle hops, menu morphs into the screen
 | 
Recharge card
 | Snoozle hops, 💗 (💤 for Rest) near Snoozle, ✨ on the plant, plant pops if it grows
 | 
Teach a move
 | Snoozle hops, ✨, a bundle pops into the backpack
 | 
More unfinished moves than N
 | Snoozle leans toward the backpack, sags and trembles quickly; worried brows, wavy mouth and a sweat drop replace the smile. Stops once back within N
 | 
Used it
 | Snoozle plops down for a breather (squash for about 1.3 s); the bundle disappears
 | 
Save for later, Let go, or choosing to save
 | Relief: a big stretch and settle, 💨 and a floating “phew~”; the bundle disappears
 | 
Tap Snoozle
 | One heart and a hello line
 | 
Friendship reaches a new line
 | The friendship line flashes and 💞 hearts burst
 | 
Never float 💧 emojis near Snoozle: they read as tears.
Visual design
The look is a soft, handheld-game garden: pale pea-green background, thick dark outlines, chunky buttons with a solid drop shadow, and a retro double-bordered dialog box. Define every color as a CSS variable with light and dark values.
Token
 | Light
 | Dark
 | Used for
 | 
bg
 | #e6edda
 | #162016
 | Page background
 | 
surface
 | #fbfcf6
 | #212c20
 | Cards, dialog, menu
 | 
ink
 | #22301f
 | #eef3e4
 | Text
 | 
muted
 | #5d6b57
 | #a9b7a2
 | Hints, sublines
 | 
line
 | #22301f
 | #d9e4cf
 | Outlines, shadows
 | 
leaf
 | #4f8f43
 | #7cc06a
 | Stems, buttons
 | 
leaf2
 | #8fc66f
 | #a6d98a
 | Leaves
 | 
grass
 | #9fcf7c
 | #3f6a35
 | Ground
 | 
sky / sky-rain / sky-storm
 | #bfe0ee / #a9bccb / #7f879c
 | #2d4654 / #2a3540 / #1d222c
 | Sky by weather
 | 
sun
 | #f5c64a
 | #e8b93d
 | Sun, flower center, lightning
 | 
heart
 | #e46a7c
 | #f08597
 | Cursor, petals, over-limit border
 | 
soil / soil2
 | #a9744a / #7f5534
 | #8a5f3d / #5f3f27
 | Soil, backpack
 | 
body
 | #f6eab9
 | #efe0a6
 | Snoozle’s body
 | 
chip
 | #eef3e4
 | #2b3829
 | Selected and tapped states
 | 
Type: Nunito (400, 600, 800) for everything, with a rounded system fallback. Press Start 2P only for the small name tag on the dialog box. Body text 16 px; dialog text 17 px, weight 600.
Layout: one centered column, max width 460 px, 14 px side padding. Order top to bottom: scene, friendship line, dialog box, then Home menu or Back row plus screen content.
Menu: a 2×2 grid inside one outlined box, like a battle menu. Each option is an emoji plus one word, no subtext. The selected option shows the ▸ cursor and a tinted background.
Dialog: text types at about 18 ms per character with a blinking ▾ at the end.
Technical requirements
Ship one self-contained index.html with inline CSS and vanilla JavaScript. No framework, build step, backend, accounts, analytics or network calls beyond Google Fonts.
State: one in-memory object holding name, friendship, usual (B), today’s sky, water, tapped Recharge cards, moves and Future moves. No database or server storage.
Daily reset: store the local date (YYYY-MM-DD) with the state. On load, on returning to the tab (visibilitychange) and once a minute, compare it with today’s date. If the date has changed, reset everything to defaults, return to Home and show the first-visit greeting.
Refresh within the day: recommended to mirror the state to localStorage under one key with the date, wrapped in try/catch, and clear it on a new day. Without this, a refresh mid-day wipes the day (see Open questions).
Mobile first: <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">; pad for env(safe-area-inset-*); no horizontal scrolling from 320 px wide up; tap targets at least 44 px; inputs at 16 px so iOS doesn’t zoom. On desktop, the same column sits centered.
Pop-ups: bottom sheets over a dim backdrop, using the same dialog-box style, with the option buttons stacked.
Browsers: current Safari on iOS, Chrome on Android, and current desktop Chrome, Safari, Firefox and Edge.
Deployment: any static host (GitHub Pages, Netlify or similar). It should also work opened straight from the file.
Accessibility and motion
Reduced motion: when prefers-reduced-motion: reduce is set, turn off all animation, the menu morph and the typing effect. Text appears at once and screens switch instantly; every state change still shows.
Light and dark: follow prefers-color-scheme using the token table.
Screen readers: the dialog box is an aria-live="polite" region; the scene is role="img" with a label; every control is a real <button> or labeled <input>; the stepper buttons have labels (“Fewer moves”, “More moves”).
Focus: a visible focus ring (3 px, heart color) on every control; pop-ups move focus to their first option or input.
Contrast: text meets WCAG AA against its background in both themes.
Meaning beyond emoji and color: every emoji in a button sits beside a word, and the over-limit state also shows in Snoozle’s face and motion, not only the pink border.
Acceptance criteria
First open shows only the scene, friendship line, dialog with the first-visit greeting, the 2×2 menu and Reset prototype
Choosing a menu option blinks the cursor, makes Snoozle hop and morphs the option into the Back row; Back returns Home with nothing selected and says “What sounds nice right now?”
“What’s your forecast?” appears only on the Garden screen
Each sky changes the scene, Snoozle’s motion and Snoozle’s line exactly as specified; drizzly and stormy raise the leaf shelter from the ground
Recharge taps grow the plant through all four stages, with a visible pop and ✨ at each new stage
Teaching past N never blocks; the backpack fills, Snoozle strains, and the “about four” pop-up appears
Saving or letting go of a move shows the relief stretch and “phew~” and removes a bundle
Using a move crosses it out, removes both buttons and shows the breather
Changing the usual updates N for every sky and the hint line
Each thought kind shows its own options, and options that open another screen do so
Renaming updates every place the name appears
Reset prototype and a change of date both return to the first-visit state
No numbers, scores or streaks appear anywhere except the usual-moves stepper and move counts in Snoozle’s lines
No horizontal scroll at 320 px; nothing hides under the iPhone notch or home bar
With reduced motion on, every action still shows its result without animation
Open questions and risks
What should survive the daily reset? A full reset also wipes Snoozle’s name, the usual number, friendship and Future moves. Future moves resetting contradicts “Moves saved here will wait for a sunnier day,” and a friendship that restarts daily may feel cold. Suggested: keep name, usual, friendship and Future moves; reset the sky, water, Recharge taps and today’s moves.
Refresh mid-day: pure in-memory state is lost on refresh or when the phone closes the tab. Confirm whether date-keyed localStorage on the device is acceptable.
Trademarks: the cloudy line names Snorlax and Ditto. Fine for a personal prototype; for anything public, swap to something like “I spy a sleepy giant! No, wait, or is it a blob?!?”
“About four” is hard-coded in the over-limit pop-up even when the usual differs. Decide whether it should say the person’s usual instead.
Support for harder days: some people may open this during a real crisis. Consider a small, gentle link to support resources, without making stormy days feel alarming.
Backlog
Export today (next up). One button exports the day’s moments, Future moves and thoughts so they can go to a notes app at any time.
Where: a small “Export today” link on Home, beside Reset prototype, so it’s reachable from anywhere in one tap.
How: the Web Share API (navigator.share) opens the phone’s share sheet, which sends the text straight to Apple Notes, Google Keep or any notes app. Where sharing isn’t supported, offer “Copy to clipboard” and “Download” as a Markdown file. A web page can’t write directly into a notes app; the share sheet is the bridge.
Moments: what happened today, written as moments, never as scores, totals or achievements. Include the sky picked, Recharge cards tapped, the plant’s highest stage, a new friendship line if one was reached, and moves used, saved or let go. Saving and letting go are listed as moments too, so doing less shows up as something worth keeping.
Future moves: every saved move, so the list survives even if the app resets.
Thoughts: every thought typed that day with its time, its kind and the way through that was chosen. Thoughts named without typed text are listed by kind only.
Format: plain Markdown headed with the date, in this order:
Later ideas
Learn the usual from what actually happens, e.g. “We usually carry about three” based on recent days, replacing the hard-coded “about four.”
Big and small moves, where a small move takes half a backpack spot.
Tuck the usual stepper behind a small “Change my usual” link.
A “Not sure?” helper on the Garden screen that walks through energy, body and mood before picking a sky.
