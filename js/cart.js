// ============================================================
// HiddenCart — định nghĩa TRƯỚC để mọi trang đều dùng được
// ============================================================
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

// Cập nhật badge giỏ hàng trên header mọi trang
window.addEventListener('hp:cart-update', (e) => {
  document.querySelectorAll('.cart-badge').forEach(el => {
    const c = e.detail.count;
    el.textContent = c;
    el.style.display = c > 0 ? 'flex' : 'none';
  });
});

// ============================================================
// Cart Page UI — chỉ chạy khi đang ở trang giỏ hàng (gio-hang.html)
// ============================================================
(function () {
  // Nếu trang không có element giỏ hàng thì bỏ qua
  if (!document.getElementById('cartItems')) return;

  const PROMO_CODES = { 'HIDDEN10': 0.10, 'TREKKING20': 0.20, 'NEWMEMBER': 0.15 };
  let discountRate = 0;

  const DATE_OPTIONS = [
    '12/07','19/07','26/07','02/08','09/08','16/08','23/08'
  ];

  function formatPrice(n) {
    return n.toLocaleString('vi-VN') + '₫';
  }

  function getTour(id) {
    return (window.hiddenPathTours || []).find(t => t.id === id);
  }

  function render() {
    const items = HiddenCart.getAll();
    const container = document.getElementById('cartItems');

    document.getElementById('heroCartCount').textContent = items.length + (items.length === 1 ? ' tour' : ' tour');
    document.getElementById('clearCartBtn').style.display = items.length > 0 ? '' : 'none';

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart">
          <span class="empty-cart-icon">🏔️</span>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa chọn tour nào.<br>Khám phá các cung trekking tuyệt đẹp và thêm vào giỏ hàng nhé!</p>
          <a href="chi-tiet-tour-trekking.html" class="btn btn-dark">Xem tất cả tour →</a>
        </div>`;
      document.getElementById('checkoutBtn').disabled = true;
      renderSummary([]);
      renderRecommend([]);
      return;
    }

    document.getElementById('checkoutBtn').disabled = false;
    container.innerHTML = items.map(item => {
      const tour = getTour(item.tourId);
      if (!tour) return '';
      const total = tour.price * item.people;
      const dateOpts = DATE_OPTIONS.map(d =>
        `<option value="${d}" ${d===item.date?'selected':''}>${d}/2025</option>`
      ).join('');

      return `
        <div class="cart-item" id="ci-${item.id}">
          <div class="cart-item-img" style="background-image:url('${tour.image}')"></div>
          <div class="cart-item-info">
            <div class="cart-item-tags">
              <span class="cart-tag cart-tag-diff">${tour.difficulty}</span>
            </div>
            <h3>${tour.displayName}</h3>
            <div class="cart-item-meta">
              <span>📍 ${tour.location}</span>
              <span>⏱ ${tour.duration}</span>
              <span>⛰ ${tour.altitude}</span>
              <span>⭐ ${tour.rating} (${tour.reviewCount})</span>
            </div>
            <div class="cart-item-controls">
              <div>
                <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px;">📅 Ngày khởi hành</div>
                <select class="date-select-mini" onchange="updateDate('${item.id}', this.value)">
                  ${dateOpts}
                </select>
              </div>
              <div>
                <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px;">👥 Số người</div>
                <div class="people-mini">
                  <button class="people-mini-btn" onclick="changePeople('${item.id}', -1)" ${item.people<=1?'disabled':''}>−</button>
                  <span class="people-mini-val" id="pv-${item.id}">${item.people}</span>
                  <button class="people-mini-btn" onclick="changePeople('${item.id}', 1)" ${item.people>=12?'disabled':''}>+</button>
                  <span style="font-size:12px;color:var(--muted);">/ 12</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-item-price-col">
            <div>
              <div class="cart-item-unit">${item.people} người × ${formatPrice(tour.price)}</div>
              <div class="cart-item-price" id="ip-${item.id}">${formatPrice(total)}</div>
            </div>
            <button class="remove-btn" onclick="removeItem('${item.id}')" title="Xóa khỏi giỏ hàng">✕</button>
          </div>
        </div>`;
    }).join('');

    renderSummary(items);
    renderRecommend(items);
  }

  function renderSummary(items) {
    let html = '';
    let sub = 0;

    items.forEach(item => {
      const tour = getTour(item.tourId);
      if (!tour) return;
      const amt = tour.price * item.people;
      sub += amt;
      html += `
        <div class="summary-row">
          <span class="lbl" style="max-width:160px;font-size:13px;line-height:1.4">${tour.displayName.split('(')[0].trim()}<br><span style="font-weight:600;color:var(--muted)">${item.date} · ${item.people} người</span></span>
          <span class="val">${formatPrice(amt)}</span>
        </div>`;
    });

    document.getElementById('summaryItems').innerHTML = html;
    document.getElementById('subTotal').textContent = formatPrice(sub);
    document.getElementById('grandTotal').textContent = formatPrice(sub);
  }
  function renderRecommend(cartItems) {
    const all = window.hiddenPathTours || [];
    const inCart = cartItems.map(i => i.tourId);
    const recs = all.filter(t => !inCart.includes(t.id)).slice(0, 3);

    const sec = document.getElementById('recommendSection');
    if (recs.length === 0) { sec.style.display = 'none'; return; }
    sec.style.display = '';

    document.getElementById('recommendGrid').innerHTML = recs.map(t => `
      <div class="recommend-card" onclick="addRecommend('${t.id}')">
        <div class="recommend-img" style="background-image:url('${t.image}')"></div>
        <div class="recommend-body">
          <div class="rec-meta">📍 ${t.location} · ${t.duration}</div>
          <h4>${t.displayName.replace('(Xuất phát từ Hà Nội)', '').trim()}</h4>
          <div class="rec-price">${formatPrice(t.price)}<span style="font-size:10px;font-weight:600;color:var(--muted)">/người</span></div>
          <button class="rec-add-btn" id="radd-${t.id}">+ Thêm vào giỏ</button>
        </div>
      </div>`).join('');
  }

  window.removeItem = function(id) {
    const el = document.getElementById('ci-' + id);
    if (el) el.classList.add('removing');
    setTimeout(() => {
      HiddenCart.remove(id);
      render();
      showToast('🗑️ Đã xóa tour khỏi giỏ hàng');
    }, 280);
  };

  window.updateDate = function(id, date) {
    const items = HiddenCart.getAll().map(i => i.id === id ? {...i, date} : i);
    localStorage.setItem('hp_cart', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('hp:cart-update', { detail: { count: HiddenCart.count() } }));
    showToast('📅 Đã cập nhật ngày khởi hành');
    renderSummary(HiddenCart.getAll());
  };

  window.changePeople = function(id, delta) {
    const items = HiddenCart.getAll();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newVal = Math.max(1, Math.min(12, item.people + delta));
    HiddenCart.update(id, newVal);
    const pv = document.getElementById('pv-' + id);
    if (pv) pv.textContent = newVal;
    const tour = getTour(item.tourId);
    const ip = document.getElementById('ip-' + id);
    if (ip && tour) ip.textContent = formatPrice(tour.price * newVal);
    const ciEl = document.getElementById('ci-' + id);
    if (ciEl) {
      ciEl.querySelectorAll('.people-mini-btn')[0].disabled = newVal <= 1;
      ciEl.querySelectorAll('.people-mini-btn')[1].disabled = newVal >= 12;
      ciEl.querySelector('.cart-item-unit').textContent = `${newVal} người × ${formatPrice(tour.price)}`;
    }
    renderSummary(HiddenCart.getAll());
  };

  window.clearAll = function() {
    if (!confirm('Xóa tất cả tour trong giỏ hàng?')) return;
    HiddenCart.clear();
    render();
    showToast('🗑️ Đã xóa toàn bộ giỏ hàng');
  };

  window.addRecommend = function(tourId) {
    const date = DATE_OPTIONS[0];
    HiddenCart.add(tourId, date, 1);
    const btn = document.getElementById('radd-' + tourId);
    if (btn) { btn.textContent = '✅ Đã thêm'; btn.classList.add('added'); btn.onclick = null; }
    render();
    showToast('✅ Đã thêm tour vào giỏ hàng');
  };

  window.applyPromo = function() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const msg = document.getElementById('promoMsg');
    if (PROMO_CODES[code]) {
      discountRate = PROMO_CODES[code];
      msg.className = 'promo-msg promo-ok';
      msg.textContent = `✅ Mã "${code}" — Giảm ${discountRate*100}%!`;
    } else {
      discountRate = 0;
      msg.className = 'promo-msg promo-err';
      msg.textContent = '❌ Mã không hợp lệ hoặc đã hết hạn.';
    }
    renderSummary(HiddenCart.getAll());
  };

  window.goCheckout = function() {
    const items = HiddenCart.getAll();
    if (items.length === 0) return;
    const firstTourId = items[0].tourId;
    window.location.href = `thanh-toan.html?tour=${firstTourId}&from=cart`;
  };

  function showToast(msg) {
    const t = document.getElementById('hpToast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  // Khởi chạy
  render();
})();