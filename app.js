const heroTags = ["Mercati", "Storage", "Rete"];

const implications = [
  ["Mercati", "Spread regionali in aumento"],
  ["Storage", "Valore maggiore nelle ore centrali"],
  ["Rete", "Congestioni e interconnessioni decisive"],
];

const mapZones = [
  ["Nordics", "Nordici", 48.7, "low", "M210 52 L250 82 L242 132 L204 152 L172 126 L180 78 Z", 218, 105],
  ["GB", "UK", 116.9, "mid", "M72 170 L118 150 L142 190 L112 230 L68 215 Z", 103, 190],
  ["FR", "FR", 101.7, "midlow", "M156 238 L220 224 L256 270 L228 334 L156 326 L126 282 Z", 190, 282],
  ["DE", "DE", 129.9, "high", "M238 192 L286 184 L314 230 L296 282 L244 278 L218 228 Z", 266, 236],
  ["ES", "ES", 68.0, "low", "M92 330 L170 324 L190 378 L134 402 L74 376 Z", 132, 365],
  ["IT", "IT", 134.3, "highest", "M298 298 L334 314 L354 374 L338 404 L306 350 L282 326 Z", 322, 350],
  ["PL", "PL", 117.3, "midhigh", "M312 198 L370 206 L386 258 L334 284 L298 250 Z", 342, 240],
  ["BAL", "Baltici", 93.6, "midlow", "M350 122 L392 130 L402 184 L360 186 L338 154 Z", 370, 158],
  ["RO", "RO", 112.0, "midhigh", "M366 296 L428 300 L450 340 L404 366 L352 336 Z", 402, 330],
  ["GR", "GR", 100.5, "midlow", "M368 370 L424 370 L438 410 L386 416 Z", 404, 394],
  ["CH", "CH", 124.8, "high", "M244 286 L286 282 L302 310 L260 326 L232 306 Z", 266, 304],
];

const flashNews = [
  { topic: "Prezzi", title: "Germania sotto zero per 6 ore consecutive", source: "Energy Charts", implication: "Segnale favorevole per batterie e demand response.", score: 96 },
  { topic: "Policy", title: "UE rafforza reporting e trasparenza REMIT", source: "Commissione europea", implication: "Nuovi obblighi dati per mercati wholesale.", score: 91 },
  { topic: "Rete", title: "Interconnessioni sotto osservazione nel Baltico", source: "ENTSO-E", implication: "Possibile aumento degli spread serali.", score: 84 },
  { topic: "LNG", title: "Domanda LNG in calo nel Nord-Ovest Europa", source: "S&P Global Energy", implication: "Pressione su TTF e gas-to-power.", score: 79 },
];

const editorialPicks = [
  { title: "Le rinnovabili superano il carbone nella generazione elettrica globale", copy: "Il passaggio e simbolico e industriale insieme: solare ed eolico non sono piu laterali, ma centrali.", sources: "Carbon Brief · Ember" },
  { title: "Batterie: la flessibilita diventa il nuovo terreno competitivo", copy: "La competizione si sposta dalla pura generazione alla capacita di spostare energia nel tempo.", sources: "IEA · BloombergNEF" },
  { title: "Italia: il solare diventa prima fonte rinnovabile del mese", copy: "La crescita fotovoltaica rende piu urgente coordinare storage, domanda flessibile e reti.", sources: "Terna · pv magazine Italia" },
  { title: "REMIT: nuove regole UE su integrita e trasparenza", copy: "Piu reporting verso ACER e maggiore sorveglianza dei mercati energetici wholesale.", sources: "Commissione europea · ACER" },
];

function renderTags() {
  document.getElementById("hero-tags").innerHTML = heroTags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderImplications() {
  document.getElementById("implications").innerHTML = implications.map(([title, copy]) => `
    <div class="impact-pill"><strong>${title}</strong><span>${copy}</span></div>
  `).join("");
}

function renderPriceMap() {
  document.getElementById("price-map").innerHTML = mapZones.map(([id, label, value, level, path, x, y]) => `
    <g class="map-zone zone-${level}">
      <path d="${path}" />
      <text x="${x}" y="${y}">${String(value).replace(".", ",")}</text>
      <text class="zone-label" x="${x}" y="${y + 18}">${label}</text>
    </g>
  `).join("");
}

function renderFlash() {
  document.getElementById("flash-list").innerHTML = flashNews.map((item) => `
    <article class="flash-item"><span class="flash-topic">${item.topic}</span><div><p class="item-title">${item.title}</p><p class="item-copy">${item.implication}</p><p class="meta">${item.source}</p></div><span class="relevance">${item.score}</span></article>
  `).join("");
}

function renderEditorial() {
  document.getElementById("editorial-list").innerHTML = editorialPicks.map((item) => `
    <article class="editorial-item"><p class="item-title">${item.title}</p><p class="item-copy">${item.copy}</p><p class="meta">${item.sources}</p></article>
  `).join("");
}

renderTags();
renderImplications();
renderPriceMap();
renderFlash();
renderEditorial();
