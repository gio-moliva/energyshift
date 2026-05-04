const heroTags = ["Mercati", "Policy", "Storage"];

const implications = [
  ["↗", "Mercati", "Prezzi negativi e spread regionali evidenziano il valore della flessibilita."],
  ["⚖", "Policy", "Regole UE e market design spostano attenzione su storage e trasparenza."],
  ["⌁", "Infrastrutture", "Interconnessioni e congestioni diventano decisive per catturare valore."],
  ["▥", "Aziende", "Utilities, IPP e corporate buyer rivedono PPAs, batterie e strategie merchant."],
];

const sources = [
  ["EC", "Energy market integrity and transparency rules", "Commissione europea", "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en"],
  ["EN", "ENTSO-E Transparency Platform", "ENTSO-E", "https://transparency.entsoe.eu/"],
  ["RN", "Renewables and storage market news", "Renewables Now", "https://renewablesnow.com/"],
  ["SP", "Gas, LNG and power market research", "S&P Global Energy", "https://www.spglobal.com/commodity-insights/en/news-research"],
  ["EG", "German grid and energy regulation", "Bundesnetzagentur", "https://www.bundesnetzagentur.de/"],
];

const prices = [
  ["🇩🇪", "DE", -12, -38, "down", [23, 20, 18, 17, 14, 8, 12, 19, 5, 7]],
  ["🇫🇷", "FR", 18, 4, "up", [22, 18, 25, 19, 26, 21, 20, 17, 16, 14]],
  ["🇮🇹", "IT", 92, 12, "up", [72, 91, 84, 55, 49, 45, 42, 38, 43, 61]],
  ["🇪🇸", "ES", 34, -6, "down", [42, 36, 45, 28, 31, 24, 29, 26, 39, 35]],
  ["🇳🇱", "NL", 5, -11, "down", [22, 17, 10, 4, 2, 0, 5, 12, 9, 6]],
  ["🇵🇱", "PL", 76, 9, "up", [83, 75, 68, 63, 66, 54, 51, 59, 74, 72]],
];

const flashNews = [
  { topic: "Prezzi", title: "Germania sotto zero per 6 ore consecutive", source: "Energy Charts · feed prezzi", time: "11 min fa", implication: "Segnale favorevole per batterie e demand response.", score: 96 },
  { topic: "Policy", title: "UE rafforza trasparenza e reporting REMIT", source: "Commissione europea", time: "42 min fa", implication: "Maggiore sorveglianza dei mercati wholesale e nuovi obblighi dati.", score: 91 },
  { topic: "Rete", title: "Interconnessioni sotto osservazione nel Baltico", source: "ENTSO-E", time: "1 h fa", implication: "Rischio spread locali nelle ore serali e maggiore valore per flessibilita.", score: 84 },
  { topic: "LNG", title: "Domanda LNG in calo nel Nord-Ovest Europa", source: "S&P Global Energy", time: "2 h fa", implication: "Pressione ribassista su TTF e gas-to-power.", score: 79 },
];

const editorialPicks = [
  { title: "Le rinnovabili superano il carbone nella generazione elettrica globale", copy: "Perche conta: il passaggio e simbolico e industriale insieme. Il sistema elettrico entra in una fase in cui solare ed eolico non sono piu laterali, ma centrali.", sources: "Carbon Brief · Ember" },
  { title: "Batterie: la flessibilita diventa il nuovo terreno competitivo", copy: "La competizione si sposta dalla pura generazione alla capacita di spostare energia nel tempo, catturando spread e servizi di rete.", sources: "IEA · BloombergNEF" },
  { title: "Italia: il solare diventa prima fonte rinnovabile del mese", copy: "La crescita fotovoltaica rende piu urgente coordinare storage, domanda flessibile e reti per evitare che il valore si perda nelle ore centrali.", sources: "Terna · pv magazine Italia" },
];

const signals = [
  ["▤", "Storage: aste e capacity market entrano nel radar investitori", "La flessibilita diventa infrastruttura economica, non solo tecnologia di supporto."],
  ["⌁", "LNG: sicurezza energetica ancora centrale", "Gas e rinnovabili vanno letti insieme: rischio geopolitico e resilienza del sistema."],
  ["□", "PPAs: ritorno alla disciplina di prezzo", "Buyer industriali piu selettivi, ma contratti long-term ancora chiave per bancabilita."],
];

function renderTags() {
  document.getElementById("hero-tags").innerHTML = heroTags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderImplications() {
  document.getElementById("implications").innerHTML = implications.map(([icon, title, copy]) => `
    <div class="implication"><span class="icon-tile">${icon}</span><div><p class="item-title">${title}</p><p class="item-copy">${copy}</p></div></div>
  `).join("");
}

function renderSources() {
  document.getElementById("sources").innerHTML = sources.map(([icon, title, meta, url]) => `
    <a class="source-item source-link" href="${url}" target="_blank" rel="noopener noreferrer"><span class="icon-tile">${icon}</span><div><p class="item-title">${title}</p><p class="meta">${meta}</p></div><span>↗</span></a>
  `).join("");
}

function sparkline(points) {
  const width = 180;
  const height = 38;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points.map((point, index) => {
    const x = index * step;
    const y = height - ((point - min) / range) * (height - 8) - 4;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return `<svg class="spark" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#0A5BD3" stroke-width="3" stroke-linecap="round"/></svg>`;
}

function renderPrices() {
  document.getElementById("price-grid").innerHTML = prices.map(([flag, code, value, delta, trend, points]) => `
    <article class="price-card"><div class="country"><span class="flag">${flag}</span>${code}</div><div class="price ${value < 0 ? "negative" : ""}">${value}</div>${sparkline(points)}<div class="delta ${trend}">${delta > 0 ? "+" : ""}${delta} ${trend === "up" ? "↑" : "↓"} <span>vs ieri</span></div></article>
  `).join("");
}

function renderFlash() {
  document.getElementById("flash-list").innerHTML = flashNews.map((item) => `
    <article class="flash-item"><span class="flash-topic">${item.topic}</span><div><p class="item-title">${item.title}</p><p class="item-copy">${item.implication}</p><p class="meta">${item.source} · ${item.time}</p></div><span class="relevance">${item.score}</span></article>
  `).join("");
}

function renderEditorial() {
  document.getElementById("editorial-list").innerHTML = editorialPicks.map((item) => `
    <article class="editorial-item"><div class="editorial-top"><p class="item-title">${item.title}</p></div><p class="item-copy">${item.copy}</p><p class="meta">${item.sources}</p></article>
  `).join("");
}

function renderSignals() {
  document.getElementById("market-signals").innerHTML = signals.map(([icon, title, copy]) => `
    <div class="signal-item"><span class="icon-tile">${icon}</span><div><p class="item-title">${title}</p><p class="item-copy">${copy}</p></div></div>
  `).join("");
}

renderTags();
renderImplications();
renderSources();
renderPrices();
renderFlash();
renderEditorial();
renderSignals();
