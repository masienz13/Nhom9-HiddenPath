const cards = document.querySelectorAll(".blog-card");
const buttons = document.querySelectorAll(".blog-tabs button");
const searchInput = document.getElementById("searchInput");

let currentFilter = "all";

function filterPosts() {
    const keyword = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
        const matchCategory =
            currentFilter === "all" ||
            card.dataset.category === currentFilter;

        const matchSearch =
            card.innerText.toLowerCase().includes(keyword);

        card.style.display =
            matchCategory && matchSearch ? "flex" : "none";
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        filterPosts();
    });
});

searchInput.addEventListener("keyup", filterPosts);