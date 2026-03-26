/* ===============================
   FIREBASE IMPORTS
================================ */
import { auth, db } from "./firebase.js";
import {
    doc, 
    getDoc,
    setDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* ===============================
   SAFE HTML LOADERS
================================ */
document.addEventListener("DOMContentLoaded", () => {

    // Load navbar
    fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
      const nav = document.getElementById("navbar");
      if (nav) nav.innerHTML = html;
      
      const sidebar = document.getElementById("sidebarMenu");
      const overlay = document.querySelector(".page-overlay");

      if (sidebar) {
        sidebar.addEventListener("show.bs.offcanvas", () => {
          document.body.classList.add("sidebar-open");
        });

        sidebar.addEventListener("hidden.bs.offcanvas", () => {
          document.body.classList.remove("sidebar-open");
        });

        if (overlay) {
          overlay.addEventListener("click", () => {
            bootstrap.Offcanvas.getInstance(sidebar)?.hide();
          });
        }
      }
      
      setupNavbarAuth();
    });
    //registration form
    document.addEventListener("DOMContentLoaded", () => {
      fetch("registration.html")
        .then(res => res.text())
        .then(data => {
          document.getElementById("auth-container").innerHTML = data;
        });
    });
    
  // Load registration navbar
  fetch("registration_navbar.html")
    .then(r => r.text())
    .then(data => {
      const rnav = document.getElementById("registration_navbar");
      if (rnav) rnav.innerHTML = data;
    })
    .catch(() => {});

  // Load footer
  fetch("footer.html")
    .then(r => r.text())
    .then(data => {
      const footer = document.getElementById("footer");
      if (footer) footer.innerHTML = data;
    })
    .catch(() => {});

  // Load event solution
  fetch("eventsolution.html")
    .then(r => r.text())
    .then(data => {
      const es = document.getElementById("eventsolution");
      if (es) {
        es.innerHTML = data;
        initEventSolutionToggle();
      }
    })
    .catch(() => {});
});


/* ===============================
   NAVBAR AUTH & DYNAMIC USERNAME
================================ */

window.setupNavbarAuth = function () {
  const navAuth = document.getElementById("nav-auth");
  const sidebarAuth = document.getElementById("sidebar-auth");

  if (!navAuth || !sidebarAuth) return;

  onAuthStateChanged(auth, user => {

    // 🔴 NOT LOGGED IN → SHOW SIGN UP
    if (!user) {
      navAuth.innerHTML = `
        <a href="registration.html"
           class="btn ms-3 fw-bold" style="border:1px solid #c7acd9;color:#c7acd9;">
           Sign Up
        </a>
      `;

      sidebarAuth.innerHTML = `
        <a href="registration.html"
           class="btn btn-primary w-100">
           Sign Up
        </a>
      `;
      return;
    }

    // 🟢 LOGGED IN → SHOW USER + LOGOUT IN SIDEBAR
    navAuth.innerHTML = `
    <i class="bi bi-person-circle ps-2 fs-5" id="profileIcon" style="cursor:pointer"></i>
    <span>${user.displayName || "User"}</span>`;
    setTimeout(() => {
      const icon = document.getElementById("profileIcon");
    
      if (icon) {
        icon.addEventListener("click", () => {
          const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
          modal.show();
        });
      }
    
      // logout confirm
      const logoutBtn = document.getElementById("confirmLogoutBtn");
    
      if (logoutBtn) {
        logoutBtn.onclick = () => {
          signOut(auth);
          location.reload();
        };
      }
    
    }, 100);
  

    sidebarAuth.innerHTML = `
      <button class="btn btn-danger w-100" id="logoutBtn">
        Logout
      </button>
    `;

    document.getElementById("logoutBtn").onclick = () => {
      signOut(auth);
      location.reload();
    };
  });
};


/* ===============================
   EVENT SOLUTION TOGGLE
================================ */
function initEventSolutionToggle() {
  const btn = document.getElementById("toggleViewBtn");
  const grid = document.getElementById("gridView");
  const vertical = document.getElementById("verticalView");

  if (!btn || !grid || !vertical) return;

  btn.addEventListener("click", () => {
    grid.classList.toggle("d-none");
    vertical.classList.toggle("d-none");

    btn.innerHTML = grid.classList.contains("d-none")
      ? '<i class="fas fa-th me-2"></i> Switch to Grid View'
      : '<i class="fas fa-list-ul me-2"></i> Switch to Detailed View';
  });
}


/* ===============================
   COUNTER ANIMATION
================================ */
const stats = document.getElementById("stats-section");

