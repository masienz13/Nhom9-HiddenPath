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
    if (!button) return;

    button.addEventListener("click", () => {
      const params = new URLSearchParams();
      const tourId = document.body.dataset.tourId;
      const date = document.querySelector('input[type="date"]')?.value;
      const peopleValue = document.querySelector(".booking-card select")?.value || "";
      const people = peopleValue.match(/\d+/)?.[0];

      if (tourId) params.set("tour", tourId);
      if (date) params.set("date", date);
      if (people) params.set("people", people);

      const suffix = params.toString() ? `?${params.toString()}` : "";
      window.location.href = `${getBasePath()}thanh-toan.html${suffix}`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initBookingButton();
  });
})();
