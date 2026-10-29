// The action pipeline: reduce, derive, render, save, speak, play effects.
import {state, derive} from './state.js';
import {store} from './store.js';
import {REDUCERS, lineFor, effectsFor} from './actions.js';
import {render} from './view/render.js';
import {fx, cancelFx} from './fx.js';
import {say, cancelTyper} from './dialog.js';

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
