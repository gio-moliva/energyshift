import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const topic = v.union(
  v.literal("mercati"),
  v.literal("policy"),
  v.literal("rete"),
  v.literal("storage"),
  v.literal("aziende"),
  v.literal("lng"),
  v.literal("ppa"),
  v.literal("rinnovabili"),
);

export default defineSchema({
  sources: defineTable({
    name: v.string(),
    type: v.union(v.literal("rss"), v.literal("api"), v.literal("manual"), v.literal("licensed")),
    url: v.string(),
    language: v.string(),
    topics: v.array(topic),
    credibility: v.number(),
    active: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_active", ["active"])
    .index("by_type", ["type"]),

  rawArticles: defineTable({
    sourceId: v.id("sources"),
    sourceName: v.string(),
    title: v.string(),
    url: v.string(),
    publishedAt: v.number(),
    summary: v.optional(v.string()),
    language: v.string(),
    hash: v.string(),
    fetchedAt: v.number(),
  })
    .index("by_hash", ["hash"])
    .index("by_publishedAt", ["publishedAt"])
    .index("by_source", ["sourceId"]),

  flashNews: defineTable({
    articleId: v.id("rawArticles"),
    title: v.string(),
    sourceName: v.string(),
    topic,
    relevanceScore: v.number(),
    urgency: v.union(v.literal("alta"), v.literal("media"), v.literal("bassa")),
    implication: v.string(),
    status: v.union(v.literal("new"), v.literal("reviewed"), v.literal("archived")),
    publishedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_topic", ["topic"])
    .index("by_publishedAt", ["publishedAt"]),

  editorialSelections: defineTable({
    articleIds: v.array(v.id("rawArticles")),
    title: v.string(),
    weeklyIssue: v.string(),
    editorNote: v.string(),
    whyItMatters: v.string(),
    implications: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("published")),
    selectedBy: v.string(),
    selectedAt: v.number(),
  })
    .index("by_weeklyIssue", ["weeklyIssue"])
    .index("by_status", ["status"]),

  priceSnapshots: defineTable({
    countryCode: v.string(),
    market: v.literal("day_ahead"),
    date: v.string(),
    hour: v.number(),
    priceEurMwh: v.number(),
    delta: v.optional(v.number()),
    source: v.string(),
    fetchedAt: v.number(),
  })
    .index("by_country_date", ["countryCode", "date"])
    .index("by_date", ["date"]),

  briefs: defineTable({
    title: v.string(),
    date: v.string(),
    leadStoryId: v.optional(v.id("rawArticles")),
    marketSummary: v.string(),
    policySummary: v.string(),
    infrastructureSummary: v.string(),
    companySummary: v.string(),
    citations: v.array(v.id("rawArticles")),
    exportStatus: v.union(v.literal("draft"), v.literal("ready"), v.literal("exported")),
  })
    .index("by_date", ["date"])
    .index("by_exportStatus", ["exportStatus"]),

  savedItems: defineTable({
    userId: v.string(),
    itemType: v.union(v.literal("article"), v.literal("flash"), v.literal("editorial"), v.literal("brief")),
    itemId: v.string(),
    notes: v.optional(v.string()),
    savedAt: v.number(),
  }).index("by_user", ["userId"]),
});
