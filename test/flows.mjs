// Browser flow gate. Append flows to `flows`: { name, run(page, url) } (throw to fail).
import { serve, openAt, closeAll } from './helpers.mjs';

const GREETING = 'Hi! I’m Snoozle. Thanks for stopping by! Any chance you want to hang out with me?';
const HOME_LINE = 'What sounds nice right now?';
const SCREENS = ['garden', 'recharge', 'moves', 'thoughts'];

const assert = (c, msg) => { if (!c) throw new Error(msg); };
const visible = (page, sel) => page.$eval(sel, (n) => {
  const r = n.getBoundingClientRect();
  return !n.hidden && r.width > 0 && r.height > 0 && getComputedStyle(n).display !== 'none';
}).catch(() => false);
const tap = (page, sel) => page.$eval(sel, (n) => n.click());
const goto = (page, s) => tap(page, `button[data-act=go][data-arg=${s}]`);
const dialog = async (page) => {
  await tap(page, '#say'); // skip typing
  return page.$eval('#typed', (n) => n.textContent);
};
const boot = async (page, url) => { await page.goto(url, { waitUntil: 'load' }); await page.waitForSelector('#typed'); await new Promise((r) => setTimeout(r, 100)); };

async function layoutChecks(page) {
  const probs = [];
  const check = async (label) => {
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: innerWidth,
      small: [...document.querySelectorAll('button')].filter((b) => b.offsetParent !== null || b.getClientRects().length)
        .map((b) => [b.getBoundingClientRect().height, (b.textContent || b.getAttribute('aria-label') || b.dataset.act).trim().slice(0, 20)])
        .filter(([h]) => h > 0 && h < 44),
    }));
    if (r.sw > r.iw) probs.push(`${label}: scrollWidth ${r.sw} > ${r.iw}`);
    for (const [h, t] of r.small) probs.push(`${label}: button "${t}" is ${h.toFixed(1)}px tall`);
  };
  await check('home');
  for (const s of SCREENS) {
    await goto(page, s);
    await check(s);
    await tap(page, 'button[data-act=home]');
  }
  if (probs.length) throw new Error(probs.join('; '));
}

const SKY_LINES = {
  sunny: 'Sunshine dance! My leaves are all warm.',
  cloudy: 'Ooh, it’s cloud-watching time. I spy a Snorlax! No, wait, or is it a Ditto?!?',
  drizzly: 'Our garden’s getting watered now! I love listening to the pitter-patter of rain. Listen with me?',
  stormy: 'Storms can be loud and tiring. Let’s tuck in somewhere cozy. The Recharge Center’s open if we need anything.',
};
const STAGES = [
  ['A seed, tucked in.', 'It’ll grow with weather or a recharge.'],
  ['A little sprout!', 'Every bit of care helps it along.'],
  ['A bud is forming.', 'Almost there. No rush.'],
  ['In full bloom.', 'Look what today grew.'],
];
const BOND = ['Snoozle is peeking at you from behind a leaf.', 'Snoozle is warming up to you.', 'Snoozle hums a little when you’re around.'];
const CARDS = {
  food: ['We’re munching side by side. Best picnic ever.', 'Crunch crunch. Thanks for feeding us both.'],
  water: ['Big slurp! My leaves just perked right up.', 'Ahh. Plants and people both run on water.'],
  rest: ['I’m curling up next to you. We recharge together.', 'Shh… nap time. The garden grows while we sleep.'],
  pit: ['Good call. I’ll hold down the fort.', 'Bodies first, everything else after.'],
  outside: ['Fresh air! I’m rolling around in the grass.', 'Look at the sky with me for a sec.'],
};
const caption = (page) => page.$eval('.today-garden p', (n) => n.textContent);
const bondIdx = async (page) => BOND.indexOf(await page.$eval('.bond', (n) => n.textContent.trim()));
const pickSky = (page, s) => tap(page, `button[data-act=sky][data-arg=${s}]`);
const careTap = (page, k) => tap(page, `button[data-act=care][data-arg=${k}]`);

