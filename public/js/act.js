// The action pipeline, and the one delegated listener that turns taps into actions.
import {state, derive} from './state.js';
import {store} from './store.js';
import {REDUCERS, lineFor, effectsFor} from './actions.js';
import {$} from './view/dom.js';
import {render} from './view/render.js';
import {fx, cancelFx} from './fx.js';
import {say, skipTyper, cancelTyper} from './dialog.js';

export function act(type, arg) {
  const before = derive(state), was = state.screen;
  const ctx = REDUCERS[type](state, arg) || {};
  // One history entry per visit off Home, so the phone's back gesture returns Home instead of leaving.
  if (was === 'home' && state.screen !== 'home') history.pushState({snz: 1}, '');
  else if (was !== 'home' && state.screen === 'home' && history.state?.snz) history.back();
  if (ctx.cancel) { cancelTyper(); cancelFx(); }
  const after = derive(state);
  render(after);
  if (ctx.persist) store.save(state.futureMoves);
  say(lineFor(type, arg, before, after, ctx));
  fx(effectsFor(type, before, after, ctx));
}
// click events: one delegated listener
addEventListener('popstate', () => { if (state.screen !== 'home') act('home'); });
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const type = t.dataset.act;
  let arg = t.dataset.arg;
  if (type === 'skip') return skipTyper();
  if (type === 'teach') {
    const input = $('newmove');
    arg = input.value.trim().slice(0, 40);
    if (!arg) return input.focus();
    input.value = '';
  }
  if (type === 'thought') $('thought').value = '';
  act(type, arg);
});
