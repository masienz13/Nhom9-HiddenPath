(function () {
  function getBasePath() {
    return window.location.pathname.includes("/tours/") ? "../" : "";
  }

  function getScrollOffset() {
    const header = document.querySelector(".site-header");
    const tabBar = document.querySelector(".tab-bar");
    return (header ? header.offsetHeight : 0) + (tabBar ? tabBar.offsetHeight : 0) + 12;
  }

  function moveUnderline(activeLink) {
    const underline = document.querySelector(".tab-underline");
    const container = document.querySelector(".tab-container");
    if (!underline || !container || !activeLink) return;

    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const left = linkRect.left - containerRect.left + container.scrollLeft;
    underline.style.width = `${linkRect.width}px`;
    underline.style.transform = `translateX(${left}px)`;
  }

  function setActive(link) {
    document.querySelectorAll(".tab-link").forEach((item) => {
      item.classList.toggle("active", item === link);
    });
    moveUnderline(link);
  }

  function initTabs() {
    const links = Array.from(document.querySelectorAll(".tab-link"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const section = document.querySelector(link.getAttribute("href"));
        if (!section) return;

        const top = section.getBoundingClientRect().top + window.scrollY - getScrollOffset();
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", link.getAttribute("href"));
        setActive(link);
      });
    });

    const syncActiveFromScroll = () => {
      const offset = getScrollOffset() + 20;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= offset) {
          current = section;
        }
      });

      const active = links.find((link) => link.getAttribute("href") === `#${current.id}`);
      setActive(active || links[0]);
    };

    window.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", () => moveUnderline(document.querySelector(".tab-link.active")));
    document.querySelector(".tab-container")?.addEventListener("scroll", () => {
      moveUnderline(document.querySelector(".tab-link.active"));
    }, { passive: true });

    const initial = links.find((link) => link.getAttribute("href") === window.location.hash) || links[0];
    setActive(initial);
    if (window.location.hash) {
      window.setTimeout(() => {
        const section = document.querySelector(window.location.hash);
        if (!section) return;
        window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - getScrollOffset() });
      }, 120);
    }
  }

  function initBookingButton() {
    const button = document.querySelector(".btn-submit");
    const cartButton = document.querySelector(".booking-cart-btn");
    const peopleSelect = document.querySelector(".booking-card select");

    const syncPeopleFromUrl = () => {
      if (!peopleSelect) return;

      const people = new URLSearchParams(window.location.search).get("people");
      if (!people) return;

      const option = Array.from(peopleSelect.options).find((item) => {
        const value = item.value.match(/\d+/)?.[0];
        return value === people;
      });

      if (option) peopleSelect.value = option.value;
    };

    const getBookingData = () => {
      const tourId = document.body.dataset.tourId;
      const peopleValue = peopleSelect?.value || "";
      const people = Number(peopleValue.match(/\d+/)?.[0] || 1);
      return { tourId, people };
    };

    syncPeopleFromUrl();

    button?.addEventListener("click", () => {
      const params = new URLSearchParams();
      const { tourId, people } = getBookingData();

      if (tourId) params.set("tour", tourId);
      if (people) params.set("people", people);

      const suffix = params.toString() ? `?${params.toString()}` : "";
      window.location.href = `${getBasePath()}thanh-toan.html${suffix}`;
    });

    cartButton?.addEventListener("click", () => {
      const { tourId, people } = getBookingData();
      if (!tourId || !window.HiddenCart) {
        return;
      }

      const today = new Date().toLocaleDateString("vi-VN");
      window.HiddenCart.add(tourId, today, people);
      cartButton.classList.add("added");
      cartButton.title = "Đã thêm vào giỏ!";
      window.setTimeout(() => {
        cartButton.classList.remove("added");
        cartButton.title = "Thêm vào giỏ hàng";
      }, 1500);
    });
  }

  function initGalleryLightbox() {
    const images = Array.from(document.querySelectorAll(".gallery-grid img"));
    if (!images.length) return;

    const lightbox = document.createElement("div");
    lightbox.className = "tour-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <button class="lightbox-btn lightbox-close" type="button" aria-label="Đóng ảnh">×</button>
      <button class="lightbox-btn lightbox-prev" type="button" aria-label="Ảnh trước">‹</button>
      <img class="lightbox-img" alt="">
      <button class="lightbox-btn lightbox-next" type="button" aria-label="Ảnh tiếp theo">›</button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector(".lightbox-img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    let activeIndex = 0;

    const showImage = (index) => {
      activeIndex = (index + images.length) % images.length;
      const image = images[activeIndex];
      lightboxImg.src = image.currentSrc || image.src;
      lightboxImg.alt = image.alt || "Ảnh tour";
    };

    const openLightbox = (index) => {
      showImage(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImg.removeAttribute("src");
    };

    images.forEach((image, index) => {
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.addEventListener("click", () => openLightbox(index));
      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => showImage(activeIndex - 1));
    nextBtn.addEventListener("click", () => showImage(activeIndex + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initBookingButton();
    initGalleryLightbox();
  });
})();
