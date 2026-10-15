# October 15, 2026 AdSense corrections

This records the website work from the supplied correction plan. It does not assert Google approval or access to private Google reports.

## Corrections

- Defined the checking-account buffer, one-month-ahead reserve, sinking fund, and emergency fund consistently. Corrected the paycheck-to-paycheck article and related reserve guidance.
- Qualified sample savings amounts and timelines. Fixed the $4,800 category example, $4,500 zero-based template, and $4,000 category example so assigned amounts equal income. Checked all five other zero-based examples.
- Removed unsupported personal payoff/savings stories and replaced the About page with an editorial approach. Linked article bylines to About.
- Replaced unverified email worksheet promises with four direct, free, one-page PDF downloads. Printable HTML remains available.
- Added calculator input validation and explicit limits; incomplete schedules cannot be reported as paid off. Fixed blank versus zero-rate input, unavailable baseline estimates, mortgage chart timing, stale mortgage exports, and fee labels.
- Documented fixed-rate/monthly-interest assumptions and the independent-debt model. The tool does not automatically roll payments between debts.
- Corrected the mortgage PMI explanation and linked the CFPB source. The model keeps entered fees constant and does not model PMI cancellation.
- Kept account verification and ads.txt. Moved advertising requests behind acceptance, alongside analytics, and added footer Cookie choices. Updated Privacy to describe actual processing.
- Fixed resource-page sizing, table scrolling, accessible input names, keyboard focus, button contrast, consent spacing, and worksheet print styles.
- Versioned shared assets for this release and removed year-long immutable caching of unversioned shared files.
- Preserved the two older design-example files with noindex/canonical fallbacks and added redirects to the corresponding current calculators.

## Verification performed

- Source checks: 58 HTML pages (including the two articles merged on GitHub during this update); local asset/page targets; inline JavaScript syntax; JSON-LD parsing; sitemap canonical/indexability checks; eight budget totals; account verification; no email delivery forms.
- Browser checks: zero interest, positive interest, decimal amounts, minimum-only baseline failure, extra payments, blank/negative/large values, model limits, payoff-month calculation, actual calculator results, both Excel downloads, and four PDF download journeys.
- Mortgage example: $1,200 loan, 0%, $120 payment including $20 escrow, $5 fees. Standard payoff is 12 months and $1,500 all-in payments; adding $100 principal gives 6 months and $1,350 all-in payments.
- Fresh-context consent checks: no ad script before acceptance or after decline, one script after acceptance, preference persistence, and withdrawal.
- Browser widths: 320, 390, 768, and 1440 pixels. Tested menu open/close, scrollable tables, page overflow, mobile calculator results, and screenshots.
- Four generated PDFs rendered and visually inspected as one legible page each. HTML printing also produces four worksheet pages without a blank cover, and the first page was visually inspected.
- Existing public legacy routes checked directly: /buffer.html, /sinking-funds.html, /mortgage.html, /privacy.html each returns a single 301 to its preferred clean URL.
- Public robots.txt and sitemap.xml return 200. A repeatable live-site check verifies all sitemap destinations, deployed corrections, PDF downloads, and self-canonicals after publication.

## Repeatable commands

Run from the repository root:

- Source checks: node scripts/verify-site.cjs
- Browser checks: node scripts/smoke-site.cjs (requires Playwright and Chromium available to Node)
- Public deployment checks: node scripts/verify-live.cjs
- Rebuild worksheets: python scripts/build-worksheets.py (requires ReportLab)

Browser screenshots and downloaded exports are saved to the operating system temporary directory under heykaybudgets-oct15-qa.

## Account checks still required

No usable signed-in Search Console or AdSense session was available. The following cannot be confirmed from public pages:

1. Inspect changed URLs in Search Console and compare the declared and Google-selected canonical after recrawling.
2. Check the private Page Indexing report for errors and submit/request recrawling as appropriate.
3. Check the current AdSense status, review restrictions, and whether Request review is enabled.
4. Review any region-specific advertising consent requirements in the publisher account before serving ads.

There is no prescribed 2-4-week delay in this implementation. Follow the current account's review restrictions and allow for recrawling; approval is Google's decision.

## References checked

- [Google AdSense: site not ready to show ads](https://support.google.com/adsense/answer/12176698?hl=en)
- [CFPB: emergency savings](https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/)
- [CFPB: PMI cancellation](https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/)
