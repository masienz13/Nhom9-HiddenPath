document.addEventListener("DOMContentLoaded", function () {

    emailjs.init("MjVYn-GtPaNs7bzgz");

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const params = {
            customer_name: document.getElementById("name").value.trim(),
            customer_email: document.getElementById("email").value.trim(),
            customer_phone: document.getElementById("phone").value.trim(),
            customer_message: document.getElementById("message").value.trim()
        };

        emailjs.send(
            "service_hiddenpath",
            "template_608qjol",
            params
        )
            .then(function () {
                alert("Gửi thành công!");
                contactForm.reset();
            })
            .catch(function (error) {
                console.error(error);
                alert("Lỗi gửi mail!");
            });

    });

});