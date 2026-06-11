/* ==========================================
   MENU MOBILE
========================================== */

const hamburger = document.querySelector(".hamburger");
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

}

/* ==========================================
   RECUPERATION ID DOMAINE
========================================== */

const params = new URLSearchParams(window.location.search);
const domaineId = params.get("id") || "politique";

/* ==========================================
   DONNEES DEMO
   (REMPLACEES PLUS TARD PAR APPS SCRIPT)
========================================== */

const domaines = [
    {
        id: "politique",
        name: "Politique"
    },
    {
        id: "culture-arts",
        name: "Culture et Arts"
    },
    {
        id: "sante",
        name: "Santé"
    },
    {
        id: "sport-loisirs",
        name: "Sport et Loisirs"
    }
];

const categories = [

    {
        id: 1,
        domaine: "politique",
        name: "Président"
    },

    {
        id: 2,
        domaine: "politique",
        name: "Député National"
    },

    {
        id: 3,
        domaine: "politique",
        name: "Député Provincial"
    },

    {
        id: 4,
        domaine: "politique",
        name: "Secrétaire Général"
    },

    {
        id: 5,
        domaine: "culture-arts",
        name: "Meilleur Artiste"
    },

    {
        id: 6,
        domaine: "culture-arts",
        name: "Meilleur Album"
    },
    {
        id: 7,
        domaine: "sante",
        name: "Meilleur Médecin"
    },

    {
        id: 8,
        domaine: "sante",
        name: "Meilleur Hôpital"
    },
    {
        id: 9,
        domaine: "sport-loisirs",
        name: "Meilleur Footballeur"
    },
    {
        id: 10,
        domaine: "sport-loisirs",
        name: "Meilleur Entraîneur"
    }

];

const candidates = [

    {
        id: 1,
        categoryId: 1,
        name: "Jean Mukendi",
        image: "https://picsum.photos/500/500?1"
    },

    {
        id: 2,
        categoryId: 1,
        name: "Paul Kabeya",
        image: "https://picsum.photos/500/500?2"
    },

    {
        id: 3,
        categoryId: 2,
        name: "Patrick Tshiala",
        image: "https://picsum.photos/500/500?3"
    },

    {
        id: 4,
        categoryId: 2,
        name: "David Nzambe",
        image: "https://picsum.photos/500/500?4"
    },

    {
        id: 5,
        categoryId: 3,
        name: "Sarah Mbuyi",
        image: "https://picsum.photos/500/500?5"
    },

    {
        id: 6,
        categoryId: 3,
        name: "Grace Kanku",
        image: "https://picsum.photos/500/500?6"
    },

    {
        id: 7,
        categoryId: 4,
        name: "Merveille Manda",
        image: "https://picsum.photos/500/500?7"
    },

    {
        id: 8,
        categoryId: 4,
        name: "Joël Kasongo",
        image: "https://picsum.photos/500/500?8"
    },
    {
        id: 9,
        categoryId: 5,
        name: "Alice Martin",
        image: "https://picsum.photos/500/500?9"
    },

    {
        id: 10,
        categoryId: 5,
        name: "Bob Smith",
        image: "https://picsum.photos/500/500?10"
    },

    {
        id: 11,
        categoryId: 6,
        name: "Charlie Brown",
        image: "https://picsum.photos/500/500?11"
    },

    {
        id: 12,
        categoryId: 6,
        name: "Diana Ross",
        image: "https://picsum.photos/500/500?12"
    },

    {
        id: 13,
        categoryId: 7,
        name: "Dr. John Doe",
        image: "https://picsum.photos/500/500?13"
    },
    
    {
        id: 14,
        categoryId: 7,
        name: "Dr. Jane Smith",
        image: "https://picsum.photos/500/500?14"
    },

    {
        id: 15,
        categoryId: 8,
        name: "Hôpital Central",
        image: "https://picsum.photos/500/500?15"
    },

    {
        id: 16,
        categoryId: 8,
        name: "Clinique Sainte-Marie",
        image: "https://picsum.photos/500/500?16"
    },

    {
        id: 17,
        categoryId: 9,
        name: "Lionel Messi",
        image: "https://picsum.photos/500/500?17"
    },

    {
        id: 18,
        categoryId: 9,
        name: "Cristiano Ronaldo",
        image: "https://picsum.photos/500/500?18"
    },

    {
        id: 19,
        categoryId: 10,
        name: "Pep Guardiola",
        image: "https://picsum.photos/500/500?19"
    },

    {
        id: 20,
        categoryId: 10,
        name: "Jürgen Klopp",
        image: "https://picsum.photos/500/500?20"
    },

    {
        id: 21,
        categoryId: 1,
        name: "Marie Dupont",
        image: "https://picsum.photos/500/500?21"
    }
];

