// Boot: build the screens, wire taps, history, clock and storage, load Future moves, start the day.
import {COPY} from './copy.js';
import {state} from './state.js';
import {store} from './store.js';
import {watchDay} from './clock.js';
import {act} from './act.js';
import {build} from './view/build.js';
import {$} from './view/dom.js';
import {skipTyper} from './dialog.js';

build();
// Taps (one delegated listener) and the phone's back gesture.
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
Promise.resolve(store.load()).then(future => { act('sync', future); act('newDay'); });
watchDay(() => state.date, () => act('newDay'));
addEventListener('storage', e => { if (e.key === store.key || e.key === null) act('sync', store.load()); });
if (navigator.webdriver) window.__snoozle = {state, act, COPY}; // browser tests only
