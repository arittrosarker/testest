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
}

// Checkbox change listener
checkbox.addEventListener("change", () => {
  if (checkbox.checked && alreadyVerified !== "true") {
    checkbox.disabled = true;
    localStorage.setItem("palestine_verified", "true");

    // Add confirmation message
    const confirmation = document.createElement('div');
    confirmation.textContent = 'Thank you for standing with Palestine!';
    confirmation.style.color = 'darkgreen';
    confirmation.style.marginTop = '10px';
    confirmation.style.fontSize = '0.9em';
    checkbox.parentElement.appendChild(confirmation);

    // Safely increment the counter
    runTransaction(counterRef, (current) => {
      return (current || 0) + 1;
    });
  }
});

// Randomize and Populate Art Slider
const artTrack = document.getElementById('artTrack');
const imageCount = 16; // Total unique images

// Function to shuffle array (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate a shuffled array of image indices (1 to 16)
const imageIndices = shuffleArray([...Array(imageCount).keys()].map(i => i + 1));

// Populate the art-track with shuffled images (duplicated for infinite loop)
imageIndices.forEach(index => {
  const img = document.createElement('img');
  img.src = `art/${index}.jpg`;
  img.alt = `Protest Art ${index}`;
  img.loading = 'lazy';
  artTrack.appendChild(img);
});
// Duplicate the shuffled set for infinite loop
imageIndices.forEach(index => {
  const img = document.createElement('img');
  img.src = `art/${index}.jpg`;
  img.alt = `Protest Art ${index}`;
  img.loading = 'lazy';
  artTrack.appendChild(img);
});

// PFP Modal Functionality
const pfpToggleBtn = document.getElementById('openPFPModal');
const pfpModal = document.getElementById('pfpModal');
const pfpClose = document.getElementById('pfpClose');
const imageInput = document.getElementById('imageUpload');
const previewCanvas = document.getElementById('previewCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const ctx = previewCanvas.getContext('2d');

// Open the modal
pfpToggleBtn.addEventListener('click', () => {
  pfpModal.style.display = 'block';
});

// Close the modal
pfpClose.addEventListener('click', () => {
  pfpModal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
  if (event.target === pfpModal) {
    pfpModal.style.display = 'none';
  }
});

// Handle image upload & processing
imageInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (e.g., PNG, JPEG).');
      imageInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // Set responsive canvas size
        const canvasSize = Math.min(window.innerWidth * 0.8, 512);
        previewCanvas.width = canvasSize;
        previewCanvas.height = canvasSize;

        let size = Math.min(img.width, img.height);
        let sx = (img.width - size) / 2;
        let sy = (img.height - size) / 2;

        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        ctx.drawImage(img, sx, sy, size, size, 0, 0, previewCanvas.width, previewCanvas.height);

        const frameImg = new Image();
        frameImg.src = 'pfp.png';
        downloadBtn.textContent = 'Loading frame...';
        frameImg.onload = function() {
          ctx.drawImage(frameImg, 0, 0, previewCanvas.width, previewCanvas.height);
          downloadBtn.disabled = false;
          downloadBtn.textContent = 'Download Framed PFP';
        };
        frameImg.onerror = function() {
          alert('Failed to load the frame image. Please try again later.');
          downloadBtn.textContent = 'Download Framed PFP';
        };
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Download the framed PFP
downloadBtn.addEventListener('click', () => {
  const dataURL = previewCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'framed-pfp.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Copy email function
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