const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = fs.readdirSync(root).filter((name) => name.endsWith(".html"));

const shell = `        <header class="site-header">
            <div class="header-inner">
                <a href="/" class="brand-link" aria-label="Hey Kay Budgets home">
                    <span class="brand-avatar" aria-hidden="true"></span>
                    <span class="brand-copy">
                        <span class="brand-name">Hey Kay Budgets</span>
                        <span class="brand-tagline">Budget. Save. Pay off debt.</span>
                    </span>
                </a>
                <nav class="site-nav" aria-label="Primary navigation">
                    <a href="/">Home</a>
                    <a href="beginner-budgeting">Start Here</a>
                    <a href="blog">Guides</a>
                    <details class="nav-tools">
                        <summary>Tools</summary>
                        <div class="nav-tools-menu">
                            <a href="/">Debt Payoff Tool</a>
                            <a href="mortgage">Mortgage Calculator</a>
                        </div>
                    </details>
                    <a href="about">About</a>
                </nav>
            </div>
        </header>`;

for (const file of files) {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, "utf8");

    html = html.replace(
        /[ \t]*<header class="site-header">[\s\S]*?<\/header>\s*<nav class="site-nav">[\s\S]*?<\/nav>/,
        shell
    );

    html = html.replace(
        /\s*<link rel="preload" href="\/static\/logo-(?:280|500)\.webp"[^>]*>\s*/g,
        "\n"
    );

    html = html.replace(
        /<meta property="og:image" content="[^"]+" \/>/,
        '<meta property="og:image" content="https://www.heykaybudgets.com/static/social-card.png" />'
    );

    if (!html.includes('property="og:image"')) {
        html = html.replace(
            /(<meta property="og:site_name" content="[^"]+" \/>)/,
            '$1\n    <meta property="og:image" content="https://www.heykaybudgets.com/static/social-card.png" />'
        );
    }

    if (!html.includes('name="twitter:card"')) {
        html = html.replace(
            /(<meta property="og:image" content="[^"]+" \/>)/,
            '$1\n    <meta name="twitter:card" content="summary_large_image">\n    <meta name="twitter:image" content="https://www.heykaybudgets.com/static/social-card.png">'
        );
    }

    html = html.replace(/&copy; 2025 Hey Kay Budgets/g, "&copy; 2026 Hey Kay Budgets");

    if (!html.includes("static/site-redesign.css")) {
        html = html.replace(
            "</head>",
            '    <link rel="stylesheet" href="static/site-redesign.css">\n</head>'
        );
    }

    if (!html.includes("static/site-redesign.js")) {
        html = html.replace(
            "</body>",
            '    <script src="static/site-redesign.js" defer></script>\n</body>'
        );
    }

    if (file === "index.html" || file === "mortgage.html") {
        const guideMatch = html.match(/\s*<section class="content-section"[\s\S]*?<\/section>/);
        if (guideMatch) {
            html = html.replace(guideMatch[0], "");
            const insertionTarget = '<footer class="site-footer">';
            html = html.replace(
                insertionTarget,
                guideMatch[0].trim() + "\n\n        " + insertionTarget
            );
        }
    }

    fs.writeFileSync(filePath, html, "utf8");
}

console.log(`Updated ${files.length} HTML files.`);
