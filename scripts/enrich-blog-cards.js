const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const blogPath = path.join(root, "blog.html");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const dates = {};
for (const match of sitemap.matchAll(/<url>\s*<loc>https:\/\/www\.heykaybudgets\.com\/([^<]*)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    dates[match[1] || "index"] = match[2];
}

function categoryFor(tag, href) {
    const normalized = tag.toLowerCase();
    if (href.includes("sinking-fund") || href === "sinking-funds") return "sinking";
    if (normalized.includes("debt")) return "debt";
    if (normalized.includes("sinking")) return "sinking";
    if (
        normalized.includes("saving") ||
        normalized.includes("emergency") ||
        normalized.includes("personal finance")
    ) {
        return "saving";
    }
    return "budgeting";
}

function wordCount(file) {
    const html = fs.readFileSync(file, "utf8");
    const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z0-9#]+;/gi, " ");
    return (text.match(/\b[\w'-]+\b/g) || []).length;
}

function formatDate(value) {
    const date = new Date(value + "T12:00:00");
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

let html = fs.readFileSync(blogPath, "utf8");
html = html.replace(
    /<a href="([^"]+)" class="post-card"(?: data-category="[^"]+")?>([\s\S]*?)<\/a>/g,
    (full, href, body) => {
        const tagMatch = body.match(/<div class="post-tag">([^<]+)<\/div>/);
        const tag = tagMatch ? tagMatch[1].trim() : "Budgeting";
        const category = categoryFor(tag, href);
        const articlePath = path.join(root, href + ".html");
        const existingMeta = body.match(/<div class="post-meta-row"><span>Updated ([^<]+)<\/span><span>(\d+) min read<\/span><\/div>/);
        const minutes = existingMeta
            ? Number(existingMeta[2])
            : (fs.existsSync(articlePath) ? Math.max(3, Math.ceil(wordCount(articlePath) / 225)) : 5);
        const updated = existingMeta ? existingMeta[1] : formatDate(dates[href] || "2026-06-25");

        const cleanedBody = body.replace(/\s*<div class="post-meta-row">[\s\S]*?<\/div>/, "");
        const enrichedBody = cleanedBody.replace(
            /(<div class="post-tag">[^<]+<\/div>)/,
            `$1\n                    <div class="post-meta-row"><span>Updated ${updated}</span><span>${minutes} min read</span></div>`
        );

        return `<a href="${href}" class="post-card" data-category="${category}">${enrichedBody}</a>`;
    }
);

fs.writeFileSync(blogPath, html, "utf8");
console.log("Blog cards enriched with categories, dates, and read times.");
