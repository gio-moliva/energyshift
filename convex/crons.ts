import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("aggiorna notizie flash", { hours: 1 }, internal.news.fetchFeeds);

export default crons;
