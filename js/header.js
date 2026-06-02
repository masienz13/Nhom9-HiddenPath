class HeaderPlaceholder extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="index.html" aria-label="Hidden Path trang chủ">
            <span class="brand-logo-wrap">
              <img class="brand-logo" src="img/logo.png" alt="Hidden Path logo">
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
            <a href="index.html" data-page="index">Trang chủ</a>
            <a href="chi-tiet-tour-trekking.html" data-page="tour">Tour Trekking</a>
            <a href="ve-chung-toi.html" data-page="about">Về chúng tôi</a>
            <a href="blog.html" data-page="blog">Blog</a>
            <a href="lien-he.html" data-page="contact">Liên hệ</a>
          </nav>

          <form class="header-search" role="search">
            <label class="sr-only" for="globalTourSearch">Tìm kiếm tour</label>
            <input id="globalTourSearch" type="search" placeholder="Tìm tour..." autocomplete="off">
            <button type="submit" aria-label="Tìm kiếm tour">
              <span aria-hidden="true"></span>
            </button>
          </form>
        </div>
      </header>
    `;

    const toggle = this.querySelector(".nav-toggle");
    const nav = this.querySelector(".main-nav");
    const form = this.querySelector(".header-search");
    const input = this.querySelector("#globalTourSearch");
    const logo = this.querySelector(".brand-logo");
    const logoWrap = this.querySelector(".brand-logo-wrap");

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

      window.dispatchEvent(
        new CustomEvent("hiddenpath:tour-search", { detail: { query } })
      );

      if (!document.body.classList.contains("home-page")) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
}

customElements.define("header-placeholder", HeaderPlaceholder);
