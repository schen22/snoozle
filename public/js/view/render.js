// Render: update the built skeletons from derived state.
import {COPY} from '../copy.js';
import {SKY, state, kindOpts} from '../state.js';
import {$, el, btn, ui} from './dom.js';
import {plantSVG} from './plants.js';

let packN = -1, plantStage = -1;
function renderScene(d) {
  ui.scene.setAttribute('class', 'w-' + (d.sky || 'none') + ' ' + (d.sky ? SKY[d.sky].anim : 'a-sway') + (d.heavy ? ' heavy' : ''));
  const shown = Math.min(5, d.unfinished);
  if (shown !== packN) {
    const colors = ["var(--heart)", "var(--sun)", "var(--sky)", "var(--leaf2)", "var(--heart)"];
    const items = Array.from({length:shown}, (_, i) =>
      `<rect class="bundle" style="fill:${colors[i]}" x="${18 + (i % 3) * 7}" y="${-57 - Math.floor(i / 3) * 8 - (i % 3 === 1 ? 3 : 0)}" width="7" height="15" rx="3"/>`).join("");
    $("pack").innerHTML = shown ? items +
      `<rect class="bag" x="16" y="-50" width="27" height="34" rx="8"/><path class="bag-flap" d="M16 -40 Q29 -32 43 -40"/><rect class="bag-pocket" x="26" y="-31" width="13" height="10" rx="3"/>` : "";
    $("strap").innerHTML = shown ? `<path class="strap" d="M8 -53 Q18 -40 25 -19"/>` : "";
    packN = shown;
  }
  if (d.stage !== plantStage) {
    $("scenePlant").innerHTML = plantSVG(d.stage, false).replace(/^<svg[^>]*>|<\/svg>$/g, "");
    plantStage = d.stage;
  }
  ui.bond.textContent = COPY.bond[d.line];
}
function renderMoves(d) {
  const M = COPY.moves, S = d.sky && COPY.skies[d.sky];
  ui.moveHint.textContent = S && d.N < d.usual ? M.hintBelow(S.e, S.label, d.N) : M.hintOk(d.N);
  ui.usual.textContent = d.usual;
  ui.down.disabled = d.usual <= 1; ui.up.disabled = d.usual >= 10;
  const cells = [];
  for (let i = 0; i < Math.max(d.N, state.moves.length); i++) {
    const m = state.moves[i];
    if (!m) { cells.push(el('div', {class: 'move empty'}, M.dash)); continue; }
    const over = !m.used && i >= d.N;
    cells.push(el('div', {class: 'move' + (m.used ? ' used' : '') + (over ? ' heavy' : '')},
      el('span', {class: 'mtext'}, m.text),
      m.used ? null : el('span', {class: 'mrow'}, btn('use', m.id, 'mini', M.useIt), btn('save', m.id, 'mini', M.saveIt))));
  }
  ui.grid.replaceChildren(...cells);
  ui.futureHint.hidden = !state.futureMoves.length;
  ui.future.replaceChildren(...(state.futureMoves.length ? state.futureMoves.map((t, i) =>
    el('li', {}, el('span', {}, t), el('span', {class: 'mrow'}, btn('bring', i, 'mini', M.bring), btn('letgo', i, 'mini', M.letGo))))
    : [el('li', {class: 'note'}, M.futureEmpty)]));
}
function renderSheet() {
  const s = state.sheet;
  ui.modal.hidden = !s;
  if (!s) return;
  const M = COPY.moves;
  let text, opts;
  if (s.t === 'heavy') {
    const m = state.moves.find(x => x.id === s.id);
    text = M.heavy(m ? m.text : ''); opts = [[M.heavySave, 'heavySave'], [M.heavyCarry, 'heavyCarry']];
  } else if (s.t === 'which') {
    text = M.which; opts = state.moves.filter(m => !m.used).map(m => [m.text, 'wait', m.id]);
  } else {
    const k = COPY.thoughts.kinds[s.k];
    text = COPY.thoughts.looks(k.s.toLowerCase(), k.q); opts = kindOpts(s.k).map((o, i) => [o.label, 'thought', s.k + ':' + i]);
  }
  ui.msay.textContent = text;
  ui.mopts.replaceChildren(...opts.map(([label, a, arg]) => btn(a, arg, 'opt', label)));
}
export function render(d) {
  renderScene(d);
  const home = state.screen === 'home';
  ui.home.hidden = !home; ui.backTop.hidden = home;
  for (const [id] of COPY.menu) ui[id + '-tab'].hidden = state.screen !== id;
  for (const id in ui.sky) ui.sky[id].setAttribute('aria-pressed', d.sky === id);
  const rainy = d.sky === 'drizzly' || d.sky === 'stormy', [cap, more] = COPY.garden.stages[d.stage];
  ui.garden.innerHTML = plantSVG(d.stage, rainy);
  ui.garden.append(el('div', {}, el('p', {}, cap), el('small', {}, (rainy ? COPY.garden.rain : '') + more)));
  for (const c of COPY.recharge.cards) {
    const done = state.cared.has(c.k);
    ui.cards[c.k].box.classList.toggle('together', done);
    ui.cards[c.k].title.textContent = c.t + (done ? ' 🍃' : '');
  }
  renderMoves(d);
  renderSheet();
}
