// Skeletons for every screen, built once at boot.
import {COPY} from '../copy.js';
import {$, el, btn, em, ui} from './dom.js';

function makeRain(){
  let h = "";
  for (let i = 0; i < 22; i++){
    const x = 10 + Math.random()*300, y = 40 + Math.random()*40, d = (Math.random()*0.9).toFixed(2);
    h += `<line class="drop" x1="${x}" y1="${y}" x2="${x-3}" y2="${y+9}" style="animation-delay:-${d}s"/>`;
  }
  $("rain").innerHTML = h;
}

// Skeletons: built once. render() only changes lists, labels and attributes, so drafts and focus survive.
export function build() {
  makeRain();
  const app = $('app');
  $('scene').setAttribute('aria-label', COPY.sceneLabel);
  ui.scene = $('scene'); ui.bond = el('p', {class: 'bond'});
  ui.typed = el('span', {id: 'typed', 'aria-hidden': 'true'});
  ui.live = el('span', {id: 'live', class: 'sr', 'aria-live': 'polite'});
  const dialog = el('div', {class: 'dialog'}, el('span', {class: 'nametag'}, COPY.tag),
    el('p', {id: 'say', 'data-act': 'skip'}, ui.typed, ui.live));

  ui.home = el('div', {}, el('div', {class: 'menu', role: 'navigation', 'aria-label': COPY.menuLabel},
    ...COPY.menu.map(([id, e, t]) => btn('go', id, '', em(e), el('span', {}, t)))),
    btn('reset', null, 'reset', COPY.reset));
  ui.backTop = btn('home', null, 'back back-top', COPY.back);
  $('scene-wrap').append(ui.backTop);

  // Garden
  ui.sky = {};
  const G = COPY.garden;
  ui.garden = el('div', {class: 'today-garden'});
  const weather = el('div', {class: 'weather'}, ...Object.entries(COPY.skies).map(([id, s]) =>
    (ui.sky[id] = btn('sky', id, 'wbtn', el('span', {}, s.e), s.label))));
  // Recharge
  ui.cards = {};
  const camp = el('div', {class: 'camp'}, ...COPY.recharge.cards.map(c => {
    ui.cards[c.k] = {title: el('span', {}, c.t), box: btn('care', c.k, 'cbtn', em(c.e))};
    ui.cards[c.k].box.append(el('span', {}, ui.cards[c.k].title, el('small', {}, c.s)));
    return ui.cards[c.k].box;
  }));
  // Moves
  const M = COPY.moves;
  ui.moveHint = el('p', {class: 'hint'}); ui.usual = el('b'); ui.grid = el('div', {class: 'moves'}); ui.future = el('ul', {class: 'daycare'});
  ui.futureHint = el('p', {class: 'hint'}, M.futureHint);
  ui.down = btn('usual', -1, 'step', '−'); ui.down.setAttribute('aria-label', M.fewer);
  ui.up = btn('usual', 1, 'step', '+'); ui.up.setAttribute('aria-label', M.more);
  const input = el('input', {id: 'newmove', placeholder: M.placeholder, maxlength: 40, 'aria-label': M.inputLabel});
  input.addEventListener('focus', () => input.scrollIntoView({block: 'nearest'}));
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) ui.teach.click(); });
  ui.teach = btn('teach', null, 'pbtn', M.teach);
  // Thoughts
  const T = COPY.thoughts;
  const kinds = el('div', {class: 'kinds'}, ...T.kinds.map((k, i) => btn('kind', i, 'kbtn', k.t, el('small', {}, k.s))));

  const tab = (id, ...kids) => (ui[id] = el('section', {class: 'tab'}, ...kids));
  app.append(ui.bond, dialog, ui.home,
    tab('garden-tab', weather, el('h2', {}, G.card), ui.garden),
    tab('recharge-tab', camp),
    tab('moves-tab', ui.moveHint, el('div', {class: 'teach'}, input, ui.teach), ui.grid,
      el('div', {class: 'baseline'}, M.usual, ui.down, ui.usual, ui.up),
      el('h2', {}, M.future), ui.futureHint, ui.future),
    tab('thoughts-tab',
      el('div', {class: 'grass-box'}, el('div', {class: 'grass-anim', 'aria-hidden': 'true'}, '🌾🌾🌾'),
        el('label', {for: 'thought'}, T.label, el('span', {}, T.optional)),
        el('textarea', {id: 'thought', placeholder: T.placeholder}),
        el('p', {}, T.ask), kinds)));
  ui.msay = el('p', {id: 'msay'}); ui.mopts = el('div', {class: 'opts'});
  ui.modal = el('div', {class: 'modal', hidden: true}, el('div', {class: 'sheet'},
    el('div', {class: 'dialog', role: 'dialog', 'aria-modal': 'true'}, el('span', {class: 'nametag'}, COPY.tag), ui.msay, ui.mopts)));
  document.body.append(ui.modal);
}
