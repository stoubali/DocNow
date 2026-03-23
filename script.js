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
async function loadDoctorsFromSheet() {
  try {
    const res = await fetch(SHEET_URL);
    const data = await res.text();

    const rows = data.split("\n").slice(1); // skip header
    doctors = [];

    rows.forEach(row => {
      if (!row.trim()) return; // skip empty rows

      const cols = parseCSVRow(row);

      const name = cols[2];          // Nom du médecin
      const specialty = cols[3];     // Spécialité
      const location = cols[4];      // Ville
      const confirmation = cols[7];  // Confirmation
      const slotsRaw = cols[8];      // Slots Clean

      // ONLY approved doctors
      if (confirmation && confirmation.trim().toUpperCase() === "TRUE") {

        const slots = slotsRaw
          ? slotsRaw.split(";").map(s => s.trim())
          : [];

        doctors.push({
          name: name?.trim(),
          specialty: specialty?.trim(),
          location: location?.trim(),
          slots
        });
      }
    });

    console.log("✅ Doctors loaded:", doctors);

  } catch (error) {
    console.error("❌ Error loading doctors:", error);
  }
}

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