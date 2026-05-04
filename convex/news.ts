import { XMLParser } from "fast-xml-parser";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const seedSources = [
  {
    name: "Google News RSS - Energy Transition Europe",
    type: "rss" as const,
    url: "https://news.google.com/rss/search?q=energy%20transition%20Europe%20electricity%20prices%20storage%20grid&hl=en-GB&gl=GB&ceid=GB:en",
    language: "en",
    topics: ["mercati", "rete", "storage", "policy"] as const,
    credibility: 72,
    active: true,
    notes: "Aggregator, useful for discovery. Always attribute original publisher.",
  },
  {
    name: "Renewables Now",
    type: "rss" as const,
    url: "https://renewablesnow.com/feeds/news/",
    language: "en",
    topics: ["rinnovabili", "storage", "aziende", "ppa"] as const,
    credibility: 82,
    active: true,
  },
  {
    name: "ENTSO-E Transparency Platform",
    type: "rss" as const,
    url: "https://transparency.entsoe.eu/news/rss",
    language: "en",
    topics: ["rete", "mercati"] as const,
    credibility: 90,
    active: true,
  },
  {
    name: "Council of the EU",
    type: "rss" as const,
    url: "https://www.consilium.europa.eu/en/rss/press-releases/",
    language: "en",
    topics: ["policy"] as const,
    credibility: 88,
    active: true,
  },
  {
    name: "Reuters",
    type: "licensed" as const,
    url: "https://www.reutersagency.com/",
    language: "en",
    topics: ["mercati", "policy", "aziende"] as const,
    credibility: 95,
    active: false,
    notes: "Placeholder for licensed/commercial access. Do not redistribute without a valid agreement.",
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

function normalizeItems(parsed: any) {
  const channel = parsed?.rss?.channel ?? parsed?.feed;
  const items = channel?.item ?? channel?.entry ?? [];
  return Array.isArray(items) ? items : [items];
}

function classifyTopic(title: string, fallback: readonly string[]) {
  const text = title.toLowerCase();
  if (text.includes("storage") || text.includes("battery") || text.includes("batter")) return "storage";
  if (text.includes("grid") || text.includes("interconnector") || text.includes("transmission")) return "rete";
  if (text.includes("lng") || text.includes("gas")) return "lng";
  if (text.includes("ppa")) return "ppa";
  if (text.includes("policy") || text.includes("commission") || text.includes("council")) return "policy";
  if (text.includes("solar") || text.includes("wind") || text.includes("renewable")) return "rinnovabili";
  return fallback[0] ?? "mercati";
}

function scoreArticle(title: string, sourceCredibility: number) {
  const text = title.toLowerCase();
  const hotTerms = ["price", "negative", "grid", "storage", "auction", "interconnector", "lng", "ppa", "eu"];
  const bonus = hotTerms.reduce((score, term) => score + (text.includes(term) ? 4 : 0), 0);
  return Math.min(99, Math.round(sourceCredibility * 0.72 + bonus));
}

function buildImplication(title: string) {
  const text = title.toLowerCase();
  if (text.includes("negative") || text.includes("price")) return "Segnale da collegare a spread regionali, storage e flessibilita.";
  if (text.includes("grid") || text.includes("interconnector")) return "Possibile impatto su congestione, redispatch e investimenti di rete.";
  if (text.includes("storage") || text.includes("battery")) return "Tema rilevante per aste, capacity market e ricavi merchant.";
  if (text.includes("lng") || text.includes("gas")) return "Da monitorare per TTF, clean spark spread e sicurezza forniture.";
  return "Da valutare per mercati, policy e strategie aziendali.";
}

async function ensureSeedSources(ctx: any) {
  let inserted = 0;
  for (const source of seedSources) {
    const existing = await ctx.db.query("sources").filter((q: any) => q.eq(q.field("url"), source.url)).first();
    if (!existing) {
      await ctx.db.insert("sources", source);
      inserted += 1;
    }
  }
  return inserted;
}

export const listFlashNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const flashes = await ctx.db.query("flashNews").withIndex("by_publishedAt").order("desc").take(args.limit ?? 20);

    return await Promise.all(
      flashes.map(async (flash) => {
        const article = await ctx.db.get(flash.articleId);
        return {
          ...flash,
          url: article?.url,
          summary: article?.summary,
        };
      }),
    );
  },
});

