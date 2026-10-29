// Static SVG markup (sprites kept exactly as drawn in the prototype)
export function plantSVG(stage, rainy){
  let p = `<ellipse class="p-soil" cx="20" cy="52" rx="15" ry="5"/>`;
  if (rainy) p += `<g><ellipse class="p-cloud" cx="18" cy="9" rx="10" ry="5"/><ellipse class="p-cloud" cx="25" cy="6" rx="6" ry="5"/><line class="p-drop" x1="15" y1="16" x2="14" y2="20"/><line class="p-drop" x1="23" y1="16" x2="22" y2="20"/></g>`;
  if (stage === 0) p += `<circle class="p-dot" cx="17" cy="51" r="1.5"/><circle class="p-dot" cx="23" cy="52" r="1.5"/>`;
  if (stage >= 1) p += `<path class="p-stem" d="M20 51 L20 ${stage === 1 ? 42 : 30}"/>`;
  if (stage === 1) p += `<path class="p-leaf" d="M20 44 C14 38 10 42 12 45 C15 47 18 46 20 44Z"/><path class="p-leaf" d="M20 44 C26 38 30 42 28 45 C25 47 22 46 20 44Z"/>`;
  if (stage >= 2) p += `<path class="p-leaf" d="M20 42 C13 36 9 40 11 43 C14 45 18 44 20 42Z"/><path class="p-leaf" d="M20 39 C27 33 31 37 29 40 C26 42 22 41 20 39Z"/>`;
  if (stage === 2) p += `<ellipse class="p-bud" cx="20" cy="27" rx="4" ry="6"/>`;
  if (stage === 3) p += [0,72,144,216,288].map(a => `<circle class="p-pet" cx="${20+6*Math.cos(a*Math.PI/180)}" cy="${28+6*Math.sin(a*Math.PI/180)}" r="4.2"/>`).join("") + `<circle class="p-mid" cx="20" cy="28" r="3.5"/>`;
  return `<svg viewBox="0 0 40 60" aria-hidden="true">${p}</svg>`;
}
