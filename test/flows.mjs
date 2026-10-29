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

const teach = async (page, text) => {
  await page.$eval('#newmove', (n, t) => { n.value = t; }, text);
  await tap(page, 'button[data-act=teach]');
};
const heavy = (page) => page.$eval('#scene', (n) => n.classList.contains('heavy'));
const usualN = (page) => page.$eval('.baseline b', (n) => n.textContent);
const sel = (page, s) => page.$$eval(s, (ns) => ns.map((n) => n.textContent));
const tapAll = (page, s) => page.$$eval(s, (ns) => ns.forEach((n) => n.click()));
const stepTo = async (page, v) => { // usual down to 1 then up to v
  for (let i = 0; i < 9; i++) await tap(page, 'button[data-act=usual][data-arg="-1"]');
  for (let i = 1; i < v; i++) await tap(page, 'button[data-act=usual][data-arg="1"]');
};

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
  {
    name: 'moves: load counts used moves (N=2)',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      await stepTo(page, 4);
      await pickSky(page, 'stormy'); // round(4/2) = 2
      await teach(page, 'A'); await teach(page, 'B');
      await tapAll(page, 'button[data-act=use]');
      assert(!(await heavy(page)), 'heavy at load 2');
      await teach(page, 'C');
      await page.waitForFunction(() => document.getElementById('scene').classList.contains('heavy'));
      assert(await visible(page, '.modal'), 'no pop-up past N');
      await tap(page, 'button[data-act=heavyCarry]');
      const flags = await page.$$eval('.move', (c) => c.map((n) => n.classList.contains('heavy')));
      assert(flags.join() === 'false,false,true', 'pink border flags ' + flags);
      await tap(page, '.move:nth-child(3) button[data-act=save]');
      await page.waitForFunction(() => !document.getElementById('scene').classList.contains('heavy'));
      assert(await page.$('.fl.word'), 'no relief word');
    },
  },
  {
    name: 'moves: hint line and stepper',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      const hint = () => page.$eval('section.tab:nth-of-type(3) > .hint', (n) => n.textContent);
      assert((await hint()) === '4 feels right today. You can carry more, but it gets heavy.', 'plain hint');
      assert((await usualN(page)) === '4', 'default usual');
      await pickSky(page, 'drizzly');
      assert((await hint()) === '🌧️ Drizzly today, so 3 feels right instead of your usual 4. You can carry more, but it gets heavy.', 'drizzly hint: ' + await hint());
      await pickSky(page, 'stormy');
      assert((await hint()).startsWith('⛈️ Stormy today, so 2 feels right instead of your usual 4.'), 'stormy hint');
      await pickSky(page, 'sunny');
      assert((await hint()).startsWith('4 feels right today.'), 'sunny hint');
      for (let i = 0; i < 12; i++) await tap(page, 'button[data-act=usual][data-arg="1"]');
      assert((await usualN(page)) === '10', 'max 10');
      assert(await page.$eval('button[data-act=usual][data-arg="1"]', (n) => n.disabled), '+ not disabled at 10');
      await tap(page, 'button[data-act=usual][data-arg="-1"]');
      assert((await dialog(page)) === 'Got it. On a sunny day, we’ll aim for 9.', 'stepper line');
      for (let i = 0; i < 12; i++) await tap(page, 'button[data-act=usual][data-arg="-1"]');
      assert((await usualN(page)) === '1', 'min 1');
      await stepTo(page, 6);
      await pickSky(page, 'stormy');
      assert((await hint()).startsWith('⛈️ Stormy today, so 3 feels right instead of your usual 6.'), 'N follows usual in any sky');
    },
  },
  {
    name: 'moves: grid cells and teach',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      const cells = () => page.$$eval('.moves .move', (c) => c.map((n) => n.className.includes('empty') ? n.textContent : 'M:' + n.querySelector('.mtext').textContent));
      assert((await cells()).join() === '—,—,—,—', 'four empty cells');
      await stepTo(page, 6);
      assert((await cells()).length === 6, 'six cells at usual 6');
      await teach(page, 'Call Mom');
      assert((await dialog(page)) === 'I learned Call Mom!', 'learned line');
      assert((await cells())[0] === 'M:Call Mom' && (await cells()).length === 6, 'grid fills');
      await page.focus('#newmove');
      await page.keyboard.type('Walk');
      await page.keyboard.press('Enter');
      assert((await dialog(page)) === 'I learned Walk!', 'Enter teaches');
      assert((await page.$eval('#newmove', (n) => n.maxLength)) === 40, 'maxlength');
      await teach(page, 'x'.repeat(60));
      assert((await sel(page, '.mtext'))[2].length === 40, 'trimmed to 40');
      assert(!(await visible(page, '.modal')), 'no pop-up within N');
    },
  },
  {
    name: 'moves: past N pop-up, save one, carry',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      await stepTo(page, 1);
      await pickSky(page, 'sunny');
      await teach(page, 'One');
      assert(!(await visible(page, '.modal')), 'pop-up at N');
      await teach(page, 'Two');
      await page.waitForFunction(() => !document.querySelector('.modal').hidden);
      assert((await page.$eval('#msay', (n) => n.textContent)) === 'I learned Two! My backpack’s getting heavy, though. We usually carry about four. Want to try that?', 'pop-up text');
      assert((await sel(page, '.modal .opt')).join('|') === 'Sure, save one for later|I’ll carry it today', 'pop-up options');
      await tap(page, 'button[data-act=heavyCarry]');
      assert((await dialog(page)) === 'Okay, I’ve got it! Let me know if it gets too heavy.', 'carry line');
      assert(!(await visible(page, '.modal')), 'pop-up closed');
      await teach(page, 'Three');
      await tap(page, 'button[data-act=heavySave]');
      assert((await page.$eval('#msay', (n) => n.textContent)) === 'Which one can wait?', 'which title');
      assert((await sel(page, '.modal .opt')).join('|') === 'One|Two|Three', 'which lists moves');
      await tap(page, '.modal button[data-act=wait][data-arg$="-2"]');
      assert((await dialog(page)) === 'Two is safe in Future moves. Ahh, that’s lighter.', 'safe line');
      assert((await sel(page, '.mtext')).join() === 'One,Three', 'Two left the grid');
      assert((await sel(page, '.daycare li span:first-child')).join() === 'Two', 'Two in future');
    },
  },
  {
    name: 'moves: used it, save for later, future moves',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      await pickSky(page, 'sunny');
      assert((await sel(page, '.daycare li')).join() === 'Nothing saved yet. That’s a nice, light feeling.', 'empty future');
      await teach(page, 'Stretch'); await teach(page, 'Email');
      await tap(page, '.move:nth-child(1) button[data-act=use]');
      assert(['Nice! That one’s done. Let’s let it count.', 'Move used! Take a breath before the next one.'].includes(await dialog(page)), 'used line');
      assert(await page.$eval('.move.used .mtext', (n) => getComputedStyle(n).textDecorationLine.includes('line-through')), 'crossed out');
      assert((await page.$$('.move.used button')).length === 0, 'buttons gone');
      assert(await page.evaluate(() => document.getElementById('buddy-react').getAnimations().length > 0), 'no sit-down breather');
      await tap(page, '.move:nth-child(2) button[data-act=save]');
      assert((await dialog(page)) === 'Email is saved in Future moves. It’ll wait.', 'save line');
      assert((await page.$eval('.fl.word', (n) => n.textContent).catch(() => '')) === 'phew~', 'no phew~');
      await page.reload({ waitUntil: 'load' }); await page.waitForSelector('#typed');
      await goto(page, 'moves');
      await page.waitForFunction(() => document.querySelectorAll('.daycare li button').length > 0);
      assert((await sel(page, '.daycare li span:first-child')).join() === 'Email', 'future survives reload');
      await tap(page, '.daycare button[data-act=bring]');
      assert((await dialog(page)) === 'Welcome back, Email!', 'welcome line');
      assert((await sel(page, '.mtext')).join() === 'Email', 'brought back');
      await tap(page, '.move:nth-child(1) button[data-act=save]');
      await tap(page, '.daycare button[data-act=letgo]');
      assert((await dialog(page)) === 'Bye, Email. Letting go is a move too.', 'bye line');
      assert((await sel(page, '.daycare li')).join() === 'Nothing saved yet. That’s a nice, light feeling.', 'empty again');
    },
  },
  {
    name: 'moves: strain while heavy',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      await stepTo(page, 1);
      await pickSky(page, 'sunny');
      const face = () => page.evaluate(() => ['.mouth-strain', '.brows', '.sweat'].map((s) => getComputedStyle(document.querySelector('#scene ' + s)).display !== 'none').join());
      assert((await face()) === 'false,false,false', 'strain face before heavy');
      await teach(page, 'One'); await teach(page, 'Two');
      await tap(page, 'button[data-act=heavyCarry]');
      assert((await face()) === 'true,true,true', 'strain face while heavy');
      assert(await page.$eval('.mouth-happy', (n) => getComputedStyle(n).display === 'none'), 'happy mouth hidden');
      const t = await page.evaluate(() => document.getElementById('buddy-react').getAnimations().map((a) => a.effect.getTiming().duration));
      assert(t.includes(1200), 'no 1.2s tremble on crossing: ' + t);
      const sag = await page.$eval('#buddy-pose', (n) => [getComputedStyle(n).animationName, getComputedStyle(n).animationDuration].join());
      assert(sag === 'sag,2.4s', 'sag loop ' + sag);
      await tap(page, '.move:nth-child(2) button[data-act=save]');
      assert((await face()) === 'false,false,false', 'strain face after save');
    },
  },
  {
    name: 'moves: typed text is inert',
    async run(page, url) {
      await boot(page, url);
      await goto(page, 'moves');
      await teach(page, '<img src=x onerror=alert(1)>');
      assert((await page.$$('.moves img, #typed img, #msay img')).length === 0, 'img element created');
      assert((await sel(page, '.mtext'))[0] === '<img src=x onerror=alert(1)>', 'shown as text');
      assert((await dialog(page)) === 'I learned <img src=x onerror=alert(1)>!', 'say line as text');
      await tap(page, '.move:nth-child(1) button[data-act=save]');
      assert((await page.$$('.daycare img')).length === 0, 'img in future');
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
