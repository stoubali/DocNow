// ===== GOOGLE SHEET CONFIG =====
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGU9_MXQyBQkWLNnQqxaDPZ156h88VxLDKkvE8c8rH7a14lZG05VRLTD8DXg0Or9fkUUArNNuTtloa/pub?output=csv";

// ===== GLOBAL DOCTORS ARRAY =====
let doctors = [];

// ===== FIXED CSV PARSER (IMPORTANT) =====
function parseCSVRow(row) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let char of row) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// ===== LOAD DOCTORS FROM GOOGLE SHEET =====
// ===== LOAD DOCTORS FROM GOOGLE SHEET =====
async function loadDoctorsFromSheet() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.text();

    const rows = data.split("\n").slice(1); // Skip header
    doctors = [];

    rows.forEach(row => {
      if (!row.trim()) return;

      const cols = parseCSVRow(row);
      
      // Extract data (Adjust column numbers if you changed your Sheet layout!)
      const name = cols[2]?.trim();
      const specialty = cols[3]?.trim();
      const location = cols[4]?.trim();
      const confirmation = cols[7]?.trim().toLowerCase(); // Convert to lowercase for easier checking
      const slotsRaw = cols[8];

      // IMPROVED CHECK: Only add if confirmation is exactly "true"
      if (confirmation === "true") {
        const slots = slotsRaw ? slotsRaw.split(";").map(s => s.trim()).filter(s => s !== "") : [];

        doctors.push({
          name: name,
          specialty: specialty,
          location: location,
          slots: slots
        });
      }
    });

    console.log("✅ Confirmed doctors loaded:", doctors);
    
    // Refresh the dropdown list based on the doctors we actually found
    populateSpecialties();

  } catch (error) {
    console.error("❌ Error loading doctors:", error);
  }
}

// ===== DYNAMICALLY FILL SPECIALTY DROPDOWN =====
function populateSpecialties() {
  const specialtySelect = document.getElementById("specialty");
  if (!specialtySelect) return;

  // 1. Get unique specialties from the 'doctors' array (which only contains 'TRUE' doctors)
  const uniqueSpecialties = [...new Set(doctors.map(d => d.specialty))].filter(Boolean).sort();

  // 2. Reset the dropdown but keep the "All" option
  specialtySelect.innerHTML = '<option value="">Toutes les spécialités</option>';

  // 3. Add the specialties that actually have doctors available
  uniqueSpecialties.forEach(spec => {
    const option = document.createElement("option");
    option.value = spec;
    option.textContent = spec;
    specialtySelect.appendChild(option);
  });
}

// Call this when the page loads so the data is ready immediately
window.addEventListener('DOMContentLoaded', loadDoctorsFromSheet);

// ===== SHOW DOCTORS =====
async function showDoctors() {

  if (doctors.length === 0) {
    await loadDoctorsFromSheet();
  }

  const specialty = document.getElementById("specialty").value;
  const grid = document.getElementById("doctors-grid");

  grid.innerHTML = "";

  const filtered = doctors.filter(
    d => !specialty || d.specialty === specialty
  );

  filtered.forEach(d => {

    const card = document.createElement("div");
    card.className = "doctor-card";

    card.innerHTML = `
      <div class="doctor-avatar">
        <i class="fas fa-user-md"></i>
      </div>

      <h4>${d.name}</h4>
      <p class="doctor-specialty">${d.specialty}</p>

      <p class="doctor-location">
        <i class="fas fa-map-marker-alt"></i> ${d.location}
      </p>

      <div class="doctor-availability">
        ${d.slots.map(
          s => `<span class="available-slot"
          onclick="bookAppointment('${d.name}','${s}')">${s}</span>`
        ).join("")}
      </div>
    `;

    grid.appendChild(card);
  });

  document.getElementById("doctors-list").style.display =
    filtered.length ? "block" : "none";
}

// ===== FILTER =====
function filterDoctors() {
  showDoctors();
}

// ===== BOOK APPOINTMENT =====
function bookAppointment(name, slot) {
  document.getElementById("confirmation-message").innerText =
    `Votre rendez-vous avec ${name} à ${slot} est confirmé.`;

  document.getElementById("confirmation-modal").style.display = "flex";
}

// ===== CLOSE MODAL =====
function closeModal() {
  document.getElementById("confirmation-modal").style.display = "none";
}

// ===== EMERGENCY =====
function appelerUrgences() {
  alert("Appel aux urgences... 150 (Maroc)");
}

function appelerPolice() {
  alert("Appel à la police... 19 (Maroc)");
}

function appelerPompiers() {
  alert("Appel aux pompiers... 15 (Maroc)");
}

// ===== CONTACT FORM =====
function sendContact(e) {
  e.preventDefault();
  alert("Merci ! Votre message a été envoyé.");
  e.target.reset();
}