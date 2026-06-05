emailjs.init({
    publicKey: "W5leNjpoV5qV5P4Kv"
});

function sendBookingEmail(data) {
    return emailjs.send(
        "service_wkjxt9v",
        "template_dujlt8p",
        data
    );
}