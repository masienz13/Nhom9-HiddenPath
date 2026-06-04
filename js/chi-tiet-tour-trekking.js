(function() {
  const TOURS_PER_PAGE = 6;
  let currentPage = 1;
  let filteredTours = [];
  let viewMode = 'grid'; // grid | list

  let filters = {
    tag: 'all',
    diff: 'all-diff',
    duration: 'all',
    location: 'all',
    price: 'all',
    search: ''
  };
  let sortBy = 'default';
  const formatter = new Intl.NumberFormat('vi-VN');

  const diffColors = { 1: 'diff-1', 2: 'diff-2', 3: 'diff-3', 4: 'diff-4', 5: 'diff-5' };

  function formatPrice(p) {
    return p.toLocaleString('vi-VN') + '₫';
  }

  

  function buildCard(tour) {
    
    const tagBadge = tour.tags.includes('bestSeller')
      ? '<span class="tour-badge">🏆 Bán chạy</span>'
      : tour.tags.includes('hot')
      ? '<span class="tour-badge hot">🔥 HOT</span>'
      : '';

    

    return `
      <article class="tour-card" data-id="${tour.id}" data-aos>
        <a href="tours/${tour.id}.html" style="text-decoration:none;display:block;">
          <div class="tour-image" style="background-image:url('${tour.image}')">
            ${tagBadge}
           

          </div>
        </a>
        <div class="tour-card-body">
          <div class="tour-meta">
            <span class="tour-meta-item">📍 ${tour.location}</span>
            <span class="tour-meta-item">⏱ ${tour.duration}</span>
            <span class="tour-meta-item">⛰ ${tour.altitude}</span>
            <span class="diff-badge ${diffColors[tour.difficultyLevel]}">${tour.difficulty}</span>
          </div>
          <h3>${tour.displayName}</h3>
          <p class="tour-card-desc">${tour.description}</p>
          <div class="tour-card-footer">
            <div class="tour-price">
              <small>Từ / người</small>
              ${formatter.format(tour.price)}đ
            </div>
            <div class="tour-card-actions">
             <button class="btn-add-cart" data-tour-id="${tour.id}" title="Thêm vào giỏ hàng">🛒</button>
             <a href="thanh-toan.html?tour=${tour.id}" class="btn-book">Đặt ngay →</a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function applyFilters() {
    let tours = [...window.hiddenPathTours];

    if (filters.tag !== 'all') {
      tours = tours.filter(t => t.tags.includes(filters.tag));
    }
    if (filters.diff !== 'all-diff') {
      const levels = filters.diff.split(',').map(Number);
      tours = tours.filter(t => levels.includes(t.difficultyLevel));
    }
    if (filters.duration !== 'all') {
      tours = tours.filter(t => t.durationNum === parseInt(filters.duration));
    }
    if (filters.location !== 'all') {
      tours = tours.filter(t => t.province === filters.location);
    }
    if (filters.price !== 'all') {
      const [min, max] = filters.price.split('-').map(Number);
      tours = tours.filter(t => t.price >= min && t.price <= max);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      tours = tours.filter(t =>
        t.displayName.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') tours.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') tours.sort((a, b) => b.price - a.price);
    else if (sortBy === 'altitude') tours.sort((a, b) => b.altitudeNum - a.altitudeNum);
    else if (sortBy === 'rating') tours.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

    filteredTours = tours;
    currentPage = 1;
    render();
  }

  function render() {
    const grid = document.getElementById('tourGrid');
    const total = filteredTours.length;
    const start = (currentPage - 1) * TOURS_PER_PAGE;
    const pageTours = filteredTours.slice(start, start + TOURS_PER_PAGE);

    document.getElementById('resultsCount').innerHTML =
      `Hiển thị <strong>${pageTours.length}</strong> / ${total} tour`;

    if (pageTours.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏔️</div>
          <h3>Không tìm thấy tour phù hợp</h3>
          <p>Hãy thử thay đổi hoặc xóa bộ lọc để xem thêm tour.</p>
          <button class="btn btn-dark" onclick="clearAllFilters()">Xóa bộ lọc</button>
        </div>`;
      document.getElementById('pagination').innerHTML = '';
      return;
    }

    grid.innerHTML = pageTours.map(buildCard).join('');

    grid.querySelectorAll('.tour-card').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(20px)';
      setTimeout(() => {
        c.style.transition = 'opacity .35s ease, transform .35s ease, box-shadow .22s ease, border-color .22s ease';
        c.style.opacity = '1';
        c.style.transform = '';
      }, i * 60);
    });

    renderPagination(total);
    renderActiveFilterTags();
  }

  function renderPagination(total) {
    const totalPages = Math.ceil(total / TOURS_PER_PAGE);
    const pag = document.getElementById('pagination');

    if (totalPages <= 1) { pag.innerHTML = ''; return; }

    let html = `<button class="page-btn prev-next" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>← Trước</button>`;

    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
        if (i === 3 || i === totalPages - 2) html += `<span class="page-dots">…</span>`;
        continue;
      }
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn prev-next" onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>Tiếp →</button>`;
    pag.innerHTML = html;
  }

  window.goPage = function(p) {
    currentPage = p;
    render();
    window.scrollTo({ top: document.querySelector('.filter-bar').offsetTop - 100, behavior: 'smooth' });
  };

  function renderActiveFilterTags() {
    const container = document.getElementById('activeFilterTags');
    const tags = [];

    if (filters.tag !== 'all') tags.push({ key: 'tag', label: filters.tag === 'bestSeller' ? '🏆 Bán chạy' : '🔥 HOT' });
    if (filters.diff !== 'all-diff') tags.push({ key: 'diff', label: `Độ khó: ${filters.diff === '1,2' ? 'Dễ' : filters.diff === '3' ? 'Nâng cao' : 'Thách thức'}` });
    if (filters.duration !== 'all') tags.push({ key: 'duration', label: `${filters.duration}N${filters.duration-1}D` });
    if (filters.location !== 'all') tags.push({ key: 'location', label: document.getElementById('locationFilter').options[document.getElementById('locationFilter').selectedIndex].text });
    if (filters.price !== 'all') tags.push({ key: 'price', label: document.getElementById('priceFilter').options[document.getElementById('priceFilter').selectedIndex].text });
    if (filters.search) tags.push({ key: 'search', label: `"${filters.search}"` });

    container.innerHTML = tags.map(t =>
      `<span class="active-filter-tag">${t.label}<button onclick="removeFilter('${t.key}')">×</button></span>`
    ).join('');
  }

  window.removeFilter = function(key) {
    if (key === 'tag') { filters.tag = 'all'; document.querySelectorAll('[data-filter=tag]').forEach(b => b.classList.toggle('active', b.dataset.value === 'all')); }
    if (key === 'diff') { filters.diff = 'all-diff'; document.querySelectorAll('[data-filter=diff]').forEach(b => b.classList.toggle('active', b.dataset.value === 'all-diff')); }
    if (key === 'duration') { filters.duration = 'all'; document.getElementById('durationFilter').value = 'all'; }
    if (key === 'location') { filters.location = 'all'; document.getElementById('locationFilter').value = 'all'; }
    if (key === 'price') { filters.price = 'all'; document.getElementById('priceFilter').value = 'all'; }
    if (key === 'search') { filters.search = ''; document.getElementById('searchInput').value = ''; }
    applyFilters();
  };

  window.clearAllFilters = function() {
    filters = { tag: 'all', diff: 'all-diff', duration: 'all', location: 'all', price: 'all', search: '' };
    document.getElementById('searchInput').value = '';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.querySelectorAll('[data-filter=tag]').forEach(b => b.classList.toggle('active', b.dataset.value === 'all'));
    document.querySelectorAll('[data-filter=diff]').forEach(b => b.classList.toggle('active', b.dataset.value === 'all-diff'));
    applyFilters();
  };

  // Event listeners
  document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

  document.querySelectorAll('[data-filter=tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.tag = btn.dataset.value;
      document.querySelectorAll('[data-filter=tag]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  document.querySelectorAll('[data-filter=diff]').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.diff = btn.dataset.value;
      document.querySelectorAll('[data-filter=diff]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  document.getElementById('durationFilter').addEventListener('change', e => {
    filters.duration = e.target.value; applyFilters();
  });
  document.getElementById('locationFilter').addEventListener('change', e => {
    filters.location = e.target.value; applyFilters();
  });
  document.getElementById('priceFilter').addEventListener('change', e => {
    filters.price = e.target.value; applyFilters();
  });

  let searchTimer;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { filters.search = e.target.value.trim(); applyFilters(); }, 300);
  });

  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sortBy = btn.dataset.sort;
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  document.getElementById('gridViewBtn').addEventListener('click', () => {
    viewMode = 'grid';
    document.getElementById('tourGrid').classList.remove('list-mode');
    document.getElementById('gridViewBtn').classList.add('active');
    document.getElementById('listViewBtn').classList.remove('active');
  });
  document.getElementById('listViewBtn').addEventListener('click', () => {
    viewMode = 'list';
    document.getElementById('tourGrid').classList.add('list-mode');
    document.getElementById('listViewBtn').classList.add('active');
    document.getElementById('gridViewBtn').classList.remove('active');
  });

  function updateCounts() {
    const all = window.hiddenPathTours;
    document.getElementById('countAll').textContent = all.length;
    document.getElementById('countBS').textContent = all.filter(t => t.tags.includes('bestSeller')).length;
    document.getElementById('countHot').textContent = all.filter(t => t.tags.includes('hot')).length;
    document.getElementById('totalToursCount').textContent = all.length + ' tour';
  }

  updateCounts();
  applyFilters();
})();