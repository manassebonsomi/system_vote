/* ==========================
   CONFIGURATION API
========================== */

const API = "https://script.google.com/macros/s/AKfycbz9oiSrmpafYmOn1QoP_o7gLuGF_8RyqKo1ppzLIuospKK8rdpCmWFI3ZMYbSR81VNs8w/exec";

/* ==========================
   AOS INITIALIZATION
========================== */

AOS.init({
    duration: 1000,
    once: true
});

/* ==========================
   MENU MOBILE
========================== */

/* const hamburger =
document.querySelector(".hamburger");

const navLinks =
document.querySelector(".nav-links");

if (hamburger && navLinks) {

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

            });

        });

} */

/* ==========================
   NAVBAR SCROLL EFFECT
========================== */

window.addEventListener("scroll", () => {

    const navbar =
    document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.background =
        "rgba(255,255,255,0.97)";

        navbar.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.12)";

    } else {

        navbar.style.background =
        "rgba(255,255,255,0.85)";

        navbar.style.boxShadow =
        "none";

    }

});

/* ==========================
   COUNTDOWN
========================== */

const eventDate =
new Date("2026-09-19 23:59:59").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = eventDate - now;

    if (distance <= 0) {

        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";

        return;
    }

    const days =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours =
        Math.floor(
            (distance % (1000 * 60 * 60 * 24))
            / (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (distance % (1000 * 60 * 60))
            / (1000 * 60)
        );

    const seconds =
        Math.floor(
            (distance % (1000 * 60))
            / 1000
        );

    document.getElementById("days").innerText =
    String(days).padStart(2, "0");

    document.getElementById("hours").innerText =
    String(hours).padStart(2, "0");

    document.getElementById("minutes").innerText =
    String(minutes).padStart(2, "0");

    document.getElementById("seconds").innerText =
    String(seconds).padStart(2, "0");

}

if (document.getElementById("days")) {

    updateCountdown();

    setInterval(updateCountdown, 1000);

}

/* ==========================
   ANIMATION STATS
========================== */

function animateCounters() {

    const counters =
    document.querySelectorAll(".counter");

    counters.forEach(counter => {

        counter.innerText = "0";

        const target =
        Number(counter.dataset.target);

        const update = () => {

            const current =
            Number(counter.innerText);

            const increment =
            Math.ceil(target / 100);

            if (current < target) {

                counter.innerText =
                Math.min(
                    current + increment,
                    target
                );

                setTimeout(update, 20);

            } else {

                counter.innerText =
                target.toLocaleString();

            }

        };

        update();

    });

}

/* ==========================
   CHARGEMENT DOMAINES
========================== */

const domainesContainer =
document.getElementById("domainesContainer");

async function loadDomaines() {

    if (!domainesContainer) return;

    try {

        domainesContainer.innerHTML = `
            <div class="loading">
                Chargement des domaines...
            </div>
        `;

        const response = await fetch(
            API + "?action=getDomains"
        );

        const domaines =
        await response.json();

        renderDomaines(domaines);

    } catch (error) {

        console.error(error);

        domainesContainer.innerHTML = `
            <div class="error">
                Impossible de charger les domaines
            </div>
        `;

    }

}

/* ==========================
   AFFICHAGE DOMAINES
========================== */

function renderDomaines(domaines) {

    domainesContainer.innerHTML = "";

    if (!domaines.length) {

        domainesContainer.innerHTML = `
            <div class="error">
                Aucun domaine disponible
            </div>
        `;

        return;
    }

    domaines.forEach(domaine => {

        domainesContainer.innerHTML += `

        <div class="domaine-card" data-aos="fade-up">

            <div class="domaine-image">

                <img
                    src="${domaine.image}"
                    alt="${domaine.name}"
                >

            </div>

            <div class="domaine-content">

                <h3>${domaine.name}</h3>

                <p>
                    ${domaine.description}
                </p>

                <a href="domaine.html?id=${domaine.id}">
                    Voir les catégories
                </a>

            </div>

        </div>

        `;

    });

}

/* ==========================
   STATISTIQUES
========================== */

async function loadStats() {

    try {

        const response = await fetch(
            API + "?action=getStats"
        );

        const stats =
        await response.json();

        const counters =
        document.querySelectorAll(".counter");

        if (counters.length >= 3) {

            counters[0].dataset.target =
            stats.votes || 0;

            counters[1].dataset.target =
            stats.candidates || 0;

            counters[2].dataset.target =
            stats.categories || 0;

            animateCounters();

        }

    } catch (error) {

        console.error(
            "Erreur statistiques :",
            error
        );

    }

}

/* ==========================
   NEWSLETTER
========================== */

const newsletterForm =
document.getElementById("newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const email =
            newsletterForm.querySelector(
                "input"
            ).value.trim();

            if (!email) {

                alert(
                    "Veuillez saisir votre email"
                );

                return;
            }

            try {

                /*
                await fetch(API,{
                    method:"POST",
                    body:JSON.stringify({
                        action:"newsletter",
                        email
                    })
                });
                */

                alert(
                    "Inscription réussie."
                );

                newsletterForm.reset();

            } catch (error) {

                alert(
                    "Erreur lors de l'inscription."
                );

            }

        }
    );

}

/* ==========================
   TOP CANDIDATS
========================== */

async function loadTopCandidates() {

    try {

        const response = await fetch(
            API + "?action=getTopCandidates"
        );

        const data =
        await response.json();

        console.log(
            "Top candidats :",
            data
        );

        /*
        Plus tard :
        afficher les top candidats
        automatiquement ici.
        */

    } catch (error) {

        console.error(error);

    }

}

/* ==========================
   INITIALISATION
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDomaines();

        loadStats();

        loadTopCandidates();

    }
);