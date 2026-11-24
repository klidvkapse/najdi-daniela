const MESSAGES_API_URL = "https://script.google.com/macros/s/AKfycbys7uP-yDkuPY0k_aGFawtPYuYU1uyb5UimvQs1JxU8Bgk-N7B-u472mU-VF4v2GEhRAQ/exec";
const DEFAULT_MISSION = {
  active: true,
  title: "Najdi dnešní kavárnu",
  city: "Šumperk a okolí",
  centerLat: 49.9653,
  centerLng: 16.9706,
  radiusKm: 2.5,
  publicClue: "Najdeš mě tam, kde se potkává příjemná atmosféra s vůní čerstvé kávy.",
  clues: [
    { title: "První stopa", text: "Hledej místo, kam se chodí zpomalit a na chvíli vypnout." },
    { title: "Druhá stopa", text: "Rozhlédni se po centru. Možná tě napoví výloha nebo vánoční výzdoba." }
  ],
  task: "Najdi na cestě něco, co ti připomene Vánoce.",
  rewardText: "Odměna 400 Kč je určena pouze účastníkům, kteří splní předem stanovené podmínky příslušné nabídky. Ostatní návštěvníci dostanou drobný reklamní dárek."
};

let mission = null;
let mapInstance = null;
let currentClue = 0;
let liveAnnouncements = [];
let liveAnnouncementsLoaded = false;

async function loadMission() {
  try {
    const response = await fetch("missions.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Mise není dostupná");
    mission = await response.json();
  } catch (error) {
    mission = DEFAULT_MISSION;
    document.getElementById("mission-status").textContent = "Ukázková mise – zatím není zveřejněna tvoje vlastní.";
  }
  renderMission();
}

function renderMission() {
  const status = document.getElementById("mission-status");
  const empty = document.getElementById("no-mission");
  const content = document.getElementById("mission-content");
  if (!mission || !mission.active) {
    renderAnnouncements();
    empty.classList.remove("hidden");
    content.classList.add("hidden");
    status.textContent = "Momentálně není aktivní žádná mise.";
    return;
  }
  empty.classList.add("hidden");
  content.classList.remove("hidden");
  document.getElementById("mission-city").textContent = mission.city || "Místo bude upřesněno";
  document.getElementById("clue-title").textContent = mission.title || "Kde dnes sedím?";
  document.getElementById("clue-text").textContent = mission.publicClue || "První indicie se právě připravuje.";
  document.getElementById("reward-text").textContent = mission.rewardText || DEFAULT_MISSION.rewardText;
  status.textContent = mission.subtitle || "Bez registrace. Jen pár indicií a příjemné setkání.";
  renderClues();
  renderMap();
  renderAnnouncements();
}

function renderAnnouncements() {
  const list = document.getElementById("announcement-list");
  if (!list) return;
  list.innerHTML = "";
  const legacyPosts = Array.isArray(mission?.announcements) ? mission.announcements : [];
  const posts = liveAnnouncementsLoaded ? liveAnnouncements.concat(legacyPosts) : legacyPosts;
  if (!posts.length) {
    const empty = document.createElement("p");
    empty.className = "announcement-empty";
    empty.textContent = "Zatím tu nejsou žádné nové zprávy.";
    list.appendChild(empty);
    return;
  }
  posts.forEach(post => {
    const card = document.createElement("article");
    card.className = "announcement-card";
    if (post.imageUrl) {
      try {
        const url = new URL(post.imageUrl);
        if (url.protocol === "https:" && (url.hostname === "ik.imagekit.io" || url.hostname === "drive.google.com")) {
          const img = document.createElement("img");
          img.src = url.href;
          img.alt = "Fotografie ke zprávě od Daniela";
          img.loading = "lazy";
          card.appendChild(img);
        }
      } catch (_) {}
    }
    if (post.message || post.text) {
      const text = document.createElement("p");
      text.textContent = post.message || post.text;
      card.appendChild(text);
    }
    list.appendChild(card);
  });
}


function loadLiveAnnouncements() {
  const callbackName = "__najdiMessages_" + Math.random().toString(36).slice(2);
  const script = document.createElement("script");
  let done = false;
  const cleanup = () => { if (done) return; done = true; try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; } script.remove(); };
  window[callbackName] = data => { if (data && data.success && Array.isArray(data.messages)) { liveAnnouncements = data.messages; liveAnnouncementsLoaded = true; renderAnnouncements(); } cleanup(); };
  script.onerror = cleanup;
  script.src = MESSAGES_API_URL + "?callback=" + callbackName + "&t=" + Date.now();
  document.head.appendChild(script);
  setTimeout(cleanup, 12000);
}

function renderClues() {
  const list = document.getElementById("clue-list");
  list.innerHTML = "";
  const clues = mission.clues || [];
  clues.forEach((clue, index) => {
    const item = document.createElement("div");
    item.className = "clue-item" + (index > currentClue ? " locked" : "");
    item.textContent = index > currentClue ? `🔒 ${index + 1}. indicie – zatím zamčeno` : `${index + 1}. ${clue.title}: ${clue.text}`;
    list.appendChild(item);
  });
  document.getElementById("clue-count").textContent = `${Math.min(currentClue + 1, clues.length || 1)}. stopa`;
  const task = document.getElementById("task-area");
  if (mission.task) {
    task.classList.remove("hidden");
    document.getElementById("task-text").textContent = mission.task;
  } else task.classList.add("hidden");
  const next = document.getElementById("next-clue");
  next.disabled = currentClue >= clues.length - 1 || (mission.task && !document.getElementById("task-check").checked);
  next.textContent = currentClue >= clues.length - 1 ? "Všechny indicie odhaleny" : "Zobrazit další indicii";
}

function renderMap() {
  if (!window.L || mapInstance) return;
  const lat = Number(mission.centerLat) || 49.9653;
  const lng = Number(mission.centerLng) || 16.9706;
  const radius = Math.max(500, Number(mission.radiusKm || 2) * 1000);
  mapInstance = L.map("map", { scrollWheelZoom: false }).setView([lat, lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapInstance);
  L.circle([lat, lng], { radius, color: "#b18b4a", fillColor: "#d8b56d", fillOpacity: .18, weight: 2 }).addTo(mapInstance);
  L.marker([lat, lng]).addTo(mapInstance).bindPopup("Oblast dnešního hledání");
  setTimeout(() => mapInstance.invalidateSize(), 250);
}

document.getElementById("next-clue").addEventListener("click", () => {
  if (currentClue < (mission.clues || []).length - 1) {
    currentClue++;
    renderClues();
  }
});
document.getElementById("task-check").addEventListener("change", renderClues);

loadMission();
loadLiveAnnouncements();
setInterval(loadLiveAnnouncements, 30000);
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
