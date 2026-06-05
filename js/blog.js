(function () {
  const posts = [...(window.hiddenPathBlogPosts || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const grid = document.querySelector(".blog-grid");
  const buttons = document.querySelectorAll(".blog-tabs button");
  const searchInput = document.getElementById("searchInput");

  function renderPosts() {
    if (!grid) return;

    grid.innerHTML = posts
      .map(
        (post) => `
          <article class="blog-card" data-category="${post.tag}">
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-content">
              <span class="blog-tag">${post.tag}</span>
              <h3>${post.title}</h3>
              <p>${post.summary}</p>
              <a class="btn btn-primary" href="blog-detail.html?id=${post.id}">Đọc thêm</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function applyFilters() {
    const activeFilter = document.querySelector(".blog-tabs button.active")?.dataset.filter || "all";
    const keyword = (searchInput?.value || "").toLowerCase();

    document.querySelectorAll(".blog-card").forEach((card) => {
      const matchCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchKeyword = card.innerText.toLowerCase().includes(keyword);
      card.style.display = matchCategory && matchKeyword ? "block" : "none";
    });
  }

  renderPosts();

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });

  searchInput?.addEventListener("keyup", applyFilters);
})();
