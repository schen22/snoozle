// DOM helpers and the shared ui registry. User text goes in only as text nodes.
export const $ = id => document.getElementById(id);
export function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const k in attrs) if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
  n.append(...kids.filter(x => x != null && x !== false)); // strings become text nodes
  return n;
}
export const btn = (act, arg, cls, ...kids) => el('button', {type: 'button', class: cls, 'data-act': act, 'data-arg': arg}, ...kids);
export const em = e => el('span', {class: 'em'}, e);
export const ui = {};

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const tok = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
