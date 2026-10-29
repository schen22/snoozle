// Actions: what each action changes (REDUCERS), what Snoozle says (lineFor), which effects play (effectsFor).
// Pure apart from state: no DOM, no animation.
import {COPY} from './copy.js';
import {freshDay, derive, kindOpts} from './state.js';
import {dateKey} from './clock.js';

const pick = a => a[Math.floor(Math.random() * a.length)];
const parkMove = (s, id) => {
  const i = s.moves.findIndex(m => m.id === id);
  const [m] = s.moves.splice(i, 1);
  s.futureMoves = [...s.futureMoves, m.text].slice(-50);
  return {text: m.text, persist: true};
};
const dropFuture = (s, i) => { const text = s.futureMoves[i]; s.futureMoves = s.futureMoves.filter((_, j) => j !== i); return text; };
function learn(s, text) {
  const id = `${s.date}-${++s.seq}`;
  s.moves.push({id, text, used: false});
  const over = derive(s).heavy;
  if (over) s.sheet = {t: 'heavy', id};
  return {text, over};
}
export const REDUCERS = {
  newDay(s) { Object.assign(s, freshDay(dateKey())); return {cancel: true}; },
  reset(s) { return REDUCERS.newDay(s); },
  sync(s, list) { s.futureMoves = list; return {}; },
  go(s, screen) { s.screen = screen; return {}; },
  home(s) { s.screen = 'home'; s.sheet = null; return {}; },
  tap() { return {}; },
  sky(s, id) { s.sky = id; s.bond.add(`${s.date}:sky`); return {}; },
  care(s, k) {
    const n = s.cared.get(k) || 0;
    s.cared.set(k, n + 1); s.care++; s.bond.add(`${s.date}:care:${k}`);
    return {k, n};
  },
  teach(s, text) { return learn(s, text); },
  bring(s, i) { const c = learn(s, dropFuture(s, +i)); c.persist = true; return c; },
  use(s, id) { const m = s.moves.find(x => x.id === id); m.used = true; return {text: m.text}; },
  save(s, id) { return parkMove(s, id); },
  wait(s, id) { s.sheet = null; return parkMove(s, id); },
  letgo(s, i) { return {text: dropFuture(s, +i), persist: true}; },
  heavySave(s) { s.sheet = {t: 'which'}; return {}; },
  heavyCarry(s) { s.sheet = null; return {}; },
  usual(s, d) { const v = Math.min(10, Math.max(1, s.usual + +d)); const same = v === s.usual; s.usual = v; return {same}; },
  kind(s, k) { s.sheet = {t: 'kind', k: +k}; return {}; },
  thought(s, arg) {
    const [k, o] = arg.split(':').map(Number);
    const opt = kindOpts(k)[o];
    s.bond.add(`${s.date}:thought:${k}`);
    s.sheet = null;
    if (opt.go) s.screen = opt.go;
    return {opt, wander: opt === COPY.thoughts.wander};
  }
};
function movesIntro(d) {
  const m = COPY.moves, S = d.sky && COPY.skies[d.sky];
  if (!d.sky) return m.introNone;
  if (d.heavy) return m.introOver(S.label.toLowerCase());
  if (d.N < d.usual) return m.introLow(S.label);
  return m.introOk;
}
export function lineFor(type, arg, b, a, c) {
  switch (type) {
    case 'newDay': case 'reset': return COPY.greeting;
    case 'home': return COPY.home;
    case 'go': return {
      garden: a.sky ? COPY.skies[a.sky].say : COPY.garden.intro,
      recharge: COPY.recharge.intro, moves: movesIntro(a), thoughts: COPY.thoughts.intro}[arg];
    case 'tap': return pick(COPY.tap);
    case 'sky': return COPY.skies[arg].say;
    case 'care': return COPY.recharge.cards.find(x => x.k === arg).r[c.n % 2] + (a.stage > b.stage ? COPY.recharge.grew : '');
    case 'teach': return c.over ? null : COPY.moves.learned(c.text);
    case 'bring': return c.over ? null : COPY.moves.welcome(c.text);
    case 'use': return pick(COPY.moves.used);
    case 'save': return COPY.moves.saved(c.text);
    case 'wait': return COPY.moves.safe(c.text);
    case 'letgo': return COPY.moves.bye(c.text);
    case 'heavyCarry': return COPY.moves.carry;
    case 'usual': return c.same ? null : COPY.moves.usualSet(a.usual);
    case 'thought': return c.opt.say;
  }
  return null;
}
// Pure: which reactions play. One body reaction (relief 3 > sit 2 > hop 1) plus accents.
const BUDDY = {left: 40, top: 45}, PLANT = {left: 68, top: 38};
export function effectsFor(type, b, a, c) {
  const acc = [];
  const F = (e, at, n = 1) => acc.push({k: 'float', e, at, n});
  let body = null;
  switch (type) {
    case 'go': case 'usual': body = 'hop'; break;
    case 'sky': if (a.sky === 'sunny' || a.sky === 'cloudy') F('💗', BUDDY, 2); break;
    case 'care': body = 'hop'; F(c.k === 'rest' ? '💤' : '💗', BUDDY, 2); break;
    case 'teach': case 'bring':
      body = !b.heavy && a.heavy ? 'tremble' : 'hop'; F('✨', BUDDY);
      if (a.unfinished > b.unfinished && a.unfinished <= 5) acc.push({k: 'bundle'});
      break;
    case 'use': body = 'sit'; break;
    case 'save': case 'wait': case 'letgo':
      body = 'relief'; F('💨', {left: 58, top: 28}); acc.push({k: 'float', e: 'phew~', at: {left: 28, top: 30}, n: 1, word: true}); break;
    case 'tap': F('💗', BUDDY); break;
    case 'thought': body = 'hop'; F(c.wander ? '🍃' : '💗', BUDDY, 2); break;
  }
  if (type === 'care' || a.stage > b.stage) F('✨', PLANT);
  if (a.stage > b.stage) acc.push({k: 'pop'});
  if (a.line > b.line) { acc.push({k: 'flash'}); F('💞', BUDDY, 3); }
  return {body, acc};
}
