// Boot: build the screens, wire the clock and storage, load Future moves, start the day.
import {state} from './state.js';
import {store} from './store.js';
import {watchDay} from './clock.js';
import {act} from './act.js';
import {build} from './view/build.js';

build();
Promise.resolve(store.load()).then(future => { act('sync', future); act('newDay'); });
watchDay(() => state.date, () => act('newDay'));
addEventListener('storage', e => { if (e.key === store.key || e.key === null) act('sync', store.load()); });
window.__snoozle = {state, act}; // for the browser tests
