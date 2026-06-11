/* ==========================================
   CONFIG API
========================================== */

const API_URL= "https://script.google.com/macros/s/AKfycbwTBJp3QobxVOBJcoWQxFOHOIAsQGkfktovGBIG7e7_GjTVQEr8aFUghoMpQmdxZZYmgw/exec";

/* ==========================================
   MENU MOBILE
========================================== */

/* const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });

    });

} */

/* ==========================================
   PARAMETRES URL
========================================== */

const params = new URLSearchParams(window.location.search);

const domaineId = params.get("id");

const categoriesContainer =
document.getElementById("categoriesContainer");

/* ==========================================
   VARIABLES GLOBALES
========================================== */

let fingerprint = "";

let selectedCandidateId = "";
let selectedCategoryId = "";
let selectedCandidateName = "";

/* ==========================================
   TOAST NOTIFICATION
========================================== */

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    const toastMessage =
    document.getElementById("toastMessage");

    toast.className = "toast";

    toast.classList.add(type);

    toastMessage.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);
}

/* ==========================================
   LOADER
========================================== */

function showLoader(text = "Chargement...") {

    const loader = document.getElementById("loaderOverlay");

    if (!loader) return; // protection

    document.getElementById("loaderText").innerText = text;

    loader.style.display = "flex";
}

function hideLoader() {

    const loader = document.getElementById("loaderOverlay");

    if (!loader) return; // protection

    loader.style.display = "none";
}

/* ==========================================
   GENERER FINGERPRINT
========================================== */

async function initFingerprint() {

    const fpPromise = FingerprintJS.load();

    const fp = await fpPromise;

    const result = await fp.get();

    fingerprint = result.visitorId;

}

initFingerprint();

/* ==========================================
   DETECTION NAVIGATEUR
========================================== */

function getBrowser() {

    const ua = navigator.userAgent;

    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";

    return "Unknown";
}

/* ==========================================
   CHARGER DOMAINE
========================================== */

async function loadDomain() {

    try {

        const res =
        await fetch(API_URL+ "?action=getDomains");

        const domains = await res.json();

        const domain =
        domains.find(d => d.id === domaineId);

        if (!domain) {

            document.getElementById("domaineTitle")
            .innerText = "Domaine introuvable";

            return;
        }

        document.getElementById("domaineTitle")
        .innerText = domain.name;

    } catch(error) {

        console.error(error);

    }

}

/* ==========================================
   CHARGER CATEGORIES
========================================== */

async function loadCategoriesAndCandidates() {

    try {

        showLoader(
            "Chargement des catégories et candidats..."
        );

        const categoriesRes =
        await fetch(API_URL+ "?action=getCategories");

        const categories =
        await categoriesRes.json();

        const candidatesRes =
        await fetch(API_URL+ "?action=getCandidates");

        const candidates =
        await candidatesRes.json();

        const filteredCategories =
        categories.filter(
            cat => cat.domain === domaineId
        );

        categoriesContainer.innerHTML = "";

        if(filteredCategories.length === 0){

            categoriesContainer.innerHTML = `
                <div style="text-align:center;padding:50px;">
                    <h2>Aucune catégorie disponible</h2>
                </div>
            `;

            return;
        }

        filteredCategories.forEach(category => {

            const categoryCandidates =
            candidates.filter(
                c => c.category === category.id
            );

            let html = `

            <div class="category-block">

                <div class="category-header">

                    <h2 class="category-title">
                        ${category.name}
                    </h2>

                    <p>
                        Votez pour votre candidat favori
                    </p>

                </div>

                <div class="category-candidates">
            `;

            categoryCandidates.forEach(candidate => {

                html += `

                <div class="candidate-card">

                    <img
                        src="${candidate.image}"
                        alt="${candidate.name}"
                    >

                    <div class="candidate-info">

                        <h3>
                            ${candidate.name}
                        </h3>

                        <p>
                            ${candidate.votes || 0} vote(s)
                        </p>

                        <a
                            class="vote-btn-card"
                            onclick="openVote(
                                '${candidate.id}',
                                '${category.id}',
                                '${candidate.name}'
                            )"
                        >
                            Voter
                        </a>

                    </div>

                </div>

                `;
            });

            html += `
                    </div>
                </div>
            `;

            categoriesContainer.innerHTML += html;

        });

        hideLoader();

    } catch(error) {

        hideLoader();

        showToast(
            "Erreur lors du chargement des données.",
            "error"
        );

        console.error(error);

    }

}

/* ==========================================
   OUVRIR MODAL
========================================== */

function openVote(candidateId, categoryId, candidateName) {

    selectedCandidateId = candidateId;
    selectedCategoryId = categoryId;
    selectedCandidateName = candidateName;

    document.getElementById("selectedCandidate")
    .innerText =
    "Vous allez voter pour : " + candidateName;

    document.getElementById("voteModal")
    .style.display = "flex";
}

/* ==========================================
   VOTE SECURISE
========================================== */

async function getUserIP() {

    try {

        const res = await fetch(
            "https://api.ipify.org?format=json"
        );

        const data = await res.json();

        return data.ip;

    } catch(error) {

        return "UNKNOWN";

    }

}



async function confirmVote() {

    try {

        showLoader(
            "Enregistrement du vote..."
        );

        const localKey =
        `${fingerprint}_${selectedCategoryId}`;

        if(localStorage.getItem(localKey)){

            hideLoader();

            showToast(
                "Vous avez déjà voté dans cette catégorie.",
                "warning"
            );

            return;
        }

        const captchaResponse =
        grecaptcha.getResponse();

        if(!captchaResponse){

            showToast(
                "Veuillez confirmer que vous n'êtes pas un robot",
                "warning"
            );

            return;
        }

        const ip = await getUserIP();
        
        const voteData = {

            action: "addVote",

            captcha: captchaResponse,

            domainId: domaineId,

            categoryId: selectedCategoryId,

            candidateId: selectedCandidateId,

            ip: ip,

            fingerprint: fingerprint,

            userAgent: navigator.userAgent,

            browser: getBrowser(),

            platform: navigator.platform,

            language: navigator.language

        };

        const res = await fetch(API, {

            method: "POST",

            body: JSON.stringify(voteData)

        });

        const result = await res.json();

        if(result.success){

            localStorage.setItem(
                localKey,
                selectedCandidateId
            );

            hideLoader();

            showToast(
                "Votre vote a été enregistré avec succès.",
                "success"
            );

            document.getElementById("voteModal")
            .style.display = "none";

            loadCategoriesAndCandidates();

        } else {

            hideLoader();

            showToast(
                result.message ||
                "Vote refusé.",
                "error"
            );

        }

    } catch(error){

        hideLoader();

        console.error(error);

        showToast(
            "Erreur lors de l'enregistrement du vote.",
            "error"
        );

    }

}

/* ==========================================
   FERMETURE MODAL
========================================== */

window.addEventListener("click", (e) => {

    const modal =
    document.getElementById("voteModal");

    if(e.target === modal){

        modal.style.display = "none";

    }

});

/* ==========================================
   INITIALISATION
========================================== */

loadDomain();
loadCategoriesAndCandidates();