export const listEditorialSelections = query({
  args: { weeklyIssue: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.weeklyIssue) {
      return await ctx.db
        .query("editorialSelections")
        .withIndex("by_weeklyIssue", (q) => q.eq("weeklyIssue", args.weeklyIssue))
        .collect();
    }
    return await ctx.db.query("editorialSelections").order("desc").take(12);
  },
});

export const listSources = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sources").collect();
  },
});

export const seedInitialSources = mutation({
  args: {},
  handler: async (ctx) => {
    return await ensureSeedSources(ctx);
  },
});

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const sourcesInserted = await ensureSeedSources(ctx);
    const source = await ctx.db.query("sources").filter((q) => q.eq(q.field("name"), "Google News RSS - Energy Transition Europe")).first();
    if (!source) return { sourcesInserted, demoInserted: 0 };

    const now = Date.now();
    const demoTitle = "Germania sotto zero per 6 ore consecutive";
    const demoUrl = "https://energyshift.it/demo/germania-prezzi-negativi";
    const demoHash = hashArticle(source.name, demoTitle, demoUrl);
    let article = await ctx.db.query("rawArticles").withIndex("by_hash", (q) => q.eq("hash", demoHash)).first();

    if (!article) {
      const articleId = await ctx.db.insert("rawArticles", {
        sourceId: source._id,
        sourceName: source.name,
        title: demoTitle,
        url: demoUrl,
        publishedAt: now,
        summary: "Produzione solare elevata e domanda debole spingono il mercato day-ahead tedesco in territorio negativo.",
        language: "it",
        hash: demoHash,
        fetchedAt: now,
      });
      article = await ctx.db.get(articleId);
    }

    if (!article) return { sourcesInserted, demoInserted: 0 };

    const existingFlash = await ctx.db.query("flashNews").filter((q) => q.eq(q.field("articleId"), article._id)).first();
    if (!existingFlash) {
      await ctx.db.insert("flashNews", {
        articleId: article._id,
        title: demoTitle,
        sourceName: source.name,
        topic: "mercati",
        relevanceScore: 96,
        urgency: "alta",
        implication: "Segnale favorevole per batterie, demand response e flessibilita intraday.",
        status: "new",
        publishedAt: now,
      });
    }

    const existingEditorial = await ctx.db
      .query("editorialSelections")
      .withIndex("by_weeklyIssue", (q) => q.eq("weeklyIssue", "2026-W18"))
      .first();
    if (!existingEditorial) {
      await ctx.db.insert("editorialSelections", {
        articleIds: [article._id],
        title: "La nuova geografia europea dello storage",
        weeklyIssue: "2026-W18",
        editorNote: "Selezione iniziale Energy Shift per validare il workflow editoriale.",
        whyItMatters: "Prezzi negativi, spread regionali e aste capacity stanno convergendo nello stesso segnale d'investimento.",
        implications: ["Storage", "Flessibilita", "PPAs", "Rete"],
        status: "draft",
        selectedBy: "Codex",
        selectedAt: now,
      });
    }

    const existingBrief = await ctx.db.query("briefs").withIndex("by_date", (q) => q.eq("date", "2026-05-04")).first();
    if (!existingBrief) {
      await ctx.db.insert("briefs", {
        title: "Briefing giornaliero Energy Shift",
        date: "2026-05-04",
        leadStoryId: article._id,
        marketSummary: "Prezzi negativi in Germania evidenziano il valore crescente della flessibilita.",
        policySummary: "La discussione europea su storage e market design resta centrale.",
        infrastructureSummary: "Gli spread regionali aumentano l'attenzione su rete e interconnessioni.",
        companySummary: "Utilities e developer accelerano pipeline batterie e contratti PPA.",
        citations: [article._id],
        exportStatus: "draft",
      });
    }

    for (const [countryCode, priceEurMwh, delta] of [["DE", -12, -38], ["FR", 18, 4], ["IT", 92, 12], ["ES", 34, -6], ["NL", 5, -11], ["PL", 76, 9]] as const) {
      const existingPrice = await ctx.db
        .query("priceSnapshots")
        .withIndex("by_country_date", (q) => q.eq("countryCode", countryCode).eq("date", "2026-05-04"))
        .first();
      if (!existingPrice) {
        await ctx.db.insert("priceSnapshots", {
          countryCode,
          market: "day_ahead",
          date: "2026-05-04",
          hour: 12,
          priceEurMwh,
          delta,
          source: "Energy Charts API",
          fetchedAt: now,
        });
      }
    }

    return { sourcesInserted, demoInserted: 1 };
  },
});

