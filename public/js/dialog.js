// Dialog: the typewriter for Snoozle's speech box; the full line goes to the live region once.
import {ui, reduced} from './view/dom.js';

const typer = {timer: 0, text: ''};
export const cancelTyper = () => clearInterval(typer.timer);
export function skipTyper() { cancelTyper(); ui.typed.textContent = typer.text; }
export function say(text) {
  if (text == null) return;
  cancelTyper();
  typer.text = text;
  ui.live.textContent = text; // the full line, once, for screen readers
  if (reduced()) { ui.typed.textContent = text; return; }
  let i = 0;
  ui.typed.textContent = '';
  typer.timer = setInterval(() => { ui.typed.textContent = text.slice(0, ++i); if (i >= text.length) cancelTyper(); }, 18);
}
