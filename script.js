/* =========================================
   VEDA TECHNOLOGY WEBSITE
   JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", function () {

        nav.classList.toggle("active");

    });

}


/* Close mobile menu after clicking link */

document.querySelectorAll(".nav a").forEach(function (link) {

    link.addEventListener("click", function () {

        if (nav) {
            nav.classList.remove("active");
        }

    });

});



/* =========================================
   FAQ
========================================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {

    const button = item.querySelector("button");

    if (!button) return;

    button.addEventListener("click", function () {

        faqItems.forEach(function (otherItem) {

            if (otherItem !== item) {

                otherItem.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});



/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* Get form values */

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* Validate fields */

        if (
            name === "" ||
            email === "" ||
            subject === "" ||
            message === ""
        ) {

            if (formMessage) {

                formMessage.textContent =
                    "Please fill all the fields.";

                formMessage.style.color = "red";

            }

            return;

        }


        /* Email validation */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            if (formMessage) {

                formMessage.textContent =
                    "Please enter a valid email address.";

                formMessage.style.color = "red";

            }

            return;

        }


        /* Show sending message */

        if (formMessage) {

            formMessage.textContent =
                "Sending message...";

            formMessage.style.color =
                "#15966a";

        }


        try {

            /* Send data to backend */

            const response = await fetch("/api/contact", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    subject: subject,

                    message: message

                })

            });


            /* Convert response to JSON */

            const data = await response.json();


            /* Backend success */

            if (response.ok) {

                if (formMessage) {

                    formMessage.textContent =
                        data.message ||
                        "Thank you! Your message has been submitted successfully.";

                    formMessage.style.color =
                        "#15966a";

                }


                /* Clear form */

                contactForm.reset();

            }


            /* Backend error */

            else {

                if (formMessage) {

                    formMessage.textContent =
                        data.message ||
                        "Unable to send message. Please try again.";

                    formMessage.style.color =
                        "red";

                }

            }

        }


        /* Network/server error */

        catch (error) {

            console.error(
                "Contact form error:",
                error
            );


            if (formMessage) {

                formMessage.textContent =
                    "Unable to connect to the server. Please try again later.";

                formMessage.style.color =
                    "red";

            }

        }

    });

}



/* =========================================
   BACK TO TOP
========================================= */

const backTop =
    document.getElementById("backTop");


if (backTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 500) {

            backTop.style.display = "block";

        }

        else {

            backTop.style.display = "none";

        }

    });


    backTop.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}



/* =========================================
   CURRENT YEAR
========================================= */

const yearElement =
    document.getElementById("year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}



/* =========================================
   IMAGE FALLBACK
========================================= */

document.querySelectorAll("img").forEach(function (image) {

    image.addEventListener("error", function () {

        console.warn(
            "Image could not be loaded:",
            this.src
        );

        this.style.display = "none";

    });

});