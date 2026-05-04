const pricePoints = [
  { code: "NO", name: "Nordici", value: 48.7, coords: [61.5, 10.5] },
  { code: "DK", name: "Danimarca", value: 76.1, coords: [56.1, 10.0] },
  { code: "DE", name: "Germania", value: 129.9, coords: [51.1, 10.4] },
  { code: "FR", name: "Francia", value: 101.7, coords: [46.4, 2.2] },
  { code: "ES", name: "Spagna", value: 68.0, coords: [40.2, -3.7] },
  { code: "IT", name: "Italia", value: 134.3, coords: [42.8, 12.5] },
  { code: "PL", name: "Polonia", value: 117.3, coords: [52.0, 19.1] },
  { code: "RO", name: "Romania", value: 112.0, coords: [45.9, 24.9] },
  { code: "GR", name: "Grecia", value: 100.5, coords: [39.0, 22.0] },
  { code: "NL", name: "Paesi Bassi", value: 116.9, coords: [52.1, 5.3] },
];

const flashNews = [
  {
    topic: "Prezzi",
    title: "Germania sotto zero per 6 ore consecutive",
    source: "Energy Charts",
    implication: "Segnale favorevole per batterie e demand response.",
    url: "https://www.energy-charts.info/charts/price_average_map/chart.htm?l=it&c=EU",
  },
  {
    topic: "Policy",
    title: "UE rafforza reporting e trasparenza REMIT",
    source: "Commissione europea",
    implication: "Nuovi obblighi dati per mercati wholesale.",
    url: "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en",
  },
  {
    topic: "Rete",
    title: "Interconnessioni sotto osservazione nel Baltico",
    source: "ENTSO-E",
    implication: "Possibile aumento degli spread serali.",
    url: "https://transparency.entsoe.eu/",
  },
  {
    topic: "LNG",
    title: "Domanda LNG in calo nel Nord-Ovest Europa",
    source: "S&P Global Energy",
    implication: "Pressione su TTF e gas-to-power.",
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

function formatPrice(value) {
  return value.toFixed(1).replace(".", ",");
}

function priceColor(value) {
  if (value < 70) return "#063f99";
  if (value < 95) return "#0a5bd3";
  if (value < 115) return "#4f8fea";
  if (value < 128) return "#9dc4ff";
  return "#052f73";
}

function initPriceMap() {
  const element = document.getElementById("price-map");
  if (!element || typeof L === "undefined") return;

  const map = L.map(element, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
  }).setView([51.2, 11.5], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    maxZoom: 7,
  }).addTo(map);

  pricePoints.forEach((point) => {
    const marker = L.circleMarker(point.coords, {
      radius: 18,
      color: "#ffffff",
      weight: 3,
      fillColor: priceColor(point.value),
      fillOpacity: 0.94,
      interactive: false,
    }).addTo(map);

    marker.bindTooltip(`${point.code} ${formatPrice(point.value)}`, {
      permanent: true,
      direction: "center",
      className: "price-label",
      opacity: 1,
    });
  });
}

function renderFlash() {
  document.getElementById("flash-list").innerHTML = flashNews.map((item) => `
    <a class="flash-item news-link" href="${item.url}" target="_blank" rel="noopener noreferrer"><span class="flash-topic">${item.topic}</span><div><p class="item-title">${item.title}</p><p class="item-copy">${item.implication}</p><p class="meta">${item.source}</p></div><span class="open-mark">↗</span></a>
  `).join("");
}

function renderEditorial() {
  document.getElementById("editorial-list").innerHTML = editorialPicks.map((item) => `
    <a class="editorial-item news-link" href="${item.url}" target="_blank" rel="noopener noreferrer"><p class="item-title">${item.title}</p><p class="item-copy">${item.copy}</p><p class="meta">${item.sources}</p></a>
  `).join("");
}

initPriceMap();
renderFlash();
renderEditorial();
