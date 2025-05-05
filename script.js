// Motorräder aus LocalStorage laden oder leere Liste erstellen
let motorcycles = JSON.parse(localStorage.getItem("motorcycles")) || [];

// Daten in LocalStorage speichern
function saveData() {
  localStorage.setItem("motorcycles", JSON.stringify(motorcycles));
}

// Neues  	Motorrad hinzufügen
function addMotorcycle() {
  const modelInput = document.getElementById("model");
  const markeInput = document.getElementById("marke");
  const baujahrInput = document.getElementById("baujahr");

  const model = modelInput.value.trim();
  const marke = markeInput.value.trim();
  const baujahr = baujahrInput.value.trim();

  if (model === "" || marke === "" || baujahr === "") {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  const newBike = {
    id: Date.now(),
    model,
    marke,
    baujahr,
    wartung: [] // Nur Wartungen haben später Kilometer
  };

  motorcycles.push(newBike);
  saveData();
  renderList();

  modelInput.value = "";
  markeInput.value = "";
  baujahrInput.value = "";
}


// Wartung zu einem Motorrad hinzufügen
function addWartung(id) {
  const datum = prompt("Datum der Wartung eingeben (z.B. 2025-04-01):");
  const eintrag = prompt("Was wurde gemacht?");
  const kilometer = prompt("Kilometerstand bei Wartung:");

  if (!datum || !eintrag || !kilometer) {
    alert("Bitte Datum, Eintrag und Kilometer angeben!");
    return;
  }

  const bike = motorcycles.find(b => b.id === id);
  if (bike) {
    bike.wartung.push({ datum, eintrag, kilometer });
    saveData();
    renderList();
  }
}


// Motorrad löschen
function deleteMotorcycle(id) {
  if (confirm("Willst du dieses Motorrad wirklich löschen?")) {
    motorcycles = motorcycles.filter(bike => bike.id !== id);
    saveData();
    renderList();
  }
}

// Motorräder und Wartungen auf der Seite anzeigen
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  motorcycles.forEach(bike => {
    const div = document.createElement("div");
    div.className = "motorcycle";

    // Sortierte Wartungen
    const sortedWartungen = [...bike.wartung].sort((a, b) => b.kilometer - a.kilometer);

    div.innerHTML = `
      <h3>${bike.marke} ${bike.model} (${bike.baujahr})</h3>
      <div class="button-group">
        <button onclick="addWartung(${bike.id})">➕ Wartung hinzufügen</button>
        <button onclick="deleteMotorcycle(${bike.id})">🗑️ Motorrad löschen</button>
      </div>
      <ul class="wartung-list">
        ${sortedWartungen.map((w, index) => `
          <li class="wartung-item">
            <span>${w.datum}: ${w.eintrag} (${w.kilometer} km)</span>
            <div class="wartung-buttons">
              <button onclick="editWartung(${bike.id}, ${bike.wartung.indexOf(w)})">✏️</button>
              <button onclick="deleteWartung(${bike.id}, ${bike.wartung.indexOf(w)})">🗑️</button>
            </div>
          </li>
        `).join("")}
      </ul>
    `;
    list.appendChild(div);
  });
}




// Beim Laden der Seite Motorräder anzeigen
renderList();

// EventListener für den "Hinzufügen"-Button
document.getElementById('addBtn').addEventListener('click', addMotorcycle);

function deleteWartung(bikeId, wartungIndex) {
  const bike = motorcycles.find(b => b.id === bikeId);
  if (bike) {
    if (confirm("Willst du diesen Wartungseintrag wirklich löschen?")) {
      bike.wartung.splice(wartungIndex, 1);
      saveData();
      renderList();
    }
  }
}

function editWartung(bikeId, wartungIndex) {
  const bike = motorcycles.find(b => b.id === bikeId);
  if (bike) {
    const neuerDatum = prompt("Neues Datum eingeben:", bike.wartung[wartungIndex].datum);
    const neuerEintrag = prompt("Neuen Eintrag eingeben:", bike.wartung[wartungIndex].eintrag);
    const neuerKilometer = prompt("Neuer Kilometerstand:", bike.wartung[wartungIndex].kilometer);

    if (neuerDatum && neuerEintrag && neuerKilometer) {
      bike.wartung[wartungIndex] = { datum: neuerDatum, eintrag: neuerEintrag, kilometer: neuerKilometer };
      saveData();
      renderList();
    }
  }
}


