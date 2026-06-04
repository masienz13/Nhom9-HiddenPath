const cards = document.querySelectorAll(".blog-card");
const buttons = document.querySelectorAll(".blog-tabs button");
const searchInput = document.getElementById("searchInput");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        cards.forEach(card => {

            if (
                filter === "all" ||
                card.dataset.category === filter
            ) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});

searchInput.addEventListener("keyup", () => {

    const keyword =
        searchInput.value.toLowerCase();

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        card.style.display =
            text.includes(keyword)
                ? "block"
                : "none";

    });

});