export const flows = [
  {
    name: 'first open',
    async run(page, url) {
      await boot(page, url);
      assert(await visible(page, '#scene'), 'scene not visible');
      assert(await page.$('.bond') && (await page.$eval('.bond', (n) => n.textContent.trim())), 'friendship line missing');
      assert((await page.$$eval('.menu button', (b) => b.length)) === 4, 'menu is not 4 buttons');
      assert(await page.$eval('.menu', (n) => getComputedStyle(n).gridTemplateColumns.split(' ').length) === 2, 'menu is not 2 columns');
      assert(await page.$$eval('button[data-act=reset]', (b) => b.length && b[0].textContent.trim() === 'Reset prototype'), 'Reset prototype missing');
      const got = await dialog(page);
      assert(got === GREETING, `greeting was "${got}"`);
    },
  },
  {
    name: 'menu screens and back',
    async run(page, url) {
      await boot(page, url);
      for (const s of SCREENS) {
        await goto(page, s);
        const st = await page.evaluate((s) => ({
          menu: !!document.querySelector('.menu') && document.querySelector('.menu').getBoundingClientRect().height > 0 && !document.querySelector('.menu').closest('[hidden]'),
          back: document.querySelector('.backrow') && !document.querySelector('.backrow').hidden && document.querySelector('.backrow').getBoundingClientRect().height > 0,
          tabs: [...document.querySelectorAll('section.tab')].filter((t) => !t.hidden && t.getBoundingClientRect().height > 0).length,
        }), s);
        assert(!st.menu, `${s}: menu still visible`);
        assert(st.back, `${s}: back row not shown`);
        assert(st.tabs === 1, `${s}: ${st.tabs} tabs visible`);
        await tap(page, 'button[data-act=home]');
        const h = await page.evaluate(() => ({
          menu: document.querySelector('.menu').getBoundingClientRect().height > 0 && !document.querySelector('.menu').closest('[hidden]'),
          back: !document.querySelector('.backrow').hidden,
          tabs: [...document.querySelectorAll('section.tab')].filter((t) => !t.hidden).length,
        }));
        assert(h.menu && !h.back && h.tabs === 0, `${s}: Back did not return Home cleanly`);
        const line = await dialog(page);
        assert(line === HOME_LINE, `${s}: after Back dialog was "${line}"`);
      }
    },
  },
  {
    name: 'midnight rollover',
    async run(page, url) {
      const d = new Date(); // local 23:59:30 today
      const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 30).toISOString();
      await page.fakeDate(iso);
      await boot(page, url);
      await goto(page, 'garden');
      assert((await dialog(page)) !== GREETING, 'dialog did not change after opening Garden');
      const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 30).toISOString();
      await page.evaluate((n) => {
        window.__setFake(n);
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
        document.dispatchEvent(new Event('visibilitychange'));
      }, next);
      await new Promise((r) => setTimeout(r, 100));
      const line = await dialog(page);
      assert(line === GREETING, `after midnight dialog was "${line}"`);
      assert(await visible(page, '.menu'), 'Home not shown after midnight');
    },
  },
  {
    name: 'corrupt storage',
    async run(page, url) {
      await page.evaluateOnNewDocument(() => { try { localStorage.setItem('snoozle:v1', 'not json'); } catch (e) {} });
      await boot(page, url);
      await goto(page, 'moves');
      const n = await page.$$eval('ul.daycare li:not(.note)', (l) => l.length);
      assert(n === 0, `Future moves has ${n} items`);
    },
  },
  {
    name: 'garden: four skies',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'garden');
      const counts = {};
      for (const [sky, line] of Object.entries(SKY_LINES)) {
        await pickSky(page, sky);
        const got = await dialog(page);
        assert(got === line, `${sky}: dialog was "${got}"`);
        assert(await page.$eval('#scene', (n, c) => n.classList.contains(c), 'w-' + sky), `${sky}: scene class missing`);
        const rainy = sky === 'drizzly' || sky === 'stormy';
        await page.waitForFunction((rainy) => {
          const o = +getComputedStyle(document.querySelector('.umbrella')).opacity;
          return rainy ? o > 0.9 : o < 0.1;
        }, { timeout: 3000 }, rainy).catch(() => { throw new Error(`${sky}: leaf shelter ${rainy ? 'not shown' : 'not hidden'}`); });
        counts[sky] = await page.$$eval('#rain .drop', (d) => d.filter((n) => getComputedStyle(n).display !== 'none').length);
      }
      // Drop positions are random, but the count is fixed and the drizzly cut is a CSS rule, so the visible count is deterministic.
      assert(counts.stormy > 0 && counts.drizzly <= 24, `drop counts ${JSON.stringify(counts)}`);
      const ratio = counts.drizzly / counts.stormy;
      assert(ratio > 0.25 && ratio < 0.42, `drizzly/stormy drops ${counts.drizzly}/${counts.stormy}`);
    },
  },
  {
    name: 'garden: changing sky',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'garden');
      assert((await bondIdx(page)) === 0, 'bond not at line 0 at start');
      await pickSky(page, 'sunny'); await pickSky(page, 'stormy'); await pickSky(page, 'sunny');
      assert((await bondIdx(page)) === 0, 'friendship rose on a repeat sky pick');
      for (let i = 0; i < 3; i++) await careTap(page, 'food');
      assert((await caption(page)) === STAGES[2][0], `sunny + 3 care: "${await caption(page)}"`);
      await pickSky(page, 'stormy');
      assert((await caption(page)) === STAGES[3][0], `stormy swap: "${await caption(page)}"`);
      await pickSky(page, 'sunny');
      assert((await caption(page)) === STAGES[2][0], `back to sunny: "${await caption(page)}"`);
      assert((await bondIdx(page)) === 1, 'friendship is 2 (sky + food): expected "warming up"');
    },
  },
  {
    name: 'recharge: five cards to bloom',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'recharge');
      assert((await dialog(page)) === 'Pick anything, big or small. It all counts.', 'recharge intro wrong');
      const keys = ['food', 'water', 'rest', 'pit', 'outside'];
      let grew = 0, stage = 0;
      const WANT = [1, 1, 2, 2, 3]; // stage after each of the 5 taps (water 1..5)
      assert((await caption(page)) === STAGES[0][0], 'not a seed at start');
      for (const k of keys) {
        await page.waitForFunction(() => document.getElementById('scenePlant').getAnimations().length === 0, { timeout: 3000 }); // previous pop finished
        const popped = await page.evaluate((k) => {
          document.querySelector(`button[data-act=care][data-arg=${k}]`).click();
          return document.getElementById('scenePlant').getAnimations().length > 0;
        }, k);
        const line = await dialog(page);
        const cap = await caption(page);
        const now = STAGES.findIndex((x) => x[0] === cap);
        assert(now === WANT[keys.indexOf(k)], `${k}: stage ${now}, wanted ${WANT[keys.indexOf(k)]}`);
        const isNew = now > stage; stage = now;
        assert(line === CARDS[k][0] + (isNew ? ' Look, our plant grew!' : ''), `${k}: reply "${line}"`);
        assert(popped === isNew, `${k}: plant pop ${popped} vs new stage ${isNew}`);
        if (isNew) grew++;
        const card = await page.$eval(`button[data-act=care][data-arg=${k}]`, (n) => ({ tint: n.classList.contains('together'), leaf: n.textContent.includes('🍃'), off: n.disabled }));
        assert(card.tint && card.leaf && !card.off, `${k}: card state ${JSON.stringify(card)}`);
      }
      assert(grew === 3, `new stages ${grew}, wanted 3`);
      assert((await caption(page)) === STAGES[3][0], 'not in bloom after 5 cards');
      await careTap(page, 'water');
      assert((await dialog(page)) === CARDS.water[1], 'second tap reply is not the alternate');
      await careTap(page, 'water');
      assert((await dialog(page)) === CARDS.water[0], 'third tap did not return to first reply');
    },
  },
  {
    name: 'friendship line only rises',
    async run(page, url) {
      await boot(page, url);
      assert((await bondIdx(page)) === 0, 'not peeking at start');
      await goto(page, 'garden');
      await pickSky(page, 'sunny');
      assert((await bondIdx(page)) === 0, 'friendship 1 should still be peeking');
      await goto(page, 'recharge');
      await careTap(page, 'food');
      assert((await bondIdx(page)) === 1, 'friendship 2 should be "warming up"');
      // [card, expected line index]: friendship 2,2,3,4,4,5,6
      for (const [k, want] of [['food', 1], ['water', 1], ['rest', 1], ['rest', 1], ['outside', 1], ['pit', 2]]) {
        await careTap(page, k);
        const i = await bondIdx(page);
        assert(i === want, `after ${k}: line ${i}, wanted ${want}`);
      }
      await goto(page, 'garden');
      await pickSky(page, 'stormy');
      assert((await bondIdx(page)) === 2, 'line changed after a repeat sky pick');
    },
  },
  {
    name: 'garden: intro and rain caption',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'garden');
      assert((await dialog(page)) === 'Take a breath, close your eyes, and pick the closest sky you see. I’ll match it. Every kind of weather grows our garden.', 'garden intro wrong');
      const texts = () => page.$eval('.today-garden', (n) => [...n.querySelectorAll('p,small')].map((x) => x.textContent));
      assert((await texts()).join('|') === STAGES[0].join('|'), 'seed caption wrong');
      await pickSky(page, 'sunny');
      assert((await texts()).length === 2 && !(await texts())[1].startsWith('Watered'), 'sunny day shows rain line');
      await pickSky(page, 'drizzly');
      const [c, s] = await texts();
      assert(c === STAGES[1][0] && s === 'Watered by today’s rain. ' + STAGES[1][1], `rain caption "${s}"`);
      await pickSky(page, 'stormy');
      assert((await texts()).length === 2 && (await texts())[1].startsWith('Watered by today’s rain.'), 'stormy caption lacks rain line');
    },
  },
];

const failures = [];
let passed = 0;
const url = await serve();
const record = (name, err) => { failures.push(`FAIL ${name}: ${err.message}`.slice(0, 400)); };

for (const width of [320, 390, 460]) {
  const page = await openAt(width);
  try {
    await boot(page, url);
    await layoutChecks(page);
    assert(page.errors.length === 0, 'errors: ' + page.errors.join(' | '));
    passed++;
  } catch (e) { record(`layout@${width}`, e); }
  await page.close();
}

for (const f of flows) {
  const page = await openAt(390);
  try {
    await f.run(page, url);
    assert(page.errors.length === 0, 'errors: ' + page.errors.join(' | '));
    passed++;
  } catch (e) { record(f.name, e); }
  await page.close();
}

await closeAll();
for (const f of failures) console.log(f);
console.log(`flows: ${passed} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
