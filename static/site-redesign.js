(function () {
    "use strict";

    var articles = {
        "beginner-budgeting": ["Beginner Budgeting Guide: How to Start When You Feel Behind", "Budgeting Basics"],
        "paycheck-budget": ["How to Create a Paycheck Budget", "Budgeting Basics"],
        "monthly-budget-checklist": ["Monthly Budget Checklist for Beginners", "Budgeting Basics"],
        "zero-based-budget": ["What Is Zero Based Budgeting?", "Budgeting Basics"],
        "zero-based-budget-template": ["Zero Based Budget Template", "Budgeting Basics"],
        "zero-based-budget-categories": ["Zero Based Budget Categories", "Budgeting Basics"],
        "zero-based-budget-examples": ["Zero Based Budget Examples", "Budgeting Basics"],
        "buffer": ["Budget Buffer: What It Is and How Much You Should Save", "Saving"],
        "saving-strategy": ["How to Get One Month Ahead on Bills", "Saving"],
        "safety-net": ["Build Your First $500 Emergency Fund", "Saving"],
        "mistakes": ["5 Budgeting Mistakes That Keep You Broke", "Budgeting Tips"],
        "sinking-funds": ["Sinking Fund Categories: 50+ Examples for Beginners", "Sinking Funds"],
        "sinking-fund-categories": ["50+ Sinking Fund Categories", "Sinking Funds"],
        "sinking-fund-examples": ["Real-Life Sinking Fund Examples", "Sinking Funds"],
        "sinking-fund-examples-families": ["Sinking Fund Examples for Families", "Sinking Funds"],
        "emergency-fund-vs-sinking-fund": ["Emergency Fund vs Sinking Fund", "Sinking Funds"],
        "how-much-sinking-fund": ["How Much Should You Put in a Sinking Fund?", "Sinking Funds"],
        "sinking-fund-budget-categories": ["Best Budget Categories for Sinking Funds", "Sinking Funds"],
        "debt-payoff-plan": ["How to Create a Debt Payoff Plan That Works", "Debt Payoff"],
        "debt-snowball-method": ["Debt Snowball Method", "Debt Payoff"],
        "debt-avalanche-method": ["Debt Avalanche Method", "Debt Payoff"]
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
            "sinking-fund-examples-families",
            "how-much-sinking-fund",
            "sinking-fund-budget-categories",
            "emergency-fund-vs-sinking-fund"
        ],
        [
            "debt-payoff-plan",
            "debt-snowball-method",
            "debt-avalanche-method",
            "beginner-budgeting"
        ]
    ];

    function getSlug() {
        var path = window.location.pathname.replace(/\/+$/, "");
        var last = path.split("/").pop() || "index";
        return last.replace(/\.html$/, "") || "index";
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

        var toolSlugs = ["mortgage"];
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

        var cards = Array.from(page.querySelectorAll(":scope > .glass-card"));
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

        content.appendChild(createRelatedGuides(slug));
        content.appendChild(createSignup("end"));
    }

    function updateFooterYear() {
        var footer = document.querySelector(".footer-copy");
        if (footer) {
            footer.innerHTML = footer.innerHTML.replace(/2025/g, "2026");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        var slug = getSlug();
        setCurrentNavigation(slug);
        setupToolsMenu();
        setupBlogFilters();
        enhanceArticle(slug);
        updateFooterYear();
    });
})();
