(function () {
  const tours = window.hiddenPathTours || [];
  const formatter = new Intl.NumberFormat("vi-VN");

  const heroSlides = [
    {
      label: "Trekking",
      eyebrow: "Khám phá",
      title: "Pu Ta Leng",
      subtitle:
        "Trải nghiệm hành trình đi xuyên qua cánh rừng nguyên sinh,đắm mình trong màu xanh của thiên nhiên, nghe tiếng gió reo, ngắm dòng suối chảy, trượt lên những mỏm đá cũ kĩ nhuốm màu rêu phong của thời gian.",
      meta: "3N2D | HDV bản địa | Đa dạng trải nghiệm",
      image: "img/tours/putaleng2.jpg",
    },
    {
      label: "Trekking",
      eyebrow: "Săn mây",
      title: "Ky Quan San",
      subtitle:
        "Cung đường thử thách với biển mây bồng bềnh, rừng trúc và bình minh trên sống núi.",
      meta: "3N2D | HDV bản địa | Porter hỗ trợ",
      image: "img/tours/kyquanson3.jpg",
    },
    {
      label: "Trekking",
      eyebrow: "Chinh phục",
      title: "Fansipan",
      subtitle:
        "Hành trình chạm nóc nhà Đông Dương dành cho người mới bắt đầu và nhóm bạn yêu trải nghiệm.",
      meta: "2N1D | Lịch trình tối ưu | Đảm bảo an toàn",
      image: "img/tours/fansipan1.jpg",
    },
  ];


  let currentSlide = 0;
  let slideTimer;
  let statsAnimated = false;

  function setBackground(element, image) {
    element.style.backgroundImage = `linear-gradient(90deg, rgba(10, 31, 20, .76), rgba(10, 31, 20, .3)), url("${image}")`;
  }

  function renderHero() {
    const track = document.querySelector(".hero-track");
    const dots = document.querySelector(".hero-dots");
    if (!track || !dots) return;

    track.innerHTML = heroSlides
      .map(
        (slide) => `
          <article class="hero-slide">
            <div class="hero-media" data-bg="${slide.image}"></div>
            <div class="hero-content">
              <span class="hero-label">${slide.label}</span>
              <p class="hero-eyebrow">${slide.eyebrow}</p>
              <h1>${slide.title}</h1>
              <p class="hero-subtitle">${slide.subtitle}</p>
              <p class="hero-meta">${slide.meta}</p>
              <div class="hero-actions">
                <a class="btn btn-primary" href="#quickBooking">Xem tour ngay</a>
                <a class="btn btn-ghost" href="lien-he.html">Liên hệ tư vấn</a>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    track.querySelectorAll(".hero-media").forEach((media) => {
      setBackground(media, media.dataset.bg);
    });

    dots.innerHTML = heroSlides
      .map(
        (_, index) =>
          `<button type="button" aria-label="Chuyển tới slide ${index + 1}" data-slide="${index}"></button>`
      )
      .join("");

    dots.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      goToSlide(Number(button.dataset.slide));
      restartHeroTimer();
    });

    document.querySelector(".hero-prev").addEventListener("click", () => {
      goToSlide(currentSlide - 1);
      restartHeroTimer();
    });

    document.querySelector(".hero-next").addEventListener("click", () => {
      goToSlide(currentSlide + 1);
      restartHeroTimer();
    });

    goToSlide(0);
    restartHeroTimer();
  }

  function goToSlide(index) {
    const track = document.querySelector(".hero-track");
    const dots = document.querySelectorAll(".hero-dots button");
    currentSlide = (index + heroSlides.length) % heroSlides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  }

  function restartHeroTimer() {
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function createTourCard(tour) {
    return `
      <article class="tour-card" data-tour-name="${tour.displayName.toLowerCase()}">
        <a class="tour-image" href="tours/${tour.id}.html" data-bg="${tour.image}" aria-label="${tour.displayName}">
          <span class="tour-badge">Nổi bật</span>
          <div class="tour-rating">
            <span class="star-icon">★</span>
            ${tour.rating || "4.9"} <span style="opacity:0.7;font-size:10px">(${tour.reviewCount || "12"})</span>
          </div>
        </a>
        <div class="tour-card-body">
          <div class="tour-meta">
            <span class="tour-meta-item">📍 ${tour.location}</span>
            <span class="tour-meta-item">⏱ ${tour.duration}</span>
            <span class="tour-meta-item">⛰ ${tour.altitude}</span>
          </div>
          <h3><a href="tours/${tour.id}.html">${tour.displayName}</a></h3>
          <p class="tour-card-desc">${tour.description}</p>
          <div class="tour-card-footer">
            <div class="tour-price">
              <small>Từ / người</small>
              ${formatter.format(tour.price)}đ
            </div>
            <div class="tour-card-actions">
              <button class="btn-add-cart" data-tour-id="${tour.id}" title="Thêm vào giỏ hàng" aria-label="Thêm ${tour.displayName} vào giỏ hàng">🛒</button>
              <a href="thanh-toan.html?tour=${tour.id}" class="btn-book">Đặt ngay →</a>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderTours() {
    const featured = document.querySelector("#featuredTours");
    const select = document.querySelector("#tourSelect");
    if (!featured || !select) return;

    featured.innerHTML = tours
      .filter((tour) => tour.tags.includes("featured"))
      .slice(0, 6)
      .map(createTourCard)
      .join("");

    document.querySelectorAll(".tour-image").forEach((image) => {
      image.style.backgroundImage = `linear-gradient(180deg, rgba(9, 26, 17, .05), rgba(9, 26, 17, .12)), url("${image.dataset.bg}")`;
    });

    select.innerHTML =
      '<option value="">-- Chọn tour --</option>' +
      tours
        .map((tour) => `<option value="${tour.id}">${tour.displayName}</option>`)
        .join("");

    if (!document.getElementById("hp-cart-btn-style")) {
      const st = document.createElement("style");
      st.id = "hp-cart-btn-style";
      st.textContent = `.tour-card-actions{display:flex;align-items:center;gap:8px;}.btn-add-cart{background:#fff;border:2px solid #2d6a4f;color:#2d6a4f;border-radius:8px;width:38px;height:38px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;flex-shrink:0;}.btn-add-cart:hover{background:#2d6a4f;color:#fff;}.btn-add-cart.added{background:#2d6a4f;color:#fff;}`;
      document.head.appendChild(st);
    }

    document.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tourId = btn.dataset.tourId;
        const today = new Date().toLocaleDateString("vi-VN");
        if (window.HiddenCart) {
          window.HiddenCart.add(tourId, today, 1);
          btn.classList.add("added");
          btn.title = "Đã thêm vào giỏ!";
          setTimeout(() => { btn.classList.remove("added"); btn.title = "Thêm vào giỏ hàng"; }, 1500);
        } else {
          window.location.href = `thanh-toan.html?tour=${tourId}`;
        }
      });
    });
  }

  function renderBlogs() {
    const grid = document.querySelector("#blogPreview");
    if (!grid) return;

    const latestPosts = [...(window.hiddenPathBlogPosts || [])]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    grid.innerHTML = latestPosts
      .map(
        (post) => `
          <article class="blog-card">
            <a class="blog-thumb" href="blog-detail.html?id=${post.id}" data-bg="${post.image}" aria-label="${post.title}"></a>
            <div class="blog-body">
              <span>${post.tag}</span>
              <h3><a href="blog-detail.html?id=${post.id}">${post.title}</a></h3>
              <p>${post.summary}</p>
            </div>
          </article>
        `
      )
      .join("");

    grid.querySelectorAll(".blog-thumb").forEach((thumb) => {
      thumb.style.backgroundImage = `linear-gradient(180deg, rgba(9, 26, 17, .05), rgba(9, 26, 17, .18)), url("${thumb.dataset.bg}")`;
    });
  }

  function initBookingForm() {
    const form = document.querySelector("#quickBooking");
    if (!form) return;

    if (window.jQuery && jQuery.fn.datepicker) {
      jQuery("#departureDate").datepicker({
        minDate: 0,
        dateFormat: "dd/mm/yy",
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const tour = document.querySelector("#tourSelect").value;
      const date = document.querySelector("#departureDate").value;
      const people = document.querySelector("#peopleSelect").value;
      const params = new URLSearchParams();
      if (tour) params.set("tour", tour);
      if (date) params.set("date", date);
      if (people) params.set("people", people);
      const suffix = params.toString() ? `?${params.toString()}` : "";
      window.location.href = `chi-tiet-tour-trekking.html${suffix}`;
    });
  }

  function initStats() {
    const stats = document.querySelector(".stats-section");
    if (!stats || !window.jQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || statsAnimated) return;
        statsAnimated = true;
        jQuery(".stat-number").each(function () {
          const target = Number(this.dataset.target);
          const statElement = this;
          jQuery({ count: 0 }).animate(
            { count: target },
            {
              duration: 1500,
              easing: "swing",
              step(now) {
                statElement.textContent = formatter.format(Math.floor(now)) + "+";
              },
              complete() {
                statElement.textContent = formatter.format(target) + "+";
              },
            }
          );
        });
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(stats);
  }

  function initFaq() {
    if (window.jQuery && jQuery.fn.accordion) {
      jQuery("#faqAccordion").accordion({
        heightStyle: "content",
        collapsible: true,
        active: 0,
      });
    }
  }

  function initSearch() {
    function runSearch(query) {
      const normalized = query.toLowerCase();
      const match = tours.find(
        (tour) =>
          tour.displayName.toLowerCase().includes(normalized) ||
          tour.name.toLowerCase().includes(normalized)
      );

      if (match) {
        const card = document.querySelector(
          `[data-tour-name*="${match.displayName.toLowerCase()}"]`
        );
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("is-highlighted");
          window.setTimeout(() => card.classList.remove("is-highlighted"), 1800);
          return;
        }
      }

      document.querySelector("#featuredToursSection").scrollIntoView({ behavior: "smooth" });
    }

    window.addEventListener("hiddenpath:tour-search", (event) => {
      runSearch(event.detail.query);
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get("search");
    if (query) {
      window.setTimeout(() => runSearch(query), 400);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderTours();
    renderBlogs();
    initBookingForm();
    initStats();
    initFaq();
    initSearch();
  });
})();
