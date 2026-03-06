// ===== DOCTORS DATA =====

const doctors = [
{
name:"Dr. Youssef El Fassi",
specialty:"Médecin Généraliste",
location:"Casablanca",
slots:["10:00","14:30","16:00"]
},
{
name:"Dr. Salma Benkirane",
specialty:"Cardiologue",
location:"Rabat",
slots:["09:00","11:00","15:00"]
},
{
name:"Dr. Karim Lahlou",
specialty:"Dentiste",
location:"Marrakech",
slots:["08:30","10:30","14:00"]
},
{
name:"Dr. Amina Chraibi",
specialty:"Pédiatre",
location:"Fès",
slots:["09:30","11:30","16:30"]
}
];


// ===== SHOW DOCTORS =====

function showDoctors(){

const specialty = document.getElementById("specialty").value;
const grid = document.getElementById("doctors-grid");

grid.innerHTML="";

const filtered = doctors.filter(
d => !specialty || d.specialty===specialty
);

filtered.forEach(d=>{

const card = document.createElement("div");

card.className="doctor-card";

card.innerHTML=`
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
s=>`<span class="available-slot"
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

function filterDoctors(){
showDoctors();
}


// ===== BOOK =====

function bookAppointment(name,slot){

document.getElementById("confirmation-message").innerText =
`Votre rendez-vous avec ${name} à ${slot} est confirmé.`;

document.getElementById("confirmation-modal").style.display="flex";

}


// ===== CLOSE MODAL =====

function closeModal(){

document.getElementById("confirmation-modal").style.display="none";

}


// ===== EMERGENCY =====

function appelerUrgences(){
alert("Appel aux urgences... 150 (Maroc)");
}

function appelerPolice(){
alert("Appel à la police... 19 (Maroc)");
}

function appelerPompiers(){
alert("Appel aux pompiers... 15 (Maroc)");
}


// ===== CONTACT FORM =====

function sendContact(e){
e.preventDefault();
alert("Merci! Votre message a été envoyé.");
e.target.reset();
}