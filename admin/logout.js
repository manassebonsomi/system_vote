import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

document
.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  /* window.location.href = "login.html"; */
    window.location.replace("login.html");

});