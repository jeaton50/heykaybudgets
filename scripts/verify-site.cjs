const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('google'));
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
let links = 0;
for (const file of files) {
    const html = read(file);
    assert(html.includes('ca-pub-9306267160220923'), file + ': account verification');
    assert(!/<script[^>]+src="https:\/\/pagead2/.test(html), file + ': ads before consent');
    assert(!html.includes('formspree.io'), file + ': unverified email delivery');
    for (const block of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (/application\/ld\+json/.test(block[1])) JSON.parse(block[2]);
        else if (!/src=|type=/.test(block[1])) new vm.Script(block[2], { filename: file });
    }
    for (const link of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const raw = link[1];
        if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
        const pathname = raw.split(/[?#]/)[0].replace(/^\//, '') || 'index';
        assert(!pathname.endsWith('.html'), file + ': legacy internal link');
        assert(fs.existsSync(path.join(root, pathname)) || fs.existsSync(path.join(root, pathname + '.html')), file + ': missing ' + raw);
        links++;
    }
}
function tableRows(file) {
    return [...read(file).matchAll(/<table[^>]*>([\s\S]*?)<\/table>/g)].map(t =>
        [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(r =>
            [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map(c => c[1].replace(/<[^>]*>/g, '').trim())));
}
const dollars = value => Number(value.replace(/[$,]/g, ''));
const budgets = tableRows('zero-based-budget-examples.html');
assert.equal(budgets.length, 5);
for (const rows of budgets) {
    const amount = rows.find(r => r[0] === 'Total Income')[1];
    const sum = rows.filter(r => r[0] !== 'Total Income' && /^\$[\d,]+$/.test(r[1])).reduce((total, r) => total + dollars(r[1]), 0);
    assert.equal(sum, dollars(amount), 'zero-based example must balance');
}
const template = tableRows('zero-based-budget-template.html')[0];
const start = template.findIndex(r => r[0] === 'FIXED EXPENSES');
const end = template.findIndex(r => r[0] === 'Total Assigned');
const assigned = template.slice(start, end).filter(r => /^\$[\d,]+$/.test(r[1] || '')).reduce((sum, r) => sum + dollars(r[1]), 0);
assert.equal(assigned, dollars(template.find(r => r[0] === 'Total Income')[1]));
const categoryRows = tableRows('budget-categories.html').at(-1);
assert.equal(categoryRows.filter(r => /^\$[\d,]+$/.test(r[1] || '')).reduce((sum, r) => sum + dollars(r[1]), 0), 4800);
const zeroRows = tableRows('zero-based-budget-categories.html')[0];
assert.equal(zeroRows.filter(r => !['Income', 'Remaining'].includes(r[0]) && /^\$[\d,]+$/.test(r[1] || '')).reduce((sum, r) => sum + dollars(r[1]), 0), dollars(zeroRows.find(r => r[0] === 'Income')[1]));
for (const file of ['static/site-redesign.js', 'static/consent-loader.js']) new vm.Script(read(file), { filename: file });
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.equal(new Set(urls).size, urls.length);
for (const url of urls) {
    assert(!url.endsWith('.html'));
    const file = new URL(url).pathname === '/' ? 'index.html' : new URL(url).pathname.slice(1) + '.html';
    const html = read(file);
    assert(html.includes('href="' + url + '"'), file + ': canonical mismatch');
    assert(!/name="robots" content="noindex/.test(html), file + ': sitemap noindex');
}
assert.equal(read('ads.txt').trim(), 'google.com, pub-9306267160220923, DIRECT, f08c47fec0942fa0');
console.log('PASS: ' + files.length + ' HTML pages, ' + links + ' local links, scripts/JSON-LD, sitemap, consent gating, and 8 worked budgets.');
