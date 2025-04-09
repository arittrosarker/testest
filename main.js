// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCA8k3MG9FGgjLa4fkQ979G2hVQf9DNsYs",
  authDomain: "say-it-loud-8e48f.firebaseapp.com",
  databaseURL: "https://say-it-loud-8e48f-default-rtdb.firebaseio.com",
  projectId: "say-it-loud-8e48f",
  storageBucket: "say-it-loud-8e48f.firebasestorage.app",
  messagingSenderId: "677195341918",
  appId: "1:677195341918:web:ea837b45ccfc11f7f454cf",
  measurementId: "G-N6KB82D5GD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements for Firebase Verification
const checkbox = document.getElementById("verifyBox");
const counterEl = document.getElementById("counter");
const confirmation = document.getElementById("confirmation");

// Firebase counter reference
const counterRef = ref(db, "verifiedCount");

// Update counter in real time
onValue(counterRef, (snapshot) => {
  const count = snapshot.val() || 0;
  counterEl.textContent = `Verified Humans: ${count}`;
});

// Check if this browser already verified
const alreadyVerified = localStorage.getItem("palestine_verified");

if (alreadyVerified === "true") {
  checkbox.checked = true;
  checkbox.disabled = true;
  confirmation.style.display = "none"; // Hide confirmation if already verified
} else {
  confirmation.style.display = "none"; // Hide initially
}

// Checkbox change listener
checkbox.addEventListener("change", () => {
  if (checkbox.checked && alreadyVerified !== "true") {
    confirmation.style.display = "inline"; // Show confirmation on first tick
    checkbox.disabled = true;
    localStorage.setItem("palestine_verified", "true");

    // Safely increment the counter
    runTransaction(counterRef, (current) => {
      return (current || 0) + 1;
    });
  }
});

/* ---------------------------
   "Frame Your PFP" Feature
---------------------------- */

// DOM Elements for PFP Feature
const pfpToggleBtn = document.getElementById('openPFPModal');
const pfpModal = document.getElementById('pfpModal');
const pfpClose = document.getElementById('pfpClose');
const imageInput = document.getElementById('imageUpload');
const previewCanvas = document.getElementById('previewCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const ctx = previewCanvas.getContext('2d');

// Open the modal when the toggle button is clicked
pfpToggleBtn.addEventListener('click', () => {
  pfpModal.style.display = 'flex'; // Use 'flex' to center content
});

// Close the modal when the close button is clicked
pfpClose.addEventListener('click', () => {
  pfpModal.style.display = 'none';
});

// Optional: Close modal when clicking outside the modal content area
window.addEventListener('click', (event) => {
  if (event.target === pfpModal) {
    pfpModal.style.display = 'none';
  }
});

// Handle image upload & processing
imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // Calculate dimensions for a center-cropped square
        let size = Math.min(img.width, img.height);
        let sx = (img.width - size) / 2;
        let sy = (img.height - size) / 2;

        // Clear the canvas and draw the cropped image scaled to 1024x1024
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(img, sx, sy, size, size, 0, 0, previewCanvas.width, previewCanvas.height);

        // Overlay the prepared transparent frame (pfp.png)
        const frameImg = new Image();
        frameImg.src = 'pfp.png';
        frameImg.onload = function() {
          ctx.drawImage(frameImg, 0, 0, previewCanvas.width, previewCanvas.height);
          downloadBtn.disabled = false; // Enable download once ready
        };
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Download the final image when the button is clicked
downloadBtn.addEventListener('click', () => {
  const dataURL = previewCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'framed-pfp.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

window.copyEmail = function () {
  const email = "arittrosarker2007@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    const confirm = document.getElementById("copy-confirm");
    confirm.style.display = "inline";
    setTimeout(() => {
      confirm.style.display = "none";
    }, 2000);
  });
};
