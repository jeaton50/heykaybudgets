const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const origin = 'https://www.heykaybudgets.com';
async function main() {
    for (const slug of ['buffer','sinking-funds','mortgage','privacy']) {
        const response = await fetch(origin + '/' + slug + '.html', {redirect:'manual'});
        assert([301,308].includes(response.status), slug + ': permanent redirect');
        assert.equal(new URL(response.headers.get('location'), origin).href, origin + '/' + slug);
        console.log('/' + slug + '.html -> ' + response.status + ' /' + slug);
    }
    const robots = await fetch(origin + '/robots.txt');
    assert.equal(robots.status,200);
    assert(!/^Disallow:\s*\/\s*$/m.test(await robots.text()));
    for (const [legacy, preferred] of [['/site%20example/mortgage.html','/mortgage'],['/site%20example/index%20(2).html','/']]) {
        const response = await fetch(origin + legacy, {redirect:'manual'});
        if ([301,308].includes(response.status)) {
            assert.equal(new URL(response.headers.get('location'), origin).pathname, preferred);
        } else {
            assert.equal(response.status,200);
            assert((await response.text()).includes('name="robots" content="noindex, follow"'), legacy + ': archived example must not be indexed');
        }
    }
    const sitemap = await fetch(origin + '/sitemap.xml');
    assert.equal(sitemap.status,200);
    const xml = await sitemap.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
    assert(urls.length > 40);
    assert.equal(new Set(urls).size, urls.length);
    let checked = 0;
    const workers = Array.from({length:6}, async () => {
        while(urls.length) {
            const url = urls.shift();
            assert(!url.endsWith('.html'));
            const response = await fetch(url, {redirect:'manual'});
            assert.equal(response.status,200,url);
            const html = await response.text();
            assert(html.includes('rel="canonical" href="' + url + '"'), url + ': canonical');
            assert(!/name="robots" content="noindex/.test(html), url + ': noindex');
            if(url.endsWith('/living-paycheck-to-paycheck')) assert(html.includes('Step 3: Protect a Checking-Account Buffer'), 'New content not deployed');
            if(url.endsWith('/free-resources')) assert(html.includes('Download the Free Worksheets'), 'Downloads not deployed');
            checked++;
        }
    });
    await Promise.all(workers);
    for(const name of ['monthly-budget-worksheet','sinking-fund-tracker','debt-payoff-worksheet','budget-buffer-worksheet']) {
        const response = await fetch(origin + '/static/downloads/' + name + '.pdf');
        assert.equal(response.status,200);
        assert(Buffer.from(await response.arrayBuffer()).subarray(0,5).toString()==='%PDF-');
    }
    const html = await (await fetch(origin + '/free-resources')).text();
    assert(html.includes('consent-loader.js?v=20261015'));
    assert(!/<script[^>]+src="https:\/\/pagead2/.test(html));
    const ads = await (await fetch(origin+'/ads.txt')).text();
    assert.equal(ads.trim(),'google.com, pub-9306267160220923, DIRECT, f08c47fec0942fa0');
    console.log('PASS: live redirects, robots, ' + checked + ' indexable sitemap pages, self-canonicals, deployed corrections, four PDFs, and ads.txt.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
