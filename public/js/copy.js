// Snoozle's Garden: every word the page shows lives in this file, grouped by screen and then by situation.
// To edit: change the text between the quotes and leave keys, brackets and commas alone.
//   - Use curly quotes and apostrophes (the ones in the text now), never straight ones inside a string.
//   - ${...} marks a spot code fills in (a move name, a sky name). Keep it as it is, and move it where it reads right.
//   - Write numbers as words: no digits in strings (npm run gate:fast checks this).
//   - No colours here. Colours live in the page's TOKENS block.
// Voice: who is speaking decides the person.
//   - Snoozle (any line under the SNOOZLE tag, sheets too): "I" is Snoozle, "we/our" is Snoozle and you, "you" only for your own feelings.
//   - Narrator (bond, sceneLabel, garden captions): third person, present tense, says "Snoozle", no pronoun.
//   - You (sheet choice buttons, placeholders): "I" is the person tapping, or a short verb. Plain controls are verbs.
// Content rules (match the skies replies):
//   - Never one "I" for two speakers in the same exchange. "We/us" always includes you.
//   - React with the body (leaves, roots, rain sounds), then invite ("Listen with me?", "Let’s…"). Snoozle feels, it doesn’t advise.
//   - Companion, not coach: no "should", no "Try:", no strings of orders. Offer, ask, or say "Let’s".
//   - Every weather is equal: no "sunnier", "better" or "worse". No numbers or percentages.
//   - Bubbles: three short sentences at most. Choice buttons: five words at most. No irony.
// An ES module: js/state.js, js/actions.js and the view files import COPY from here.
export const COPY = {
  // Whole app: name tag on every dialog bubble, including the pop-up sheet
  tag: "SNOOZLE",
  // Whole app: screen-reader label for the scene picture
  sceneLabel: "Snoozle in the garden",
  // Home: Snoozle says this on first arrival, on a new day and after Reset
  greeting:
    "Hello, hello! I’m Snoozle. Thanks for stopping by! Want to hang out for a bit?",
  // Home: Snoozle says this when you tap Back to the menu
  home: "What sounds nice right now?",
  // Home: screen-reader label for the four menu buttons
  menuLabel: "Choose where to go",
  // Home: the four menu buttons as [screen id, emoji, label]
  menu: [
    ["garden", "🌱", "Garden"],
    ["recharge", "🏥", "Recharge"],
    ["moves", "✨", "Moves"],
    ["thoughts", "🌾", "Thoughts"],
  ],
  // Home: button label under the menu
  reset: "Reset",
  // Every screen but Home: Back button label
  back: "Back",
  // Whole app: Snoozle replies to a tap on the scene (random pick)
  tap: [
    "Hi! I’m right here.",
    "Hehe, that tickles.",
    "You came to say hi? That’s the best.",
  ],
  // Whole app: line under the scene, grows with friendship (first to last)
  bond: [
    "Snoozle is peeking at you from behind a leaf.",
    "Snoozle is warming up to you.",
    "Snoozle hums a little when you’re around.",
    "Snoozle follows you everywhere now.",
    "Snoozle falls asleep right next to you. Total trust.",
    "You and Snoozle have been through every kind of weather together.",
  ],

  // GARDEN: the four weather buttons; label is the button, say is Snoozle on tapping it
  skies: {
    // Sunny weather button and reply
    sunny: {
      e: "☀️",
      label: "Sunny",
      say: "Sunshine dance! My leaves are all warm.",
    },
    // Cloudy weather button and reply
    cloudy: {
      e: "⛅",
      label: "Cloudy",
      say: "Ooh, it’s cloud-watching time. I spy a Snorlax! No, wait, or is it a Ditto?!?",
    },
    // Drizzly weather button and reply
    drizzly: {
      e: "🌧️",
      label: "Drizzly",
      say: "Our garden’s getting watered now! I love listening to the pitter-patter of rain. Listen with me?",
    },
    // Stormy weather button and reply (also the sky name used at Moves)
    stormy: {
      e: "⛈️",
      label: "Stormy",
      say: "Storms can be loud and tiring. Let’s tuck in somewhere cozy. The Recharge Center’s open if we need anything.",
    },
  },

  // GARDEN: the rest of the Garden screen
  garden: {
    // Snoozle on arriving at Garden before a sky is picked
    intro:
      "Let’s take a breath. Close your eyes: what sky do you see? I’ll match it. Every kind of weather grows our garden.",
    // Garden heading above the plant picture
    card: "Today’s garden",
    // Garden caption prefix when the sky is drizzly or stormy
    rain: "Watered by today’s rain. ",
    // Garden plant captions by growth stage: [headline, small line], seed to bloom
    stages: [
      // Stage 1, seed
      ["A seed, tucked in.", "It’ll grow with weather or a recharge."],
      // Stage 2, sprout
      ["A little sprout!", "Every bit of care helps it along."],
      // Stage 3, bud
      ["A bud is forming.", "Almost there. No rush."],
      // Stage 4, bloom
      ["In full bloom.", "Look what today grew."],
    ],
  },

  // RECHARGE: the care cards
  recharge: {
    // Snoozle on arriving at Recharge
    intro:
      "Pick anything, big or small. It all counts, and I’ll recharge right along with you.",
    // Added to a care reply when that tap grows the plant to a new stage
    grew: " Look, our plant grew!",
    // Care cards: t is the title, s the small line, r the two replies (alternate each time it is tapped)
    cards: [
      {
        k: "food",
        e: "🍙",
        t: "Share food",
        s: "Have you eaten?",
        r: [
          "We’re munching side by side. Best picnic ever.",
          "Crunch crunch. Thanks for feeding us both.",
        ],
      },
      {
        k: "water",
        e: "💧",
        t: "Sip some water",
        s: "Had a sip lately?",
        r: [
          "Big slurp! My leaves just perked right up.",
          "Ahh. Plants and people both run on water.",
        ],
      },
      {
        k: "rest",
        e: "😴",
        t: "Rest",
        s: "Even five minutes",
        r: [
          "I’m curling up next to you. We recharge together.",
          "Shh… nap time. The garden grows while we sleep.",
        ],
      },
      {
        k: "pit",
        e: "🚻",
        t: "Bathroom break",
        s: "Bodies first",
        r: [
          "Good call. I’ll hold down the fort.",
          "No rush. The garden will be right here.",
        ],
      },
      {
        k: "outside",
        e: "🌳",
        t: "Step outside",
        s: "Smell the fresh air",
        r: [
          "Fresh air! I’m rolling around in the grass.",
          "Look at the sky with me for a sec.",
        ],
      },
      {
        k: "friend",
        e: "📞",
        t: "Phone a friend",
        s: "A quick hello counts",
        r: [
          "I love hearing your friend’s voice. You sound lighter.",
          "My roots feel steadier already. We don’t have to carry it all alone.",
        ],
      },
      {
        k: "art",
        e: "🎨",
        t: "Make something",
        s: "Messy counts",
        r: [
          "Ooh, can I add a leaf to it?",
          "Making just for fun. No grades around here.",
        ],
      },
      {
        k: "move",
        e: "🤸",
        t: "Wiggle around",
        s: "Stretch, dance, walk",
        r: [
          "Wiggle wiggle! My roots feel looser.",
          "That felt good. Want to do a little more, or rest?",
        ],
      },
    ],
  },

  // MOVES: the daily pack, Future moves and the heavy-backpack sheet
  moves: {
    // Hint above the grid when today is below your usual count (weather emoji, sky name, count)
    hintBelow: (e, sky, n) => `${e} ${sky} today, so ${n} feels right.`,
    // Hint above the grid otherwise (count)
    hintOk: (n) => `${n} feels right today.`,
    // Label of the usual-count stepper
    usual: "Your usual on a sunny day:",
    // Screen-reader label of the minus button
    fewer: "Fewer moves",
    // Screen-reader label of the plus button
    more: "More moves",
    // Reply after changing the usual count
    usualSet: (b) => `Got it. On a sunny day, we’ll aim for ${b}.`,
    // Snoozle on arriving at Moves before a sky is picked
    introNone:
      "Share your forecast in the Garden and I’ll know how many moves feel right.",
    // Snoozle on arriving at Moves when over the cap (sky name)
    introOver: (sky) =>
      `That’s plenty for a ${sky} day. Want to save one for the future?`,
    // Snoozle on arriving at Moves when the count is below your usual (sky name)
    introLow: (sky) =>
      `${sky} weather. Let’s keep it light today. Smaller is braver than it looks.`,
    // Snoozle on arriving at Moves otherwise
    introOk: "Clear enough for a full pack. Pick the ones that matter most.",
    // Empty slot in the grid
    dash: "—",
    // Button label on an unfinished move
    useIt: "Used it",
    // Button label on an unfinished move
    saveIt: "Save for later",
    // Placeholder in the new-move box
    placeholder: "Something you want to do…",
    // Screen-reader label of the new-move box
    inputLabel: "New move",
    // Button label next to the new-move box
    teach: "Teach",
    // Reply after teaching a move when under the cap
    learned: (m) => `I learned ${m}!`,
    // Reply after bringing a move back from Future moves when under the cap
    welcome: (m) => `Welcome back, ${m}!`,
    // Sheet text after a taught or brought-back move goes over the cap
    heavy: (m) =>
      `I learned ${m}! My backpack’s getting heavy, though. Want to try fewer today?`,
    // Sheet button: save one for later
    heavySave: "Sure, save one for later",
    // Sheet button: keep it all
    heavyCarry: "We’ll carry it today",
    // Reply after tapping the carry button
    carry: "Okay, we’ll carry it together. We can set one down anytime.",
    // Sheet text after choosing to save one; buttons are the unfinished moves
    which: "Which one can wait?",
    // Reply after picking a move to wait
    safe: (m) => `${m} is safe in Future moves. Ahh, that’s lighter.`,
    // Reply after tapping Used it (alternates)
    used: [
      "Nice! That one’s done. My leaves did a little wiggle.",
      "Move used! Take a breath before the next one.",
    ],
    // Reply after tapping Save for later
    saved: (m) => `${m} is saved in Future moves. It’ll wait.`,
    // Heading of the Future moves list
    future: "Future moves",
    // Hint under the Future moves heading, shown when the list has moves
    futureHint: "Moves saved here wait until we want them.",
    // Button label on a Future move
    bring: "Bring back",
    // Button label on a Future move
    letGo: "Let go",
    // Reply after tapping Let go
    bye: (m) =>
      `Poof! ${m} drifted off on the breeze. My leaves feel lighter already.`,
    // Future moves list when it is empty
    futureEmpty: "Nothing saved yet. That’s a nice, light feeling.",
  },

  // THOUGHTS: name a passing thought and pick a way to hold it
  thoughts: {
    // Snoozle on arriving at Thoughts
    intro: "Rustle, rustle… a wild thought appeared! Let’s name it together.",
    // Label above the thought box
    label: "What’s the thought?",
    // Small tag after that label
    optional: " (optional)",
    // Placeholder in the thought box
    placeholder: "I have to say yes to everything or…",
    // Line above the kind buttons
    ask: "What kind of thought is it?",
    // Sheet text after picking a kind (lowercased kind name, its question)
    looks: (kind, q) => `Looks like ${kind}. ${q}`,
    // Last sheet button on every kind; say is the reply after tapping it
    wander: {
      label: "Let it wander off",
      say: "The thought wandered back into the tall grass. We don’t have to catch every one.",
    },
    // Thought kinds: t is the button, s the small line and sheet name, q the sheet question, opts the sheet buttons (say is the reply; go also moves to that screen)
    kinds: [
      {
        t: "“I should…”",
        s: "A should statement",
        q: "Whose rule is that one, anyway?",
        opts: [
          {
            label: "Swap “should” for “could”",
            say: "‘I could…’ Feels lighter, right? Could means it’s a choice, not a debt.",
          },
          {
            label: "Save it for Future moves",
            go: "moves",
            say: "It doesn’t have to be today. Teach it to me later, or tuck it into Future moves.",
          },
        ],
      },
      {
        t: "“I can push through”",
        s: "Running on empty",
        q: "Pushing through works for one battle, not every day.",
        opts: [
          {
            label: "Recharge first",
            go: "recharge",
            say: "Let’s top up first. Pick anything here and I’ll do it with you.",
          },
          {
            label: "Lighten today’s moves",
            go: "moves",
            say: "Which move could wait? Saving one for later isn’t quitting.",
          },
        ],
      },
      {
        t: "“I can’t say no”",
        s: "People-pleasing",
        q: "Every yes to them is a no to something else, sometimes to you.",
        opts: [
          {
            label: "Borrow a soft no",
            say: "Want a line? ‘I’d love to, but I can’t take that on right now.’ Kind, short, done.",
          },
          {
            label: "Buy some time",
            say: "Here’s one: ‘Let me check and get back to you.’ No answer needed on the spot.",
          },
        ],
      },
      {
        t: "“They’ll think I’m lazy”",
        s: "Mind reading",
        q: "Has anyone actually said that?",
        opts: [
          {
            label: "What would I tell a friend?",
            say: "You’d tell them rest isn’t lazy. I’m telling you the same.",
          },
          {
            label: "Check the evidence",
            say: "If no one said it, it’s a guess, not a fact. Guesses can be wrong.",
          },
        ],
      },
      {
        t: "“If it’s not perfect, it doesn’t count”",
        s: "All-or-nothing",
        q: "Is there a good-enough middle?",
        opts: [
          {
            label: "Find the good-enough version",
            say: "What would mostly done look like? Good enough is still good.",
          },
          {
            label: "Name one part that went okay",
            say: "There’s always one. Even ‘I showed up’ counts.",
          },
        ],
      },
      {
        t: "“It’s all going to go wrong”",
        s: "Fortune telling",
        q: "What’s most likely, not worst?",
        opts: [
          {
            label: "Picture the most likely version",
            say: "Most days land somewhere in the middle. This one probably will too.",
          },
          {
            label: "One tiny step for the next hour",
            go: "recharge",
            say: "Just the next hour. What would help right now?",
          },
        ],
      },
      {
        t: "Not sure",
        s: "That’s fine",
        q: "Noticing it is enough. Thoughts are weather too.",
        opts: [
          {
            label: "Just sit with it a sec",
            say: "Okay. I’ll sit here with you. No fixing needed.",
          },
        ],
      },
    ],
  },
};