if (stats) {
  const counters = document.querySelectorAll(".counter");
  const duration = 2000;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(counter => {
          const target = +counter.dataset.target;
          let start = 0;
          const step = target / (duration / 16);

          const update = () => {
            start += step;
            if (start < target) {
              counter.innerText = Math.floor(start);
              requestAnimationFrame(update);
            } else {
              counter.innerText = target;
            }
          };
          update();
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(stats);
}

  /* ===============================
     REGISTRATION PAGE
  ================================ */

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  if ( eventId) {

    let currentUser = null;
    let currentEvent = null;

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("Please login to register for the event");
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return;
      }
      console.log("AUTH UID:", user.uid);

      // USER
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        currentUser = userSnap.data();
      
        const nameField = document.getElementById("name");
        if (nameField) {
          nameField.value = currentUser.name || "";
        }
      
        const emailField = document.getElementById("userEmail");
        if (emailField) {
          emailField.value = currentUser.email;
        }
      
        const phoneField = document.getElementById("phone");
        if (phoneField) {
          phoneField.value = currentUser.phone || "";
        }
      }
      
      // EVENT
      const eventSnap = await getDoc(doc(db, "events", eventId));
      if (!eventSnap.exists()) return;

      currentEvent = eventSnap.data();

      const eventNameEl = document.getElementById("eventName");
      if (eventNameEl) {
        eventNameEl.innerText = currentEvent.title;
      }
      document.getElementById("eventDate").innerText = currentEvent.date;
      document.getElementById("eventLocation").innerText = currentEvent.location;
      document.getElementById("eventPrice").innerText = "₹" + currentEvent.price;
      document.getElementById("totalAmount").innerText = "₹" + currentEvent.price;
    });

    const registrationForm = document.getElementById("registrationForm");

    if (registrationForm) {
      registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
      });
    }

  }

  /* ===============================
     PAYMENT PAGE
  ================================ */
  const orderTotal = document.getElementById("orderTotal");

  if (orderTotal && eventId) {

    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      let userSnap = await getDoc(userRef);

      // 🚑 AUTO-CREATE USER DOC IF MISSING
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          // phone: user.phone,
          createdAt: serverTimestamp()
        },{merge:true});

        userSnap = await getDoc(userRef); // re-fetch
      }

      const u = userSnap.data();

      // DISPLAY
      document.getElementById("summaryEmail").innerText =
        u.email || user.email;
        document.getElementById("summaryName").innerText =
        u.name || user.name;

      // PREFILL EDIT MODAL
      const editName = document.getElementById("editName");
      if (editName) editName.value = u.name || "";
      
      // EVENT
      const eventSnap = await getDoc(doc(db, "events", eventId));
      if (!eventSnap.exists()) return;

      const e = eventSnap.data();

      document.getElementById("eventName").innerText = e.title;
      const dateEl = document.getElementById("eventDate");

      if (dateEl) {
        const formattedDate = e.date?.toDate
          ? e.date.toDate().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })
          : e.date;

        dateEl.innerText = formattedDate;
      }

      document.getElementById("eventLocation").innerText = e.location;
      document.getElementById("eventPrice").innerText = "₹" + e.price;
      document.getElementById("orderTotal").innerText = "₹" + 10;
      document.getElementById("totalAmount").innerText = "₹" +(e.price+10) ;
      document.getElementById("payableAmount").innerText ="₹" + (e.price + 10);

    });
  }
  

});
// Register Event
document.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("eventForm");

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value.trim();
      const category = document.getElementById("category").value.trim();
      const price = document.getElementById("price").value.trim();
      const location = document.getElementById("location").value.trim();

      if (!title || !category || !price || !location) {
        alert("All fields are required");
        return;
      }

      try {
        const user = auth.currentUser;

        if (!user) {
          alert("Please login first");
          window.location.href = "login.html";
          return;
        }

        await addDoc(collection(db, "events"), {
          title,
          category,
          price: Number(price),
          location,
          createdAt: serverTimestamp()
        });

        alert("Event Registered Successfully!");

      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }
});
/* ===============================
   SIGNUP FORM LOGIC WITH FIREBASE AUTH
================================ */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!name || !email || !password ) {
      alert("All fields are required");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 👤 Display name
      await updateProfile(cred.user, { displayName: name });
      // 📦 SAVE USER DATA (INCLUDING PHONE)
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        createdAt: serverTimestamp()
      });


      alert("Signup successful");
      window.location.href = "index.html";

    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    }
  });
}


/* ===============================
   LOGIN FORM LOGIC WITH FIREBASE AUTH
================================ */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Ensure Firestore user doc exists
      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);
      
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: cred.user.displayName || "",
          email: cred.user.email,
          createdAt: serverTimestamp()
        }, { merge: true });
      }
      
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("❌ Login failed: " + err.message);
    }
  });
}

// sidebar
const sidebar = document.getElementById("sidebarMenu");
if (sidebar) {
  sidebar.addEventListener("show.bs.offcanvas", () => {
    document.body.classList.add("sidebar-open");
  });

  sidebar.addEventListener("hidden.bs.offcanvas", () => {
    document.body.classList.remove("sidebar-open");
  });
}

/* ==========================
   PAY NOW BUTTON
========================== */
const payBtn = document.getElementById("payNowBtn");

if (payBtn) {
  payBtn.addEventListener("click", async () => {

    const selectedMethod =
      document.querySelector(".payment-table tr.active");

    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    try {

      // Get eventId from URL
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get("eventId");

      if (!eventId) {
        alert("Event not found");
        return;
      }

      // Fetch event details
      const eventSnap = await getDoc(doc(db, "events", eventId));
      if (!eventSnap.exists()) {
        alert("Event not found in database");
        return;
      }

      const eventData = eventSnap.data();

      // Generate Ticket ID
      const ticketId = "TKT" + Date.now();

      // 🔥 SAVE TO REGISTRATIONS COLLECTION
      await addDoc(collection(db, "registrations"), {
        userId: user.uid,
        userEmail: user.email,
        eventId: eventId,
        eventTitle: eventData.title,
        eventDate: eventData.date?.toDate
          ? eventData.date.toDate().toLocaleString("en-IN")
          : eventData.date,
        location: eventData.location,
        price: eventData.price,
        ticketId: ticketId,
        status: "Upcoming",
        createdAt: serverTimestamp()
      });

      alert("Payment Successful! Your ticket has been booked.");

      window.location.href = "registered_events.html";

    } catch (error) {
      console.error("Error saving registration:", error);
      alert("Something went wrong. Please try again.");
    }

  });
}