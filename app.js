const heroTags = ["Mercati", "Rete", "Storage"];

const implications = [
  ["↗", "Mercati", "Pressione al ribasso sui ricavi merchant in Europa centrale."],
  ["⚖", "Policy", "Le nuove regole sulla flessibilita accelerano la domanda di storage."],
  ["⌁", "Infrastrutture", "Ritardi sugli interconnettori aumentano gli spread regionali."],
  ["▥", "Aziende", "Utilities e developer accelerano investimenti in batterie e contratti PPA."],
];

const sources = [
  ["EC", "EU storage flexibility rules consultation launched", "Commissione europea · 2 h fa", "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en"],
  ["EN", "ENTSO-E Transparency Platform", "ENTSO-E · dati e comunicazioni", "https://transparency.entsoe.eu/"],
  ["RN", "Italy storage auction attracts record interest", "Renewables Now · news", "https://renewablesnow.com/"],
  ["SP", "LNG demand slips in Northwest Europe", "S&P Global Energy · news", "https://www.spglobal.com/commodity-insights/en/news-research"],
  ["EG", "German grid plan 2026-2030 published", "Bundesnetzagentur · rete", "https://www.bundesnetzagentur.de/"],
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
  { topic: "Prezzi", title: "Germania sotto zero per 6 ore consecutive", source: "Google News RSS · Energy Charts", time: "11 min fa", implication: "Segnale favorevole per batterie e demand response.", score: 96 },
  { topic: "Policy", title: "UE apre consultazione su flessibilita e storage", source: "Commissione europea RSS", time: "42 min fa", implication: "Potenziale accelerazione per capacity e flexibility markets.", score: 91 },
  { topic: "Rete", title: "Manutenzione su interconnettore Baltico", source: "ENTSO-E Transparency RSS", time: "1 h fa", implication: "Rischio spread locali nelle ore serali.", score: 84 },
  { topic: "LNG", title: "Domanda LNG in calo nel Nord-Ovest Europa", source: "S&P Global Energy RSS", time: "2 h fa", implication: "Pressione ribassista su TTF e gas-to-power.", score: 79 },
];

const editorialPicks = [
  { title: "La nuova geografia europea dello storage", status: "Approvata", copy: "Perche conta: aste capacity, spread intraday e prezzi negativi stanno convergendo nello stesso segnale d'investimento.", sources: "5 fonti · memo pronto" },
  { title: "PPAs: stabilita dei prezzi nel Q2", status: "Bozza", copy: "Implicazione: buyer industriali tornano selettivi, ma i contratti long-term restano sotto 65 €/MWh nei mercati liquidi.", sources: "3 fonti · da verificare" },
  { title: "Interconnessioni: il collo di bottiglia invisibile", status: "Approvata", copy: "L'aumento degli spread regionali rende piu strategici grid capex, curtailment management e accumuli distribuiti.", sources: "7 fonti · newsletter" },
];

const signals = [
  ["▤", "Storage: asta in Italia per 1,6 GW di capacita", "Domanda record per il primo schema MACSE."],
  ["⌁", "LNG: domanda in calo nel NW Europa", "Prezzi TTF in discesa del 6% su base settimanale."],
  ["□", "PPAs: stabilita dei prezzi nel Q2", "Contratti a lungo termine ancora sotto i 65 €/MWh."],
];

const schemaTables = [
  ["sources", "feed/API/manuale", "nome, url, topic, affidabilita"],
  ["rawArticles", "ingestione", "titolo, url, summary, hash"],
  ["flashNews", "notizie rapide", "topic, score, impatto, stato"],
  ["editorialSelections", "redazione", "issue, whyItMatters, status"],
  ["priceSnapshots", "mercati", "paese, ora, prezzo, delta"],
  ["briefs", "output", "sintesi, citazioni, export"],
  ["savedItems", "workspace", "utente, note, elemento salvato"],
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
    <article class="editorial-item"><div class="editorial-top"><p class="item-title">${item.title}</p><span class="status ${item.status === "Bozza" ? "draft" : ""}">${item.status}</span></div><p class="item-copy">${item.copy}</p><p class="meta">${item.sources}</p></article>
  `).join("");
}

function renderSignals() {
  document.getElementById("market-signals").innerHTML = signals.map(([icon, title, copy]) => `
    <div class="signal-item"><span class="icon-tile">${icon}</span><div><p class="item-title">${title}</p><p class="item-copy">${copy}</p></div></div>
  `).join("");
}

function renderSchema() {
  document.getElementById("schema-grid").innerHTML = schemaTables.map(([name, role, fields]) => `
    <div class="schema-table"><strong>${name}</strong><span>${role}</span><span>${fields}</span></div>
  `).join("");
}

renderTags();
renderImplications();
renderSources();
renderPrices();
renderFlash();
renderEditorial();
renderSignals();
renderSchema();
