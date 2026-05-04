import { mutation } from "./_generated/server";

const issue = "2026-W18";

const editorialItems = [
  {
    title: "Le rinnovabili superano il carbone nella generazione elettrica globale",
    sourceName: "Carbon Brief / Ember",
    sourceUrl: "https://www.carbonbrief.org/clean-energy-pushes-fossil-fuel-power-into-reverse-for-first-time-ever/",
    topic: "rinnovabili" as const,
    status: "approved" as const,
    summary:
      "Carbon Brief, citando Ember, riporta che nel 2025 le rinnovabili hanno raggiunto il 33,8% del mix elettrico globale, superando il carbone per la prima volta dal 1919.",
    whyItMatters:
      "E il passaggio simbolico dal secolo del carbone a un sistema elettrico in cui solare ed eolico coprono ormai gran parte della crescita della domanda.",
    implications: ["Mercati", "Rinnovabili", "Domanda elettrica", "Sistema globale"],
  },
  {
    title: "IEA: fonti low-emission al 43% della generazione elettrica mondiale",
    sourceName: "IEA",
    sourceUrl: "https://www.iea.org/reports/global-energy-review-2026/electricity-supply",
    topic: "mercati" as const,
    status: "approved" as const,
    summary:
      "IEA segnala che nel 2025 le fonti low-emission hanno raggiunto il 43% della generazione elettrica mondiale, il livello piu alto degli ultimi 50 anni.",
    whyItMatters:
      "La transizione accelera, ma carbone e gas restano ancora molto rilevanti, soprattutto nei mercati emergenti.",
    implications: ["Mercati globali", "Low-emission", "Carbone", "Gas"],
  },
  {
    title: "IEA: shock LNG in Medio Oriente e rischio sicurezza energetica",
    sourceName: "IEA",
    sourceUrl: "https://www.iea.org/news/middle-east-crisis-disrupts-international-natural-gas-markets-and-delays-global-lng-supply-wave",
    topic: "lng" as const,
    status: "approved" as const,
    summary:
      "IEA segnala che le tensioni in Medio Oriente hanno rimosso quasi il 20% dell'offerta globale di LNG dal mercato, con possibili perdite cumulate di circa 120 bcm tra 2026 e 2030.",
    whyItMatters:
      "Le rinnovabili non sono solo decarbonizzazione: diventano anche assicurazione geopolitica contro volatilita e shock fossili.",
    implications: ["LNG", "Sicurezza energetica", "Geopolitica", "Prezzi gas"],
  },
  {
    title: "IRENA: 692 GW di nuova capacita rinnovabile installata nel 2025",
    sourceName: "IRENA",
    sourceUrl: "https://www.irena.org/News/pressreleases/2026/Apr/Near-700-GW-Surge-in-2025-Proves-Renewable-Energy-Resilience",
    topic: "rinnovabili" as const,
    status: "approved" as const,
    summary:
      "IRENA riporta 692 GW di nuova capacita rinnovabile nel 2025 e un ruolo dominante delle rinnovabili nelle nuove installazioni globali.",
    whyItMatters:
      "La narrativa del green premium diventa sempre meno convincente quando scala, costi e sicurezza convergono.",
    implications: ["Capex", "Rinnovabili", "Costi", "Competitivita"],
  },
  {
    title: "Batterie: la flessibilita diventa il nuovo terreno competitivo",
    sourceName: "IEA / BloombergNEF",
    sourceUrl: "https://www.iea.org/reports/global-energy-review-2026/technology-battery-storage",
    topic: "storage" as const,
    status: "approved" as const,
    summary:
      "IEA stima 108 GW di nuova capacita battery storage installata nel 2025; BloombergNEF prevede una forte crescita delle mega-installazioni nel 2026.",
    whyItMatters:
      "La competizione nel sistema elettrico si sposta dalla pura generazione alla capacita di spostare energia nel tempo.",
    implications: ["Storage", "Flessibilita", "Merchant revenues", "Rete"],
  },
  {
    title: "Francia: offshore wind formato XXL",
    sourceName: "OffshoreWIND.biz",
    sourceUrl: "https://www.offshorewind.biz/2025/03/24/france-kicks-off-consultation-for-ao10-offshore-wind-tender/",
    topic: "rinnovabili" as const,
    status: "approved" as const,
    summary:
      "La Francia prepara nuovi tender offshore di grande scala, con mix fixed-bottom e floating e crescente attenzione a resilienza industriale e componentistica strategica.",
    whyItMatters:
      "L'offshore wind europeo non e solo energia pulita: e politica industriale, supply chain e sicurezza strategica.",
    implications: ["Offshore wind", "Industria europea", "Supply chain", "Policy"],
  },
  {
    title: "USA: offshore wind sotto pressione regolatoria",
    sourceName: "Reuters via MarketScreener",
    sourceUrl: "https://www.marketscreener.com/news/us-in-deal-to-end-two-more-offshore-wind-leases-in-exchange-for-fossil-fuel-investments-ce7f59dddb8ff326",
    topic: "policy" as const,
    status: "approved" as const,
    summary:
      "Secondo Reuters, due lease offshore verranno chiusi in cambio di 885 milioni di dollari di investimenti in infrastrutture fossili.",
    whyItMatters:
      "Il rischio regolatorio non e un allegato del business plan: in alcuni mercati e spesso il business plan.",
    implications: ["Rischio regolatorio", "Offshore wind", "USA", "Fossili"],
  },
  {
    title: "Italia: domanda elettrica di marzo a 26,5 miliardi di kWh",
    sourceName: "Terna",
    sourceUrl: "https://www.terna.it/it/media/comunicati-stampa/dettaglio/consumi-elettrici-marzo-2026",
    topic: "mercati" as const,
    status: "approved" as const,
    summary:
      "Terna segnala che a marzo la domanda elettrica italiana e arrivata a 26,5 miliardi di kWh, +2,8% anno su anno; nel primo trimestre la domanda cresce del 3%.",
    whyItMatters:
      "La crescita della domanda rende piu urgente integrare rinnovabili, storage, interconnessioni e domanda flessibile.",
    implications: ["Italia", "Domanda elettrica", "Industria", "Sistema elettrico"],
  },
  {
    title: "Italia: a marzo il solare diventa prima fonte rinnovabile del mese",
    sourceName: "Terna / pv magazine Italia",
    sourceUrl: "https://www.pv-magazine.it/2026/04/21/a-marzo-prodotti-4-twh-di-elettricita-da-fotovoltaico-prima-fonte-rinnovabile-del-mese/",
    topic: "rinnovabili" as const,
    status: "approved" as const,
    summary:
      "A marzo il fotovoltaico ha prodotto circa 4 TWh, +17,1% rispetto al 2025, spinto anche dalla nuova capacita installata.",
    whyItMatters:
      "Il solare diventa centrale anche in Italia, ma aumenta il bisogno di flessibilita nelle ore centrali e serali.",
    implications: ["Italia", "Solare", "Storage", "Curtailment"],
  },
  {
    title: "Italia: storage distribuito in crescita, ma flessibilita ancora da misurare",
    sourceName: "Terna / report settore storage",
    sourceUrl: "https://download.terna.it/terna/Terna_electricity_demand_2025_8de58dba2640bfd.pdf",
    topic: "storage" as const,
    status: "draft" as const,
    summary:
      "La base installata di storage in Italia cresce rapidamente, ma resta da capire quanta flessibilita sara davvero disponibile quando il sistema ne avra bisogno.",
    whyItMatters:
      "Il numero di installazioni conta meno della capacita aggregabile, dispacciabile e remunerabile nei mercati di flessibilita.",
    implications: ["Italia", "Storage", "Flessibilita", "Aggregazione"],
  },
  {
    title: "UE: nuove regole REMIT su integrita e trasparenza dei mercati energetici",
    sourceName: "Commissione europea / ACER",
    sourceUrl: "https://energy.ec.europa.eu/news/new-energy-market-integrity-and-transparency-rules-2026-04-09_en",
    topic: "policy" as const,
    status: "approved" as const,
    summary:
      "La Commissione Europea ha pubblicato nuove regole REMIT per migliorare il reporting verso ACER e rafforzare il monitoraggio degli abusi nei mercati wholesale.",
    whyItMatters:
      "Piu trasparenza significa anche piu compliance, migliori dati e sorveglianza piu efficace nei mercati energetici europei.",
    implications: ["REMIT", "ACER", "Wholesale markets", "Compliance"],
  },
];

