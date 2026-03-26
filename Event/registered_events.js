import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

let upcomingCount = 0;
let cancelledCount = 0;
let completedCount = 0;
const upcomingList = document.getElementById("upcomingEventsList");
const cancelledList = document.getElementById("cancelledEventsList");
const completedList = document.getElementById("completedEventsList");


onAuthStateChanged(auth, async (user) => {

  if (!user) {
    upcomingList.innerHTML = `
      <div class="text-center mt-5">
        <h3>Please login to view your tickets</h3>
      </div>
    `;
    cancelledList.innerHTML = `
      <div class="text-center mt-5">
        <h3>Please login to view your tickets</h3>
      </div>
    `;
    completedList.innerHTML = `
      <div class="text-center mt-5">
        <h3>Please login to view your tickets</h3>
      </div>
    `;
    return;
  }

  try {

    const q = query(
      collection(db, "registrations"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      upcomingList.innerHTML = `
        <div class="text-center mt-5">
          <h4>You haven't registered for any events yet.</h4>
        </div>
      `;
      return;
    }
    upcomingCount = 0;
    cancelledCount = 0;
    completedCount = 0;
    upcomingList.innerHTML = "";
    cancelledList.innerHTML = "";
    completedList.innerHTML = "";
    snapshot.forEach(docSnap => {

      const data = docSnap.data();
      const docId = docSnap.id;
      const cardId = "qr-" + docId;
    
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // remove time
      
      let badgeClass = "bg-secondary";
      let finalStatus = data.status;
      
      if (data.status === "Cancelled") {
      
        finalStatus = "Cancelled";
        badgeClass = "bg-danger";
        cancelledCount++;
      
      } else {
        // Remove time part first
        const datePart = data.eventDate.split(",")[0].trim(); // "10/2/2026"

        // Split DD/MM/YYYY
        const parts = datePart.split("/");

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-based
        const year = parseInt(parts[2]);

        const eventDateObj = new Date(year, month, day);
        eventDateObj.setHours(0, 0, 0, 0);

      
        if (eventDateObj < today) {
      
          finalStatus = "Completed";
          badgeClass = "bg-primary";
          completedCount++;
      
        } else {
      
          finalStatus = "Upcoming";
          badgeClass = "bg-success";
          upcomingCount++;
        }
      }
      
      /* ===============================
         🎟 CARD HTML
      ================================ */
    
      const cardHTML = `
        <div class="col-md-4 mb-4">
          <div class="card p-3 fw-bold shadow-sm">
            <h4>${data.eventTitle}</h4>
            <p>Date: ${data.eventDate}</p>
            <p>Location: ${data.location}</p>
            <p>Price: ₹${data.price}</p>
            <p>Username: ${auth.currentUser ? auth.currentUser.displayName : "N/A"}</p>
            <p>Ticket ID: ${data.ticketId}</p>
    
            <p>
              Status:
              <span class="badge ${badgeClass} px-3 py-2">
                ${finalStatus}
              </span>
            </p>
    
            <div id="${cardId}" class="mb-3"></div>
    
            <div class="d-flex justify-content-between">
    
              ${
                finalStatus === "Upcoming"
                  ? `<button class="btn btn-danger btn-sm"
                        onclick="cancelRegistration('${docId}')">
                        Cancel
                     </button>`
                  : `<div></div>`
              }
    
              <button class="btn btn-sm text-white fw-bold" style="background:#c489ec ;"
                onclick="downloadTicket('${data.ticketId}', '${data.eventTitle}', '${data.eventDate}')">
                Download Ticket
              </button>
    
            </div>
          </div>
        </div>
      `;
    
      /* ===============================
         📂 SECTION SEPARATION
      ================================ */
    
      if (finalStatus === "Cancelled") {
        cancelledList.innerHTML += cardHTML;
      }
    
      else if (finalStatus === "Completed") {
        completedList.innerHTML += cardHTML;
      }
    
      else {
        upcomingList.innerHTML += cardHTML;
      }
    
      /* ===============================
         🔳 QR GENERATION
      ================================ */
    
      setTimeout(() => {
        const qrContainer = document.getElementById(cardId);
        if (qrContainer) {
          new QRCode(qrContainer, {
            text: data.ticketId,
            width: 100,
            height: 100
          });
        }
      }, 100);
    
    });
    
    document.getElementById("upcomingCount").innerText = upcomingCount;
    document.getElementById("cancelledCount").innerText = cancelledCount;
    document.getElementById("completedCount").innerText = completedCount;

  } catch (error) {
    console.error("Error fetching registrations:", error);
  }

});
window.printAllTickets = () => {
  if(auth.currentUser) {
    alert("Printing all tickets for " + auth.currentUser.displayName);
  } else {
    alert("Please login to print your tickets.");
  }
};


/* ===============================
   CANCEL FUNCTION
================================ */
window.cancelRegistration = async (docId) => {

  const confirmCancel = confirm("Are you sure you want to cancel this ticket?");
  if (!confirmCancel) return;

  try {

    await updateDoc(doc(db, "registrations", docId), {
      status: "Cancelled"
    });

    alert("Ticket cancelled successfully");

    location.reload();

  } catch (error) {
    console.error("Cancel error:", error);
  }
};


/* ===============================
   DOWNLOAD FUNCTION
================================ */

window.downloadTicket = (ticketId, eventTitle, eventDate) => {
  // Clean file name (remove special chars)
  const fileName = eventTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  
  // Ticket content
  const content = `
===== EVENT TICKET =====

Event: ${eventTitle}
Date: ${eventDate}
Userame: ${auth.currentUser ? auth.currentUser.displayName : "N/A"}
Date of Issue: ${new Date().toLocaleDateString()}

========================
`;

  // Create file
  const blob = new Blob([content], { type: "text/plain" });

  // Create download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}_ticket.txt`;

  // Trigger download
  link.click();

};