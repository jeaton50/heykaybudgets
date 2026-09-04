(function () {
    "use strict";

    var articles = {
        "beginner-budgeting": ["Beginner Budgeting Guide: How to Start When You Feel Behind", "Budgeting Basics"],
        "paycheck-budget": ["How to Create a Paycheck Budget", "Budgeting Basics"],
        "monthly-budget-checklist": ["Monthly Budget Checklist for Beginners", "Budgeting Basics"],
        "zero-based-budget": ["What Is Zero Based Budgeting?", "Budgeting Basics"],
        "zero-based-budget-template": ["Zero Based Budget Template", "Budgeting Basics"],
        "zero-based-budget-categories": ["Zero-Based Budget Categories for Beginners", "Budgeting Basics"],
        "zero-based-budget-examples": ["Zero Based Budget Examples", "Budgeting Basics"],
        "buffer": ["Budget Buffer: What It Is and How Much You Should Save", "Saving"],
        "saving-strategy": ["How to Get One Month Ahead on Bills Without Feeling Overwhelmed", "Saving"],
        "safety-net": ["Build Your First $500 Emergency Fund", "Saving"],
        "mistakes": ["5 Budgeting Mistakes That Keep You Broke", "Budgeting Tips"],
        "sinking-funds": ["Sinking Fund Categories: 50+ Examples to Stop Surprise Expenses", "Sinking Funds"],
        "sinking-fund-categories": ["50+ Sinking Fund Categories", "Sinking Funds"],
        "sinking-fund-examples": ["Sinking Fund Examples: 75 Real-Life Ideas for Beginners", "Sinking Funds"],
        "high-priority-sinking-funds": ["High Priority Sinking Funds: What to Save for First", "Sinking Funds"],
        "sinking-fund-examples-families": ["Sinking Fund Examples for Families", "Sinking Funds"],
        "emergency-fund-vs-sinking-fund": ["Emergency Fund vs Sinking Fund", "Sinking Funds"],
        "how-much-sinking-fund": ["How Much Should You Put in a Sinking Fund?", "Sinking Funds"],
        "sinking-fund-budget-categories": ["Best Budget Categories for Sinking Funds", "Sinking Funds"],
        "sinking-fund-tracker": ["Sinking Fund Tracker: How to Track Your Categories Each Month", "Sinking Funds"],
        "budget-buffer-vs-emergency-fund-vs-sinking-fund": ["Budget Buffer vs Emergency Fund vs Sinking Fund", "Saving"],
        "debt-payoff-plan": ["How to Create a Debt Payoff Plan That Works", "Debt Payoff"],
        "debt-snowball-method": ["Debt Snowball Method", "Debt Payoff"],
        "debt-avalanche-method": ["Debt Avalanche Method", "Debt Payoff"],
        "debt-snowball-vs-avalanche": ["Debt Snowball vs Avalanche", "Debt Payoff"],
        "pay-off-debt-low-income": ["How to Pay Off Debt on a Low Income", "Debt Payoff"],
        "credit-card-debt": ["How to Pay Off Credit Card Debt", "Debt Payoff"],
        "how-to-start-budgeting-when-behind": ["How to Start Budgeting When You're Behind on Bills", "Budgeting Basics"],
        "living-paycheck-to-paycheck": ["How to Stop Living Paycheck to Paycheck", "Budgeting Basics"],
        "budget-categories": ["Budget Categories for Beginners", "Budgeting Basics"],
        "budget-for-one": ["Budgeting for One Person", "Budgeting Basics"],
        "irregular-income-budget": ["How to Budget With Irregular Income", "Budgeting Basics"],
        "50-30-20-budget-rule": ["The 50/30/20 Budget Rule", "Budgeting Basics"],
        "cash-stuffing": ["Cash Stuffing: How It Works", "Budgeting Methods"],
        "cash-stuffing-categories": ["Cash Stuffing Categories", "Budgeting Methods"],
        "52-week-savings-challenge": ["52 Week Savings Challenge", "Saving"],
        "no-spend-challenge": ["How to Run a No Spend Challenge", "Saving"],
        "pay-yourself-first": ["Pay Yourself First", "Saving"],
        "save-1000-emergency-fund": ["How to Save Your First $1,000", "Saving"],
        "save-10000-in-a-year": ["How to Save $10,000 in a Year", "Saving"],
        "save-money-fast": ["How to Save Money Fast", "Saving"],
        "free-resources": ["Free Budgeting Printables and Calculators", "Budgeting Tools"]
    };

    var articleGroups = [
        [
            "beginner-budgeting",
            "paycheck-budget",
            "monthly-budget-checklist",
            "zero-based-budget",
            "zero-based-budget-template",
            "zero-based-budget-categories",
            "zero-based-budget-examples",
            "mistakes"
        ],
        [
            "buffer",
            "saving-strategy",
            "safety-net",
            "emergency-fund-vs-sinking-fund"
        ],
        [
            "sinking-funds",
            "sinking-fund-categories",
            "sinking-fund-examples",
            "high-priority-sinking-funds",
            "sinking-fund-examples-families",
            "how-much-sinking-fund",
            "sinking-fund-budget-categories",
            "sinking-fund-tracker",
            "budget-buffer-vs-emergency-fund-vs-sinking-fund",
            "emergency-fund-vs-sinking-fund"
        ],
        [
            "debt-payoff-plan",
            "debt-snowball-method",
            "debt-avalanche-method",
            "debt-snowball-vs-avalanche",
            "pay-off-debt-low-income",
            "credit-card-debt",
            "beginner-budgeting",
            "free-resources"
        ]
    ];

    var startHereGuides = {
        "sinking-funds": [
            ["Choose your top three funds", "high-priority-sinking-funds"],
            ["Browse 75 sinking fund examples", "sinking-fund-examples"],
            ["Add the monthly amount to your budget", "zero-based-budget-categories"],
            ["Track each balance every month", "sinking-fund-tracker"]
        ],
        "sinking-fund-examples": [
            ["Start with essential categories", "high-priority-sinking-funds"],
            ["Choose a monthly contribution", "how-much-sinking-fund"],
            ["Add each fund to your budget", "zero-based-budget-categories"],
            ["Track your progress", "sinking-fund-tracker"]
        ],
        "zero-based-budget-categories": [
            ["Start with income and required bills", "beginner-budgeting"],
            ["Add high-priority sinking funds", "high-priority-sinking-funds"],
            ["Plan each paycheck", "paycheck-budget"],
            ["Review the month", "monthly-budget-checklist"]
        ],
        "saving-strategy": [
            ["Build a small checking cushion", "buffer"],
            ["Protect predictable expenses", "sinking-funds"],
            ["Save one bill at a time", "paycheck-budget"],
            ["Compare your three safety tools", "budget-buffer-vs-emergency-fund-vs-sinking-fund"]
        ],
        "buffer": [
            ["Choose a starter buffer target", "budget-buffer-vs-emergency-fund-vs-sinking-fund"],
            ["Add it to your beginner budget", "beginner-budgeting"],
            ["Build one bill ahead", "saving-strategy"],
            ["Keep true emergencies separate", "emergency-fund-vs-sinking-fund"]
        ],
        "high-priority-sinking-funds": [
            ["Pick only three starter categories", "sinking-funds"],
            ["Calculate each monthly amount", "how-much-sinking-fund"],
            ["Track the balances", "sinking-fund-tracker"],
            ["Add more ideas later", "sinking-fund-examples"]
        ],
        "emergency-fund-vs-sinking-fund": [
            ["Compare all three savings tools", "budget-buffer-vs-emergency-fund-vs-sinking-fund"],
            ["Build a small emergency cushion", "safety-net"],
            ["Choose essential sinking funds", "high-priority-sinking-funds"],
            ["Create a budget buffer", "buffer"]
        ]
    };

    function getSlug() {
        var path = window.location.pathname.replace(/\/+$/, "");
        var last = path.split("/").pop() || "index";
        return last.replace(/\.html$/, "") || "index";
    }

    function registerCurrentArticle(slug) {
        if (articles[slug]) return;
        var page = document.querySelector("article.page");
        var articleSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some(function (script) {
            return script.textContent.indexOf('"Article"') !== -1;
        });
        if (!page || !articleSchema) return;
        var heading = page.querySelector("h1");
        var meta = page.querySelector(".post-meta");
        var category = "Budgeting Guide";
        if (meta) {
            var parts = meta.textContent.split("|").map(function (part) { return part.trim(); });
            if (parts.length > 1 && parts[1]) category = parts[1];
        }
        articles[slug] = [heading ? heading.textContent.trim() : document.title, category];
    }

    function addBreadcrumbs(page, slug) {
        if (page.querySelector(".breadcrumbs")) return;
        var title = articles[slug][0];
        var nav = document.createElement("nav");
        nav.className = "breadcrumbs";
        nav.setAttribute("aria-label", "Breadcrumb");
        nav.innerHTML = '<a href="/">Home</a><span aria-hidden="true">/</span><a href="blog">Guides</a><span aria-hidden="true">/</span><span aria-current="page">' + title + "</span>";
        page.insertBefore(nav, page.firstElementChild);

        if (!document.querySelector('script[data-hkb-breadcrumb-schema]')) {
            var schema = document.createElement("script");
            schema.type = "application/ld+json";
            schema.setAttribute("data-hkb-breadcrumb-schema", "true");
            schema.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.heykaybudgets.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://www.heykaybudgets.com/blog" },
                    { "@type": "ListItem", "position": 3, "name": title, "item": "https://www.heykaybudgets.com/" + slug }
                ]
            });
            document.head.appendChild(schema);
        }
    }

    function createStartHere(slug) {
        var steps = startHereGuides[slug];
        if (!steps) return null;
        var section = document.createElement("section");
        section.className = "glass-card start-here-box";
        section.innerHTML = '<p class="start-here-kicker">New to this topic?</p><h2>Start Here</h2><ol>' + steps.map(function (step) {
            return '<li><a href="' + step[1] + '">' + step[0] + "</a></li>";
        }).join("") + "</ol>";
        return section;
    }

    function createAuthorBox() {
        var section = document.createElement("aside");
        section.className = "author-box";
        section.setAttribute("aria-labelledby", "about-kay-title");
        section.innerHTML = '<span class="author-avatar" aria-hidden="true"></span><div><p class="author-kicker">About the author</p><h2 id="about-kay-title">About Kay</h2><p>Kay writes Hey Kay Budgets from personal experience with budgeting, saving, debt payoff, and building simple systems for real life. She is not a licensed financial advisor, but she shares beginner-friendly tools and examples to help readers make a plan without shame or confusing finance jargon.</p><a href="about">Read Kay\'s story and editorial approach &rarr;</a></div>';
        return section;
    }

    function setCurrentNavigation(slug) {
        var links = document.querySelectorAll(".site-nav > a");
        links.forEach(function (link) {
            var href = (link.getAttribute("href") || "").replace(/^\//, "").replace(/\.html$/, "");
            var isHome = slug === "index" && (href === "" || href === "/");
            var isCurrent = href === slug || isHome;
            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (articles[slug] && slug !== "beginner-budgeting") {
            var guidesLink = document.querySelector('.site-nav a[href="blog"]');
            if (guidesLink) guidesLink.setAttribute("aria-current", "page");
        }

        var toolSlugs = ["mortgage", "free-resources", "budget-printables", "sinking-fund-tracker"];
        var tools = document.querySelector(".nav-tools");
        if (tools && toolSlugs.indexOf(slug) !== -1) {
            tools.classList.add("is-current");
            var toolLink = tools.querySelector('a[href="' + slug + '"]');
            if (toolLink) toolLink.setAttribute("aria-current", "page");
        }
    }

    function setupToolsMenu() {
        var menu = document.querySelector(".nav-tools");
        if (!menu) return;

        document.addEventListener("click", function (event) {
            if (menu.open && !menu.contains(event.target)) {
                menu.open = false;
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                menu.open = false;
            }
        });
    }

    function setupBlogFilters() {
        var buttons = document.querySelectorAll(".filter-button");
        var cards = document.querySelectorAll(".post-card[data-category]");
        var status = document.getElementById("filter-status");
        if (!buttons.length || !cards.length) return;

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var filter = button.getAttribute("data-filter");
                var visible = 0;

                buttons.forEach(function (item) {
                    var active = item === button;
                    item.classList.toggle("is-active", active);
                    item.setAttribute("aria-pressed", active ? "true" : "false");
                });

                cards.forEach(function (card) {
                    var show = filter === "all" || card.getAttribute("data-category") === filter;
                    card.hidden = !show;
                    if (show) visible += 1;
                });

                if (status) {
                    status.textContent = visible + (visible === 1 ? " guide" : " guides") + " shown";
                }
            });
        });
    }

    function slugifyHeading(text, index) {
        var slug = text
            .toLowerCase()
            .replace(/&amp;/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        return slug || "section-" + (index + 1);
    }

    function createSignup(position) {
        var section = document.createElement("section");
        section.className = "article-signup article-signup-" + position;
        section.setAttribute("aria-label", "Free debt payoff worksheet");
        section.innerHTML =
            '<p class="signup-kicker">Free printable</p>' +
            "<h2>Make Your Next Money Step Easier</h2>" +
            "<p>Get the free debt payoff worksheet plus practical budgeting notes from Hey Kay Budgets.</p>" +
            '<form action="https://formspree.io/heykaybudgets@gmail.com" method="POST">' +
            '<label class="sr-only" for="article-email-' + position + '">Email address</label>' +
            '<input id="article-email-' + position + '" type="email" name="email" placeholder="Your email address" autocomplete="email" required>' +
            '<button type="submit">Send the Worksheet</button>' +
            '<input type="hidden" name="_subject" value="New Hey Kay Budgets article subscriber">' +
            "</form>" +
            '<p class="signup-note">No spam. Unsubscribe anytime.</p>';
        return section;
    }

    function getRelatedSlugs(slug) {
        var group = articleGroups.find(function (items) {
            return items.indexOf(slug) !== -1;
        }) || articleGroups[0];
        var currentIndex = group.indexOf(slug);
        var related = [];
        var offset = 1;

        while (related.length < 3 && offset <= group.length + 2) {
            var candidate = group[(currentIndex + offset + group.length) % group.length];
            if (candidate !== slug && related.indexOf(candidate) === -1 && articles[candidate]) {
                related.push(candidate);
            }
            offset += 1;
        }
        return related;
    }

    function createRelatedGuides(slug) {
        var related = getRelatedSlugs(slug);
        var section = document.createElement("section");
        section.className = "related-guides";
        section.setAttribute("aria-labelledby", "related-guides-title");

        var cards = related.map(function (item) {
            return (
                '<a class="related-card" href="' + item + '">' +
                "<small>" + articles[item][1] + "</small>" +
                "<strong>" + articles[item][0] + "</strong>" +
                "<span>Read guide &rarr;</span>" +
                "</a>"
            );
        }).join("");

        var next = related[0];
        var pinterestUrl =
            "https://www.pinterest.com/pin/create/button/?url=" +
            encodeURIComponent(window.location.href) +
            "&media=" +
            encodeURIComponent("https://www.heykaybudgets.com/static/logo.png") +
            "&description=" +
            encodeURIComponent(document.title);

        section.innerHTML =
            '<h2 id="related-guides-title">Keep Going</h2>' +
            '<div class="related-grid">' + cards + "</div>" +
            '<div class="article-end-actions">' +
            '<a class="continue-link" href="' + next + '">Next: ' + articles[next][0] + " &rarr;</a>" +
            '<a class="pinterest-link" href="' + pinterestUrl + '" target="_blank" rel="noopener noreferrer">Save to Pinterest</a>' +
            "</div>";

        return section;
    }

    function setupReadingProgress() {
        var bar = document.createElement("div");
        bar.className = "article-progress";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);

        function update() {
            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            var progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, progress)) + "%";
        }

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    }

    function enhanceArticle(slug) {
        if (!articles[slug]) return;

        var page = document.querySelector("article.page");
        if (!page || page.classList.contains("article-page-enhanced")) return;

        addBreadcrumbs(page, slug);

        var cards = Array.from(page.querySelectorAll(":scope > .glass-card"));
        var startHere = createStartHere(slug);
        if (startHere && cards[0]) {
            cards[0].insertAdjacentElement("afterend", startHere);
            cards = Array.from(page.querySelectorAll(":scope > .glass-card"));
        }
        var headings = Array.from(page.querySelectorAll(":scope > .glass-card h2"));
        if (!cards.length) return;

        page.classList.add("article-page-enhanced");
        setupReadingProgress();

        headings.forEach(function (heading, index) {
            if (!heading.id) {
                heading.id = slugifyHeading(heading.textContent.trim(), index);
            }
        });

        var shell = document.createElement("div");
        shell.className = "article-shell";
        var toc = document.createElement("aside");
        toc.className = "article-toc";
        toc.setAttribute("aria-label", "Table of contents");
        var content = document.createElement("div");
        content.className = "article-content";

        toc.innerHTML =
            '<div class="toc-title">On this page</div>' +
            "<nav>" +
            headings.slice(0, 12).map(function (heading) {
                return '<a href="#' + heading.id + '">' + heading.textContent.trim() + "</a>";
            }).join("") +
            "</nav>";

        page.insertBefore(shell, cards[0]);
        shell.appendChild(toc);
        shell.appendChild(content);

        var node = shell.nextSibling;
        while (node) {
            var next = node.nextSibling;
            content.appendChild(node);
            node = next;
        }

        var contentCards = Array.from(content.querySelectorAll(":scope > .glass-card"));
        var midpoint = contentCards[Math.max(0, Math.floor(contentCards.length / 2) - 1)];
        if (midpoint) {
            midpoint.insertAdjacentElement("afterend", createSignup("mid"));
        }

        if (!content.querySelector(".author-box")) {
            content.appendChild(createAuthorBox());
        }
        content.appendChild(createRelatedGuides(slug));
        content.appendChild(createSignup("end"));
    }

    function updateFooterYear() {
        var footer = document.querySelector(".footer-copy");
        if (footer) {
            footer.innerHTML = footer.innerHTML.replace(/2025/g, "2026");
        }
    }

    window.hkbTrackEvent = function (name, parameters) {
        if (typeof window.gtag !== "function") return;
        window.gtag("event", name, parameters || {});
    };

    function getElementLocation(element) {
        var section = element.closest("section, header, footer, nav");
        if (!section) return "page";
        return section.id ||
            section.getAttribute("aria-label") ||
            section.className.split(" ")[0] ||
            section.tagName.toLowerCase();
    }

    function setupAnalyticsTracking() {
        document.addEventListener("click", function (event) {
            var link = event.target.closest("a[href]");
            if (!link) return;

            var destination;
            try {
                destination = new URL(link.href, window.location.href);
            } catch (error) {
                return;
            }

            var samePageAnchor =
                destination.hash &&
                destination.pathname === window.location.pathname;
            if (destination.origin !== window.location.origin || samePageAnchor) return;

            window.hkbTrackEvent("internal_link_click", {
                link_text: link.textContent.trim().replace(/\s+/g, " ").slice(0, 100),
                link_url: destination.pathname,
                link_location: getElementLocation(link),
                source_page: window.location.pathname
            });
        });

        document.querySelectorAll("form.signup-form, .article-signup form").forEach(function (form) {
            form.addEventListener("submit", function () {
                window.hkbTrackEvent("email_signup_submit", {
                    form_location: getElementLocation(form)
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        var slug = getSlug();
        registerCurrentArticle(slug);
        setCurrentNavigation(slug);
        setupToolsMenu();
        setupBlogFilters();
        enhanceArticle(slug);
        setupAnalyticsTracking();
        updateFooterYear();
    });
})();