export const triggerFeedRefresh = action({
  args: {},
  handler: async (ctx) => {
    await ctx.runAction(internal.news.fetchFeeds);
    return "ok";
  },
});

export const listActiveRssSources = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sources")
      .withIndex("by_active", (q) => q.eq("active", true))
      .filter((q) => q.eq(q.field("type"), "rss"))
      .collect();
  },
});

export const ingestArticles = internalMutation({
  args: {
    articles: v.array(
      v.object({
        sourceId: v.id("sources"),
        sourceName: v.string(),
        title: v.string(),
        url: v.string(),
        publishedAt: v.number(),
        summary: v.optional(v.string()),
        language: v.string(),
        hash: v.string(),
        topic: v.string(),
        relevanceScore: v.number(),
        implication: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    let inserted = 0;
    for (const article of args.articles) {
      const existing = await ctx.db.query("rawArticles").withIndex("by_hash", (q) => q.eq("hash", article.hash)).first();
      if (existing) continue;

      const articleId = await ctx.db.insert("rawArticles", {
        sourceId: article.sourceId,
        sourceName: article.sourceName,
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        summary: article.summary,
        language: article.language,
        hash: article.hash,
        fetchedAt: Date.now(),
      });

      await ctx.db.insert("flashNews", {
        articleId,
        title: article.title,
        sourceName: article.sourceName,
        topic: article.topic as any,
        relevanceScore: article.relevanceScore,
        urgency: article.relevanceScore >= 90 ? "alta" : article.relevanceScore >= 78 ? "media" : "bassa",
        implication: article.implication,
        status: "new",
        publishedAt: article.publishedAt,
      });
      inserted += 1;
    }
    return inserted;
  },
});

export const fetchFeeds = internalAction({
  args: {},
  handler: async (ctx) => {
    const sources = await ctx.runQuery(internal.news.listActiveRssSources);
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

    for (const source of sources) {
      const response = await fetch(source.url);
      const xml = await response.text();
      const parsed = parser.parse(xml);
      const items = normalizeItems(parsed).slice(0, 20);
      const articles = items
        .map((item: any) => {
          const title = String(item.title?.["#text"] ?? item.title ?? "").trim();
          const link = String(item.link?.href ?? item.link ?? item.guid ?? "").trim();
          if (!title || !link) return null;
          const topic = classifyTopic(title, source.topics);
          return {
            sourceId: source._id,
            sourceName: source.name,
            title,
            url: link,
            publishedAt: Date.parse(item.pubDate ?? item.published ?? item.updated ?? "") || Date.now(),
            summary: String(item.description ?? item.summary ?? "").replace(/<[^>]+>/g, "").slice(0, 280),
            language: source.language,
            hash: hashArticle(source.name, title, link),
            topic,
            relevanceScore: scoreArticle(title, source.credibility),
            implication: buildImplication(title),
          };
        })
        .filter((article: any) => article !== null);

      await ctx.runMutation(internal.news.ingestArticles, { articles });
    }
  },
});
