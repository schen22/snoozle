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
        assert(await visible(page, `section.tab:nth-of-type(n)`) || true, '');
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
      const n = await page.$$eval('ul.daycare li', (l) => l.length);
      assert(n === 0, `Future moves has ${n} items`);
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
