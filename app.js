const CONVEX_URL = "https://brainy-bear-194.convex.cloud";
const FLASH_REFRESH_MS = 10 * 60 * 1000;

const pricePoints = [
  { code: "NO", names: ["Norway", "Norvegia"], value: 48.7, coords: [61.5, 10.5] },
  { code: "DK", names: ["Denmark", "Danimarca"], value: 76.1, coords: [56.1, 10.0] },
  { code: "DE", names: ["Germany", "Germania"], value: 129.9, coords: [51.1, 10.4] },
  { code: "FR", names: ["France", "Francia"], value: 101.7, coords: [46.4, 2.2] },
  { code: "ES", names: ["Spain", "Spagna"], value: 68.0, coords: [40.2, -3.7] },
  { code: "IT", names: ["Italy", "Italia"], value: 134.3, coords: [42.8, 12.5] },
  { code: "PL", names: ["Poland", "Polonia"], value: 117.3, coords: [52.0, 19.1] },
  { code: "RO", names: ["Romania"], value: 112.0, coords: [45.9, 24.9] },
  { code: "GR", names: ["Greece", "Grecia"], value: 100.5, coords: [39.0, 22.0] },
  { code: "NL", names: ["Netherlands", "Paesi Bassi"], value: 116.9, coords: [52.1, 5.3] },
];

const flashNews = [
  {
    topic: "Prezzi",
    title: "Germania sotto zero per 6 ore consecutive",
    url: "https://www.energy-charts.info/charts/price_average_map/chart.htm?l=it&c=EU",
  },
  {
    topic: "Policy",
    title: "UE rafforza reporting e trasparenza REMIT",
    url: "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en",
  },
  {
    topic: "Rete",
    title: "Interconnessioni sotto osservazione nel Baltico",
    url: "https://transparency.entsoe.eu/",
  },
  {
    topic: "LNG",
    title: "Domanda LNG in calo nel Nord-Ovest Europa",
    url: "https://www.spglobal.com/commodity-insights/en/news-research",
  },
];

const editorialPicks = [
  {
    title: "Le rinnovabili superano il carbone nella generazione elettrica globale",
    copy: "Il passaggio e simbolico e industriale insieme: solare ed eolico non sono piu laterali, ma centrali.",
    sources: "Carbon Brief · Ember",
    url: "https://www.carbonbrief.org/clean-energy-pushes-fossil-fuel-power-into-reverse-for-first-time-ever/",
  },
  {
    title: "Batterie: la flessibilita diventa il nuovo terreno competitivo",
    copy: "La competizione si sposta dalla pura generazione alla capacita di spostare energia nel tempo.",
    sources: "IEA · BloombergNEF",
    url: "https://www.iea.org/reports/global-energy-review-2026/technology-battery-storage",
  },
  {
    title: "Italia: il solare diventa prima fonte rinnovabile del mese",
    copy: "La crescita fotovoltaica rende piu urgente coordinare storage, domanda flessibile e reti.",
    sources: "Terna · pv magazine Italia",
    url: "https://www.pv-magazine.it/2026/04/21/a-marzo-prodotti-4-twh-di-elettricita-da-fotovoltaico-prima-fonte-rinnovabile-del-mese/",
  },
  {
    title: "REMIT: nuove regole UE su integrita e trasparenza",
    copy: "Piu reporting verso ACER e maggiore sorveglianza dei mercati energetici wholesale.",
    sources: "Commissione europea · ACER",
    url: "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en",
  },
];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function initEnergySavingMode() {
  const toggle = document.getElementById("energy-toggle");
  if (!toggle) return;

  const toggleCopy = toggle.querySelector(".toggle-copy");
  const savedPreference = localStorage.getItem("energyshift-energy-saving");
  const enabled = savedPreference === "on";

  function applyEnergySaving(isEnabled) {
    document.body.classList.toggle("energy-saving", isEnabled);
    toggle.setAttribute("aria-pressed", String(isEnabled));
    toggle.setAttribute(
      "aria-label",
      isEnabled ? "Disattiva risparmio energetico" : "Attiva risparmio energetico"
    );
    if (toggleCopy) {
      toggleCopy.textContent = isEnabled ? "Risparmio attivo" : "Risparmia energia";
    }
    localStorage.setItem("energyshift-energy-saving", isEnabled ? "on" : "off");
  }

  applyEnergySaving(enabled);
  toggle.addEventListener("click", () => {
    applyEnergySaving(!document.body.classList.contains("energy-saving"));
  });
}

function formatPrice(value) {
  return value.toFixed(1).replace(".", ",");
}

function priceColor(value) {
  if (value < 70) return "#e6f0ff";
  if (value < 95) return "#9dc4ff";
  if (value < 115) return "#4f8fea";
  if (value < 128) return "#0a5bd3";
  return "#052f73";
}

