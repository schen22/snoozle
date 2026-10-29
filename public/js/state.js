// State: facts only, and derive() for everything computed from them.
import {COPY} from './copy.js';

// Facts only. Everything else (water, stage, N, heavy, friendship, line) is derived on every render.
export const SKY = {sunny: {water: 1, anim: 'a-bounce'}, cloudy: {water: 1, anim: 'a-sway'}, drizzly: {water: 2, anim: 'a-droop'}, stormy: {water: 2, anim: 'a-nap'}};
const STAGE_AT = [0, 1, 3, 5];         // seed, sprout, bud, bloom: water needed
const BOND_AT = [0, 2, 6, 12, 20, 35]; // friendship needed for each line in COPY.bond
export const freshDay = date => ({date, sky: null, care: 0, cared: new Map(), moves: [], seq: 0, bond: new Set(), usual: 4, screen: 'home', sheet: null});
export const state = {...freshDay(''), futureMoves: []};
const nFor = (sky, b) => sky === 'drizzly' ? Math.max(1, Math.ceil(b * 0.75)) : sky === 'stormy' ? Math.max(1, Math.round(b / 2)) : b;
export function derive(s) {
  const water = (s.sky ? SKY[s.sky].water : 0) + s.care;
  const N = nFor(s.sky, s.usual);
  const unfinished = s.moves.filter(m => !m.used).length;
  const load = s.moves.length; // taught today and still in the day (used + unfinished)
  const friendship = s.bond.size;
  return {
    sky: s.sky, usual: s.usual, water, N, unfinished, load, friendship,
    stage: STAGE_AT.filter(t => water >= t).length - 1,
    heavy: load > N && unfinished >= 1,
    line: BOND_AT.filter(t => friendship >= t).length - 1
  };
}

export const kindOpts = k => [...COPY.thoughts.kinds[k].opts, COPY.thoughts.wander];
