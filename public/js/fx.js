// Effects: one-shot reactions with Web Animations and floating particles. Loops stay CSS classes.
import {$, el, ui, reduced, tok} from './view/dom.js';

function play(node, frames, ms, easing = 'ease-out', delay = 0) {
  if (reduced()) return null;
  return node.animate(frames, {duration: ms, easing, delay, fill: 'backwards'});
}
const KF = {
  hop: [{transform: 'none'}, {transform: 'scale(1.08,.9)', offset: .2}, {transform: 'translateY(-22px) scale(.95,1.06)', offset: .5}, {transform: 'scale(1.06,.94)', offset: .8}, {transform: 'none'}],
  sit: [{transform: 'none'}, {transform: 'translateY(5px) scale(1.12,.8)', offset: .25}, {transform: 'translateY(5px) scale(1.12,.8)', offset: .8}, {transform: 'none'}],
  relief: [{transform: 'none'}, {transform: 'translateY(-6px) scale(.88,1.18)', offset: .35}, {transform: 'translateY(0) scale(1.08,.92)', offset: .6}, {transform: 'none'}],
  tremble: [{transform: 'none'}, {transform: 'rotate(4deg) translateY(3px)'}, {transform: 'rotate(2deg) translateY(2px)'}, {transform: 'rotate(4.5deg) translateY(3px)'}, {transform: 'rotate(2.5deg) translateY(2px)'}, {transform: 'rotate(4deg) translateY(3px)'}, {transform: 'none'}]
};
const BODY = {hop: [1, 'cubic-bezier(.3,.7,.4,1)'], tremble: [1, 'ease-in-out'], sit: [2, 'ease-in-out'], relief: [3, 'ease-out']};
const MS = {sit: 1300, relief: 900, tremble: 1200};
let current = null;
function body(name) {
  const [pri, easing] = BODY[name];
  if (current && current.anim.playState === 'running' && current.pri > pri) return; // a lower reaction is dropped
  if (current) current.anim.cancel();
  const anim = play($('buddy-react'), KF[name], MS[name] || parseFloat(tok('--t-react')), easing);
  current = anim && {anim, pri};
}
function float(emoji, at, i = 0, word = false) {
  const wrap = $('scene-wrap');
  if (reduced() || (!word && wrap.querySelectorAll('.fl').length >= 4)) return; // the "phew~" word is never dropped
  const s = el('span', {class: 'fl' + (word ? ' word' : ''), style: `left:${at.left + Math.random() * 20}%;top:${at.top + Math.random() * 15}%`}, emoji);
  wrap.append(s);
  const a = play(s, [{opacity: 0, transform: 'translateY(0) scale(.7)'}, {opacity: 1, offset: .15}, {opacity: 0, transform: 'translateY(-70px) scale(1.2)'}], 1300, 'ease-out', i * 150);
  a.onfinish = () => s.remove();
  a.oncancel = () => s.remove();
}
export function fx(e) {
  if (e.body) body(e.body);
  for (const a of e.acc) {
    if (a.k === 'float') for (let i = 0; i < a.n; i++) float(a.e, a.at, i, a.word);
    else if (a.k === 'pop') play($('scenePlant'), [{transform: 'scale(.55)'}, {transform: 'none'}], 600, tok('--ease-spring'));
    else if (a.k === 'bundle') { const b = [...document.querySelectorAll('#pack .bundle')].pop(); if (b) play(b, [{transform: 'scale(.55)'}, {transform: 'none'}], 450, tok('--ease-spring')); }
    else if (a.k === 'flash') play(ui.bond, [{opacity: .3, transform: 'translateY(-3px)'}, {opacity: 1, transform: 'none'}], 1600);
  }
}
export function cancelFx() {
  current = null;
  document.getAnimations().forEach(a => { if (!a.animationName && !a.transitionProperty) a.cancel(); }); // script animations only; CSS loops stay
  document.querySelectorAll('.fl').forEach(n => n.remove());
}