function getFeatureName(feature) {
  const props = feature.properties || {};
  return String(props.NAME || props.name || props.NAME_ENGL || props.ADMIN || props.sovereignt || "");
}

function findPricePoint(feature) {
  const featureName = getFeatureName(feature).toLowerCase();
  return pricePoints.find((point) => point.names.some((name) => featureName.includes(name.toLowerCase())));
}

function renderPointLabels(map) {
  pricePoints.forEach((point) => {
    L.marker(point.coords, {
      interactive: false,
      icon: L.divIcon({
        className: "country-price-label",
        html: `<span>${point.code}</span><strong>${formatPrice(point.value)}</strong>`,
        iconSize: [58, 38],
        iconAnchor: [29, 19],
      }),
    }).addTo(map);
  });
}

function renderFallbackMarkers(map) {
  pricePoints.forEach((point) => {
    L.circleMarker(point.coords, {
      radius: 18,
      color: "#ffffff",
      weight: 3,
      fillColor: priceColor(point.value),
      fillOpacity: 0.94,
      interactive: false,
    }).addTo(map);
  });
  renderPointLabels(map);
}

function fitPriceMap(map) {
  const bounds = L.latLngBounds(pricePoints.map((point) => point.coords));
  map.fitBounds(bounds, { padding: [52, 52], maxZoom: 4 });
  map.setMaxBounds([[34, -13], [65.5, 31]]);
}

async function initPriceMap() {
  const element = document.getElementById("price-map");
  if (!element || typeof L === "undefined") return;

  const map = L.map(element, {
    zoomControl: true,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    boxZoom: false,
    keyboard: true,
    tap: true,
    minZoom: 3,
    maxZoom: 7,
  }).setView([49.5, 10.5], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    maxZoom: 7,
  }).addTo(map);

  try {
    const response = await fetch("https://cdn.jsdelivr.net/gh/leakyMirror/map-of-europe@master/GeoJSON/europe.geojson");
    if (!response.ok) throw new Error("GeoJSON non disponibile");
    const geojson = await response.json();

    L.geoJSON(geojson, {
      style: (feature) => {
        const point = findPricePoint(feature);
        return {
          color: point ? "#ffffff" : "#d9e4f3",
          weight: point ? 1.6 : 0.8,
          fillColor: point ? priceColor(point.value) : "#f4f8fd",
          fillOpacity: point ? 0.88 : 0.44,
        };
      },
      interactive: false,
    }).addTo(map);

    renderPointLabels(map);
  } catch (error) {
    renderFallbackMarkers(map);
  }

  fitPriceMap(map);
  setTimeout(() => map.invalidateSize(), 80);
}

function normalizeFlashItem(item) {
  return {
    topic: item.topic || "News",
    title: item.title || "Notizia flash",
    url: item.url,
  };
}

async function fetchConvexFlashNews() {
  const response = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "news:listFlashNews",
      args: { limit: 6 },
      format: "json",
    }),
  });

  if (!response.ok) throw new Error("Convex non disponibile");
  const payload = await response.json();
  if (payload.status !== "success") throw new Error(payload.errorMessage || "Query Convex fallita");
  return payload.value.map(normalizeFlashItem);
}

function renderFlash(items = flashNews) {
  const list = document.getElementById("flash-list");
  if (!list) return;

  list.innerHTML = items.map((rawItem) => {
    const item = normalizeFlashItem(rawItem);
    const body = `<span class="flash-topic">${escapeHtml(item.topic)}</span><div><p class="item-title">${escapeHtml(item.title)}</p></div>`;

    if (item.url) {
      return `<a class="flash-item news-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${body}<span class="open-mark">↗</span></a>`;
    }

    return `<article class="flash-item">${body}</article>`;
  }).join("");
}

async function refreshFlashNews() {
  try {
    const liveFlashNews = await fetchConvexFlashNews();
    if (liveFlashNews.length > 0) renderFlash(liveFlashNews);
  } catch (error) {
    renderFlash(flashNews);
  }
}

function initFlashNews() {
  renderFlash(flashNews);
  refreshFlashNews();
  setInterval(refreshFlashNews, FLASH_REFRESH_MS);
}

function renderEditorial() {
  document.getElementById("editorial-list").innerHTML = editorialPicks.map((item) => `
    <a class="editorial-item news-link" href="${item.url}" target="_blank" rel="noopener noreferrer"><p class="item-title">${item.title}</p><p class="item-copy">${item.copy}</p><p class="meta">${item.sources}</p></a>
  `).join("");
}

initEnergySavingMode();
initPriceMap();
initFlashNews();
renderEditorial();
