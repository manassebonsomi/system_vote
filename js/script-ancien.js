
/* ==========================
   AOS INITIALIZATION
========================== */

AOS.init({
    duration: 1000,
    once: true
});

/* ==========================
   HAMBURGER MENU MOBILE
========================== */

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* fermeture menu après clic lien */

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

/* ==========================
   COUNTDOWN TIMER
========================== */

const eventDate = new Date("2026-09-19 23:59:59").getTime();

function updateCountdown() {

    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ==========================
   COUNTER ANIMATION STATS
========================== */

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const update = () => {

        const target = +counter.getAttribute("data-target");
        const current = +counter.innerText;

        const increment = target / 100;

        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(update, 20);
        } else {
            counter.innerText = target.toLocaleString();
        }

    };

    update();

});

/* ==========================
   GOOGLE SHEETS - CATEGORIES
   (READY FOR API INTEGRATION)
========================== */

const domainesContainer = document.getElementById("domainesContainer");

/*
  🔥 Remplace URL_API par ton Google Apps Script
*/

const API_CATEGORIES = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";

async function loadCategories() {

    try {

        // VERSION DEMO (fallback si API non connectée)
        const demoDomaines = [
            {
                id: "politique",
                name: "Politique",
                image: "https://picsum.photos/500/500?1"
            },
            {
                id: "culture-arts",
                name: "Culture & Arts",
                image: "https://picsum.photos/500/500?2"
            },
            {
                id: "sante",
                name: "Santé",
                image: "https://picsum.photos/500/500?3"
            },
            {
                id: "sport-loisirs",
                name: "Sport & Loisirs",
                image: "https://picsum.photos/500/500?4"
            }
        ];

        renderDomaines(demoDomaines);

        /* ===== VERSION GOOGLE SHEETS (ACTIVE PLUS TARD) =====
        const res = await fetch(API_CATEGORIES);
        const data = await res.json();
        renderDomaines(data);
        */

    } catch (error) {
        console.log("Erreur chargement domaines:", error);
    }

}

function renderDomaines(domaines) {

    domainesContainer.innerHTML = "";

    domaines.forEach(domaine => {

        domainesContainer.innerHTML += `
            <div class="domaine-card" data-aos="fade-up">

                <div class="domaine-image">
                    <img src="${domaine.image}" alt="${domaine.name}">
                </div>

                <div class="domaine-content">

                    <h3>${domaine.name}</h3>

                    <p>
                        Découvrez les candidats de ce domaine.
                    </p>

                    <a href="domaine.html?id=${domaine.id}">
                        Voter
                    </a>

                </div>

            </div>
        `;

    });

}

loadCategories();

/* ==========================
   NEWSLETTER (FRONT ONLY)
========================== */

const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = newsletterForm.querySelector("input").value;

    if (!email) return;

    alert("Merci pour votre inscription !");

    newsletterForm.reset();

    /* ===== FUTUR GOOGLE SHEETS =====
    fetch(API_NEWSLETTER, {
        method: "POST",
        body: JSON.stringify({ email })
    });
    */

});

/* ==========================
   SCROLL NAV EFFECT (OPTION PREMIUM)
========================== */

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
        navbar.style.background = "rgba(255,255,255,0.95)";
    } else {
        navbar.style.boxShadow = "none";
        navbar.style.background = "rgba(255,255,255,0.85)";
    }

});

/* ==========================
   FUTURE READY (VOTE SYSTEM)
========================== */

/*
function vote(candidateId) {

    fetch(API_VOTE, {
        method: "POST",
        body: JSON.stringify({
            candidate: candidateId,
            date: new Date()
        })
    });

}
*/