function hashArticle(sourceName: string, title: string, url: string) {
  const input = `${sourceName}:${title}:${url}`;
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return `${sourceName}:${Math.abs(hash).toString(36)}`;
}

export const seedWeeklySelection = mutation({
  args: {},
  handler: async (ctx) => {
    let insertedArticles = 0;
    let insertedSelections = 0;

    for (const item of editorialItems) {
      let source = await ctx.db.query("sources").filter((q) => q.eq(q.field("name"), item.sourceName)).first();
      if (!source) {
        const sourceId = await ctx.db.insert("sources", {
          name: item.sourceName,
          type: item.sourceUrl.includes("reuters") || item.sourceName.includes("Reuters") ? "licensed" : "manual",
          url: item.sourceUrl,
          language: item.sourceName.includes("Terna") ? "it" : "en",
          topics: [item.topic],
          credibility: item.status === "approved" ? 88 : 70,
          active: true,
          notes: item.status === "draft" ? "Fonte da verificare o raffinare editorialmente." : undefined,
        });
        source = await ctx.db.get(sourceId);
      }
      if (!source) continue;

      const hash = hashArticle(item.sourceName, item.title, item.sourceUrl);
      let article = await ctx.db.query("rawArticles").withIndex("by_hash", (q) => q.eq("hash", hash)).first();
      if (!article) {
        const articleId = await ctx.db.insert("rawArticles", {
          sourceId: source._id,
          sourceName: item.sourceName,
          title: item.title,
          url: item.sourceUrl,
          publishedAt: Date.now(),
          summary: item.summary,
          language: "it",
          hash,
          fetchedAt: Date.now(),
        });
        article = await ctx.db.get(articleId);
        insertedArticles += 1;
      }
      if (!article) continue;

      const existingSelection = await ctx.db
        .query("editorialSelections")
        .withIndex("by_weeklyIssue", (q) => q.eq("weeklyIssue", issue))
        .filter((q) => q.eq(q.field("title"), item.title))
        .first();
      if (!existingSelection) {
        await ctx.db.insert("editorialSelections", {
          articleIds: [article._id],
          title: item.title,
          weeklyIssue: issue,
          editorNote: item.summary,
          whyItMatters: item.whyItMatters,
          implications: item.implications,
          status: item.status,
          selectedBy: "Energy Shift + Codex",
          selectedAt: Date.now(),
        });
        insertedSelections += 1;
      }
    }

    return { issue, insertedArticles, insertedSelections };
  },
});
