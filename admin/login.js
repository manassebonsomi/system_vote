import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDvzRWbx1doDwXlLGTUDPihRvRWwz4wYLI",
    authDomain: "norbertine-matanda.firebaseapp.com",
    projectId: "norbertine-matanda",
    storageBucket: "norbertine-matanda.firebasestorage.app",
    messagingSenderId: "96623456247",
    appId: "1:96623456247:web:3aec130a141046fb86c8f2",
    measurementId: "G-EJ5KR31HQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const errorBox = document.getElementById("error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    errorBox.style.color = "green";
    errorBox.innerText = "Connexion réussie...";

    setTimeout(() => {
      /* window.location.href = "dashboard.html"; */
      window.location.replace("admin.html");
    }, 1000);

  } /* catch (error) {
    errorBox.style.color = "red";
    errorBox.innerText = error.message;
  } */

    catch (error) {

  console.log("Firebase error:", error);

  errorBox.style.display = "block";
  errorBox.style.color = "#b91c1c";
  errorBox.style.background = "#fee2e2";
  errorBox.style.padding = "12px 15px";
  errorBox.style.borderRadius = "10px";

  // Message propre Firebase
  let message = "❌ Mauvais email ou mot de passe";

  /* switch (error.code) {

    case "auth/wrong-password":
      message = "❌ Mot de passe incorrect";
      break;

    case "auth/user-not-found":
      message = "❌ Aucun compte trouvé avec cet email";
      break;

    case "auth/invalid-email":
      message = "❌ Email invalide";
      break;

    case "auth/too-many-requests":
      message = "❌ Trop de tentatives. Réessayez plus tard.";
      break;

    default:
      message = error.message;
  } */

  errorBox.innerText = message;
  }
});