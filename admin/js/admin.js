/* ===================================
   TOAST NOTIFICATION
=================================== */

function showToast(message, type = "success") {

    const container =
    document.getElementById("toastContainer");

    const toast =
    document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 4000);
}

/* ===================================
   MODAL CONFIRMATION
=================================== */

function showConfirm(message){

    return new Promise(resolve => {

        const modal =
        document.getElementById("confirmModal");

        document.getElementById(
            "confirmMessage"
        ).innerText = message;

        modal.style.display = "flex";

        const ok =
        document.getElementById("confirmOk");

        const cancel =
        document.getElementById("confirmCancel");

        ok.onclick = () => {

            modal.style.display = "none";

            resolve(true);

        };

        cancel.onclick = () => {

            modal.style.display = "none";

            resolve(false);

        };

    });
}

/* ===================================
   CONFIGURATION
=================================== */

const CLOUD_NAME = "doepcl1iu";
const UPLOAD_PRESET = "bmm_prod_votes";

const API = "https://script.google.com/macros/s/AKfycbwjAb1JNdI90Wt_7MbfxOiEEqWXiawfrP21oLfXap6CzTJYOtUT2_cCH2EUo5Ni3j8uWg/exec";

/* ===================================
   PREVIEW IMAGE
=================================== */

const imageInput = document.getElementById("candImage");

if(imageInput){

    imageInput.addEventListener("change", function(){

        const file = this.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = e => {

            document.getElementById("preview").src =
            e.target.result;

            document.getElementById("preview").style.display =
            "block";

        }

        reader.readAsDataURL(file);

    });

}

/* ===================================
   CLOUDINARY UPLOAD
=================================== */

async function uploadToCloudinary(file){

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method:"POST",
            body:formData
        }
    );

    const data = await response.json();

    return data.secure_url;

}

/* ===================================
   DOMAINES
=================================== */

async function addDomain(){

    const name =
    document.getElementById("domainName").value.trim();
    const description =
    document.getElementById("domainDescription").value.trim();
    /* const file =
    document.getElementById("domainImage").files[0]; */
    const image = document.getElementById("domainImage");

    imageUrl = await uploadToCloudinary(image.files[0]);

    if(!name){
       /*  alert("Nom du domaine requis");
        return; */
        showToast(
            "Nom du domaine requis",
            "warning"
        );
        return;
    }

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"addDomain",
            name,
            description,
            image:imageUrl
        })
    });

    document.getElementById("domainName").value = "";
    document.getElementById("domainDescription").value = "";
    document.getElementById("domainImage").value = "";
    loadDomains();
    loadStats();

    /* alert("Domaine ajouté"); */
    showToast(
        "Domaine ajouté avec succès",
        "success"
    );

}

async function loadDomains(){

    const response =
    await fetch(API + "?action=getDomains");

    const data =
    await response.json();

    const table =
    document.getElementById("domainsTable");

    const select =
    document.getElementById("categoryDomain");

    if(table) table.innerHTML = "";
    if(select) select.innerHTML = "";

    data.forEach(domain => {

        if(table){

            table.innerHTML += `
            <tr>

                <td>${domain.id}</td>

                <td>${domain.name}</td>

                <td>

                    <button
                    class="delete-btn"
                    onclick="deleteDomain('${domain.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>
            `;

        }

        if(select){

            select.innerHTML += `
            <option value="${domain.id}">
                ${domain.name}
            </option>
            `;

        }

    });

}

async function deleteDomain(id){

    const confirmed = await showConfirm("Supprimer ce domaine ?");

    if(!confirmed) return;

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"deleteDomain",
            id
        })
    });

    loadDomains();
    loadCategories();
    loadStats();

}

/* ===================================
   CATEGORIES
=================================== */

async function addCategory(){

    const name =
    document.getElementById("categoryName").value.trim();

    const description =
    document.getElementById("categoryDescription").value.trim();

    const domainId =
    document.getElementById("categoryDomain").value;

    if(!name){

        // alert("Nom catégorie requis");

        showToast(
            "Nom de la catégorie requis",
            "warning"
        );
        return;

    }

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"addCategory",
            name,
            domainId,
            description
        })
    });

    document.getElementById("categoryName").value = "";
    document.getElementById("categoryDescription").value = "";

    loadCategories();
    loadStats();

    showToast(
        "Catégorie ajoutée avec succès",
        "success"
    );

}

