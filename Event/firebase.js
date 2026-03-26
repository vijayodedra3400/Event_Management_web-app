import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo6hJH1-2QPvBSLCgTipi91BiYonmAdQQ",
  authDomain: "event-management-60474.firebaseapp.com",
  projectId: "event-management-60474",
  storageBucket: "event-management-60474.appspot.com",
  messagingSenderId: "547141903613",
  appId: "1:547141903613:web:156d3b3427f4fb934e8a94"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
