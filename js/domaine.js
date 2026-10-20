/* ==========================================
   CONFIG API
========================================== */

const API_URL= "https://script.google.com/macros/s/AKfycbz9oiSrmpafYmOn1QoP_o7gLuGF_8RyqKo1ppzLIuospKK8rdpCmWFI3ZMYbSR81VNs8w/exec";

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
   RECHERCHE INSTANTANÉE DES CANDIDATS
========================================== */

const candidateSearchInput =
    document.getElementById("candidateSearch");

const clearCandidateSearch =
    document.getElementById("clearCandidateSearch");

const searchResultsInfo =
    document.getElementById("searchResultsInfo");

const noSearchResults =
    document.getElementById("noSearchResults");


/*
 * Normalise le texte :
 * - minuscules ;
 * - suppression des accents ;
 * - suppression des espaces inutiles.
 *
 * Exemple :
 * "Député National" devient "depute national".
 */

function normalizeSearchText(value) {

    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

}


/* Appliquer le filtre sur les candidats affichés */

function filterCandidates() {

    if (!categoriesContainer) {
        return;
    }

    const searchTerm = normalizeSearchText(
        candidateSearchInput?.value || ""
    );

    const categoryBlocks =
        categoriesContainer.querySelectorAll(".category-block");

    let totalCandidates = 0;
    let visibleCandidates = 0;

    categoryBlocks.forEach(categoryBlock => {

        const candidateCards =
            categoryBlock.querySelectorAll(".candidate-card");

        let visibleInCategory = 0;

        candidateCards.forEach(candidateCard => {

            totalCandidates++;

            const candidateName =
                candidateCard.querySelector(".candidate-info h3")
                    ?.textContent || "";

            const normalizedName =
                normalizeSearchText(candidateName);

            const matches =
                searchTerm === "" ||
                normalizedName.includes(searchTerm);

            candidateCard.hidden = !matches;

            if (matches) {
                visibleInCategory++;
                visibleCandidates++;
            }

        });

        /*
         * Si une recherche est en cours,
         * masquer les catégories sans candidat correspondant.
         *
         * Sans recherche, toutes les catégories restent visibles.
         */

        categoryBlock.hidden =
            searchTerm !== "" && visibleInCategory === 0;

    });

    /* Afficher ou masquer le bouton d'effacement */

    if (clearCandidateSearch) {

        clearCandidateSearch.hidden =
            searchTerm === "";

    }

    /* Compteur de résultats */

    if (searchResultsInfo) {

        if (searchTerm === "") {

            searchResultsInfo.textContent =
                `${totalCandidates} candidat(s) disponible(s) dans ce domaine.`;

        } else {

            searchResultsInfo.textContent =
                `${visibleCandidates} résultat(s) sur ${totalCandidates} candidat(s).`;

        }

    }

    /* Aucun résultat trouvé */

    if (noSearchResults) {

        noSearchResults.hidden =
            searchTerm === "" || visibleCandidates > 0;

    }

}


/* Recherche automatique pendant la saisie */

if (candidateSearchInput) {

    candidateSearchInput.addEventListener(
        "input",
        filterCandidates
    );

}


/* Bouton pour effacer la recherche */

if (clearCandidateSearch) {

    clearCandidateSearch.addEventListener("click", () => {

        if (!candidateSearchInput) {
            return;
        }

        candidateSearchInput.value = "";

        filterCandidates();

        candidateSearchInput.focus();

    });

}


/* Bouton pour réafficher tous les candidats */

const resetCandidateSearch =
    document.getElementById("resetCandidateSearch");

if (resetCandidateSearch) {

    resetCandidateSearch.addEventListener("click", () => {

        if (!candidateSearchInput) {
            return;
        }

        candidateSearchInput.value = "";

        filterCandidates();

        candidateSearchInput.focus();

    });

}

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

            filterCandidates();
            hideLoader();

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
                        alt="${candidate.name}" loading="lazy"
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

        filterCandidates();
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

        /* const captchaResponse =
        grecaptcha.getResponse();

        if(!captchaResponse){

            showToast(
                "Veuillez confirmer que vous n'êtes pas un robot",
                "warning"
            );

            return;
        } */

        const ip = await getUserIP();
        
        const voteData = {

            action: "addVote",

            /* captcha: captchaResponse, */

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