async function loadCategories(){

    const response =
    await fetch(API + "?action=getCategories");

    const data =
    await response.json();

    const table =
    document.getElementById("categoriesTable");

    const select =
    document.getElementById("candCat");

    if(table) table.innerHTML = "";
    if(select) select.innerHTML = "";

    data.forEach(cat => {

        if(table){

            table.innerHTML += `
            <tr>

                <td>${cat.id}</td>

                <td>${cat.name}</td>

                <td>${cat.domain}</td>

                <td>

                    <button
                    class="delete-btn"
                    onclick="deleteCategory('${cat.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            </tr>
            `;

        }

        if(select){

            select.innerHTML += `
            <option value="${cat.id}">
                ${cat.name}
            </option>
            `;

        }

    });

}

async function deleteCategory(id){

    const confirmed = await showConfirm("Supprimer cette catégorie ?");

    if(!confirmed) return;

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"deleteCategory",
            id
        })
    });

    loadCategories();
    loadStats();

}

/* ===================================
   CANDIDATS
=================================== */

async function addCandidate(){

    const name =
    document.getElementById("candName").value.trim();

    const categoryId =
    document.getElementById("candCat").value;

    const description = document.getElementById("candDescription").value.trim();

    const file =
    document.getElementById("candImage").files[0];

    if(!name || !file){

        showToast(
            "Tous les champs sont requis",
            "warning"
        );
        return;

    }

    try{

        const imageUrl =
        await uploadToCloudinary(file);

        await fetch(API,{
            method:"POST",
            body:JSON.stringify({
                action:"addCandidate",
                name,
                categoryId,
                description,   
                image:imageUrl
            })
        });

        document.getElementById("candName").value = "";
        document.getElementById("candImage").value = "";
        document.getElementById("candDescription").value = "";

        loadCandidates();
        loadStats();

        showToast(
            "Candidat ajouté avec succès",
            "success"
        );

    }catch(error){

        console.error(error);

        showToast(
            "Erreur lors de l'ajout du candidat",
            "error"
        );

    }

}

async function loadCandidates(){

    const response =
    await fetch(API + "?action=getCandidates");

    const data =
    await response.json();

    const table =
    document.getElementById("candidatesTable");

    if(!table) return;

    table.innerHTML = "";

    data.forEach(candidate => {

        table.innerHTML += `
        <tr>

            <td>

                <img
                src="${candidate.image}"
                width="50">

            </td>

            <td>${candidate.name}</td>

            <td>${candidate.category}</td>

            <td>${candidate.votes}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deleteCandidate('${candidate.id}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

}

async function deleteCandidate(id){

    const confirmed = await showConfirm("Supprimer ce candidat ?");

    if(!confirmed) return;

    await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            action:"deleteCandidate",
            id
        })
    });

    loadCandidates();
    loadStats();

}

/* ===================================
   VOTES
=================================== */

async function loadVotes(){

    const response =
    await fetch(API + "?action=getVotes");

    const data =
    await response.json();

    const table =
    document.getElementById("votesTable");

    if(!table) return;

    table.innerHTML = "";

    data.forEach(vote => {

        table.innerHTML += `
        <tr>

            <td>${vote.candidate}</td>

            <td>${vote.category}</td>

            <td>${vote.domain}</td>

            <td>${vote.ip}</td>

            <td>${vote.fingerprint}</td>

            <td>${vote.date}</td>

        </tr>
        `;

    });

}

/* ===================================
   STATISTIQUES
=================================== */

async function loadStats(){

    const response =
    await fetch(API + "?action=getStats");

    const stats =
    await response.json();

    document.getElementById("totalDomains").innerText =
    stats.domains;

    document.getElementById("totalCategories").innerText =
    stats.categories;

    document.getElementById("totalCandidates").innerText =
    stats.candidates;

    document.getElementById("totalVotes").innerText =
    stats.votes;

}

/* ===================================
   INITIALISATION
=================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadStats();

    loadDomains();

    loadCategories();

    loadCandidates();

    loadVotes();

});