/* ==========================================
   TITRE DOMAINE
========================================== */

const currentDomaine = domaines.find(
    d => d.id === domaineId
);

if (currentDomaine) {

    document.getElementById("domaineTitle").textContent =
        currentDomaine.name;

}

/* ==========================================
   AFFICHAGE DES CATEGORIES
========================================== */

const container =
document.getElementById("categoriesContainer");

const domaineCategories = categories.filter(
    category => category.domaine === domaineId
);

if (domaineCategories.length === 0) {

    container.innerHTML = `
        <div style="
            text-align:center;
            padding:50px;
        ">
            <h2>Aucune catégorie trouvée</h2>
        </div>
    `;

}

/* ==========================================
   GENERATION DES BLOCS
========================================== */

domaineCategories.forEach(category => {

    const categoryCandidates = candidates.filter(
        candidate => candidate.categoryId === category.id
    );

    let html = `

        <div class="category-block">

            <div class="category-header">

                <div>

                    <h2 class="category-title">
                        ${category.name}
                    </h2>

                    <p class="category-description">
                        Sélectionnez votre candidat favori
                    </p>

                </div>

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

                    <a
                        class="vote-btn-card"
                        onclick="openVote(
                            '${candidate.name}',
                            ${candidate.id},
                            ${category.id}
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

    container.innerHTML += html;

});

/* ==========================================
   MODAL VOTE
========================================== */

let selectedCandidateId = null;
let selectedCategoryId = null;

function openVote(candidateName, candidateId, categoryId) {

    selectedCandidateId = candidateId;
    selectedCategoryId = categoryId;

    document.getElementById("selectedCandidate").innerText =
        "Vous allez voter pour : " + candidateName;

    document.getElementById("voteModal").style.display = "flex";

}

/* ==========================================
   CONFIRMATION VOTE
========================================== */

function confirmVote() {

    const email =
        document.getElementById("emailInput").value.trim();

    if (!email) {

        alert("Veuillez entrer votre adresse email");
        return;

    }

    /* ==========================================
       ANTI DOUBLE VOTE PAR CATEGORIE
    ========================================== */

    const voteKey =
        `${email}_${selectedCategoryId}`;

    const alreadyVoted =
        localStorage.getItem(voteKey);

    if (alreadyVoted) {

        alert(
            "Vous avez déjà voté dans cette catégorie."
        );

        return;

    }

    localStorage.setItem(
        voteKey,
        selectedCandidateId
    );

    alert(
        "Votre vote a été enregistré avec succès."
    );

    document.getElementById("voteModal").style.display =
        "none";

    document.getElementById("emailInput").value = "";

    /* ==========================================
       FUTURE INTEGRATION APPS SCRIPT
    ========================================== */

    /*
    fetch("URL_APPS_SCRIPT", {
        method:"POST",
        body:JSON.stringify({
            email,
            domaineId,
            categoryId:selectedCategoryId,
            candidateId:selectedCandidateId
        })
    });
    */

}

/* ==========================================
   FERMETURE MODAL
========================================== */

window.addEventListener("click", (e) => {

    const modal =
        document.getElementById("voteModal");

    if (e.target === modal) {

        modal.style.display = "none";

    }

});