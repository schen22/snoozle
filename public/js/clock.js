// Clock: today's date key and the day-rollover watch.
export function dateKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// Calls onNewDay when the date moves past today(): on return to the tab and once a minute.
export function watchDay(today, onNewDay) {
  const tick = () => { if (today() && dateKey() !== today()) onNewDay(); };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  setInterval(tick, 60000);
}
