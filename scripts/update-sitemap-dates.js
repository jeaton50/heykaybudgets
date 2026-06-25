const fs = require("fs");
const path = require("path");

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    throw new Error("Usage: node scripts/update-sitemap-dates.js YYYY-MM-DD");
}

const sitemapPath = path.resolve(__dirname, "..", "sitemap.xml");
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const updated = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${date}</lastmod>`);

fs.writeFileSync(sitemapPath, updated, "utf8");
console.log(`Updated sitemap dates to ${date}.`);
