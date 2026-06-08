class HeaderPlaceholder extends HTMLElement {
  connectedCallback() {
    const basePath = window.location.pathname.includes("/tours/") ? "../" : "";
    this.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="${basePath}index.html" aria-label="Hidden Path trang chủ">
            <span class="brand-logo-wrap">
              <img class="brand-logo" src="${basePath}img/logo.png" alt="Hidden Path logo">
            </span>
            <span class="brand-copy">
              <span class="brand-name">Hidden Path</span>
              <span class="brand-subtitle">Mountain Tours</span>
            </span>
          </a>

          <button class="nav-toggle" type="button" aria-label="Mở menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <nav class="main-nav" aria-label="Điều hướng chính">
            <a href="${basePath}index.html" data-page="index">Trang chủ</a>
            <a href="${basePath}chi-tiet-tour-trekking.html" data-page="tour">Tour Trekking</a>
            <a href="${basePath}ve-chung-toi.html" data-page="about">Về chúng tôi</a>
            <a href="${basePath}blog.html" data-page="blog">Blog</a>
            <a href="${basePath}lien-he.html" data-page="contact">Liên hệ</a>
          </nav>

          <form class="header-search" role="search">
            <label class="sr-only" for="globalTourSearch">Tìm kiếm tour</label>
            <input id="globalTourSearch" type="search" placeholder="Tìm tour..." autocomplete="off">
            <button type="submit" aria-label="Tìm kiếm tour">
              <span aria-hidden="true"></span>
            </button>
          </form>

          <a class="cart-icon-btn" href="${basePath}cart.html" aria-label="Giỏ hàng">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-badge" style="display:none;">0</span>
          </a>
        </div>
      </header>
    `;

    const toggle = this.querySelector(".nav-toggle");
    const nav = this.querySelector(".main-nav");
    const form = this.querySelector(".header-search");
    const input = this.querySelector("#globalTourSearch");
    const logo = this.querySelector(".brand-logo");
    const logoWrap = this.querySelector(".brand-logo-wrap");
    const cartBadge = this.querySelector(".cart-badge");

    // Inject cart icon styles once
    if (!document.getElementById('hp-cart-icon-style')) {
      const st = document.createElement('style');
      st.id = 'hp-cart-icon-style';
      st.textContent = `.cart-icon-btn{position:relative!important;display:flex;align-items:center;color:inherit;text-decoration:none;margin-left:8px;padding:4px;}.cart-icon-btn svg{width:22px;height:22px;}.cart-badge{position:absolute;top:-6px;right:-8px;background:#e53e3e;color:#fff;border-radius:50%;min-width:18px;height:18px;font-size:11px;font-weight:700;display:flex!important;align-items:center;justify-content:center;padding:0 3px;line-height:1;}`;
      document.head.appendChild(st);
    }

    // Init badge count from cart
    if (window.HiddenCart) {
      const c = window.HiddenCart.count();
      if (c > 0) { cartBadge.textContent = c; cartBadge.style.display = 'flex'; }
    }

    logo.addEventListener("error", () => {
      logo.remove();
      logoWrap.textContent = "HP";
      logoWrap.classList.add("brand-logo-fallback");
    });

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      const catalogPath = `${basePath}chi-tiet-tour-trekking.html`;
      const isCatalogPage = window.location.pathname.endsWith("/chi-tiet-tour-trekking.html");

      if (isCatalogPage) {
        const url = new URL(window.location.href);
        url.searchParams.set("search", query);
        history.replaceState(null, "", url);
        window.dispatchEvent(
          new CustomEvent("hiddenpath:tour-search", { detail: { query } })
        );
      } else {
        window.location.href = `${catalogPath}?search=${encodeURIComponent(query)}`;
      }
    });
  }
}

customElements.define("header-placeholder", HeaderPlaceholder);