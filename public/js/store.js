// Store: Future moves in localStorage (snoozle:v1), validated on read.
export const store = (() => {
  const KEY = 'snoozle:v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  return {
    key: KEY,
    load() { // once at boot; may become async later
      const o = read();
      if (!o || o.v !== 1 || !Array.isArray(o.future)) return [];
      return o.future.filter(x => typeof x === 'string').map(x => x.trim().slice(0, 40)).filter(Boolean).slice(0, 50);
    },
    save(future) { // fire and forget; a newer build's data is never overwritten
      try {
        const o = read();
        if (o && typeof o === 'object' && o.v !== 1) return;
        localStorage.setItem(KEY, JSON.stringify({v: 1, future}));
      } catch (e) {}
    }
  };
})();
