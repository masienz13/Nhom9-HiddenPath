const HiddenCart = (() => {
  const KEY = 'hp_cart';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }
  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    _dispatch();
  }
  function _dispatch() {
    window.dispatchEvent(new CustomEvent('hp:cart-update', { detail: { count: count() } }));
  }

  function add(tourId, date, people) {
    const tours = window.hiddenPathTours || [];
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return false;

    const items = getAll();
    const idx = items.findIndex(i => i.tourId === tourId && i.date === date);
    if (idx >= 0) {
      // update people count
      items[idx].people = Math.min(12, items[idx].people + people);
    } else {
      items.push({
        id: tourId + '_' + Date.now(),
        tourId,
        date,
        people,
        addedAt: Date.now(),
      });
    }
    save(items);
    return true;
  }

  function remove(itemId) {
    save(getAll().filter(i => i.id !== itemId));
  }

  function update(itemId, people) {
    const items = getAll().map(i => i.id === itemId ? { ...i, people } : i);
    save(items);
  }

  function clear() { save([]); }

  function count() { return getAll().length; }

  function total() {
    const tours = window.hiddenPathTours || [];
    return getAll().reduce((sum, item) => {
      const tour = tours.find(t => t.id === item.tourId);
      return sum + (tour ? tour.price * item.people : 0);
    }, 0);
  }

  return { getAll, add, remove, update, clear, count, total };
})();

window.HiddenCart = HiddenCart;

// Update cart badge whenever cart changes
window.addEventListener('hp:cart-update', (e) => {
  document.querySelectorAll('.cart-badge').forEach(el => {
    const c = e.detail.count;
    el.textContent = c;
    el.style.display = c > 0 ? 'flex' : 'none';
  });
});
