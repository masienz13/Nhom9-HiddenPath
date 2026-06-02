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
      image: "img/tours/putaleng.png",
    },
    {
      label: "Trekking",
      eyebrow: "Săn mây",
      title: "Ky Quan San",
      subtitle:
        "Cung đường thử thách với biển mây bồng bềnh, rừng trúc và bình minh trên sống núi.",
      meta: "3N2D | HDV bản địa | Porter hỗ trợ",
      image: "img/tours/ky quan san.png",
    },
    {
      label: "Trekking",
      eyebrow: "Chinh phục",
      title: "Fansipan",
      subtitle:
        "Hành trình chạm nóc nhà Đông Dương dành cho người mới bắt đầu và nhóm bạn yêu trải nghiệm.",
      meta: "2N1D | Lịch trình tối ưu | Đảm bảo an toàn",
      image: "img/tours/fansipan.png",
    },
  ];

  const blogPosts = [
    {
      title: "Kinh nghiệm trekking Tây Bắc lần đầu",
      tag: "Kinh nghiệm",
      image: "img/blog-beginner.jpg",
      summary:
        "Chuẩn bị thể lực, lịch trình và tâm lý để chuyến leo núi đầu tiên an toàn, vui và đáng nhớ.",
    },
    {
      title: "Checklist đồ cần mang khi leo núi",
      tag: "Trang bị",
      image: "img/blog-gear.jpg",
      summary:
        "Những món đồ cần thiết cho tour 2N1D và 3N2D, từ giày, áo mưa đến thuốc cá nhân.",
    },
    {
      title: "Top cung đường săn mây đẹp ở Tây Bắc",
      tag: "Cung đường",
      image: "img/blog-route.jpg",
      summary:
        "Gợi ý các đỉnh núi có biển mây đẹp, phù hợp từng mức kinh nghiệm và mùa trong năm.",
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

  function createTourCard(tour, badge) {
    return `
      <article class="tour-card" data-tour-name="${tour.displayName.toLowerCase()}">
        <a class="tour-image" href="chi-tiet-tour-trekking.html?tour=${tour.id}" data-bg="${tour.image}" aria-label="${tour.displayName}">
          <span>${badge}</span>
        </a>
        <div class="tour-card-body">
          <div class="tour-meta">
            <span>${tour.duration}</span>
            <span>${tour.difficulty}</span>
          </div>
          <h3><a href="chi-tiet-tour-trekking.html?tour=${tour.id}">${tour.displayName}</a></h3>
          <p class="tour-price">${formatter.format(tour.price)}<sup>đ</sup></p>
          <p>${tour.description}</p>
        </div>
      </article>
    `;
  }

  function renderTours() {
    const bestSeller = document.querySelector("#bestSellerTours");
    const hot = document.querySelector("#hotTours");
    const select = document.querySelector("#tourSelect");
    if (!bestSeller || !hot || !select) return;

    bestSeller.innerHTML = tours
      .filter((tour) => tour.tags.includes("bestSeller"))
      .map((tour) => createTourCard(tour, "Tour bán chạy"))
      .join("");

    hot.innerHTML = tours
      .filter((tour) => tour.tags.includes("hot"))
      .map((tour) => createTourCard(tour, "Tour hot"))
      .join("");

    document.querySelectorAll(".tour-image").forEach((image) => {
      image.style.backgroundImage = `linear-gradient(180deg, rgba(9, 26, 17, .05), rgba(9, 26, 17, .12)), url("${image.dataset.bg}")`;
    });

    select.innerHTML =
      '<option value="">-- Chọn tour --</option>' +
      tours
        .map((tour) => `<option value="${tour.id}">${tour.displayName}</option>`)
        .join("");
  }

  function renderBlogs() {
    const grid = document.querySelector("#blogPreview");
    if (!grid) return;

    grid.innerHTML = blogPosts
      .map(
        (post) => `
          <article class="blog-card">
            <a class="blog-thumb" href="blog.html" data-bg="${post.image}" aria-label="${post.title}"></a>
            <div class="blog-body">
              <span>${post.tag}</span>
              <h3><a href="blog.html">${post.title}</a></h3>
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

      document.querySelector("#bestSeller").scrollIntoView({ behavior: "smooth" });
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
