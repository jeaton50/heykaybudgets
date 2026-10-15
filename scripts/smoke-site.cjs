const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const artifacts = path.join(os.tmpdir(), 'heykaybudgets-oct15-qa');
fs.mkdirSync(artifacts, { recursive: true });
const mime = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.pdf':'application/pdf', '.png':'image/png', '.xml':'application/xml', '.txt':'text/plain' };
const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    let filename = path.resolve(root, '.' + pathname);
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (!path.extname(filename)) filename += '.html';
    if (!fs.existsSync(filename)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
    fs.createReadStream(filename).pipe(res);
});
async function main() {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    const browser = await chromium.launch({ headless:true });
    try {
        const context = await browser.newContext({ viewport:{width:1440,height:1000}, acceptDownloads:true });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base, {waitUntil:'networkidle'});
        assert.equal(await page.locator('script[src*="adsbygoogle"]').count(), 0);
        await page.getByRole('button', {name:'Decline', exact:true}).click();
        await page.locator('.btn-calc').click();
        await page.waitForSelector('.err-box');
        assert.match(await page.locator('#results').innerText(), /Enter a balance/);
        const examples = await page.evaluate(() => {
            const zero = amort({name:'Test',bal:1200,rate:0,min:100,ext:0});
            const extra = amort({name:'Test',bal:1200,rate:0,min:100,ext:100});
            const interest = amort({name:'Test',bal:1000,rate:12,min:100,ext:0});
            const interestExtra = amort({name:'Test',bal:1000,rate:12,min:100,ext:50});
            const decimals = amort({name:'Test',bal:100.01,rate:0,min:33.33,ext:0});
            const baseline = amort({name:'Test',bal:1000,rate:120,min:10,ext:200});
            const invalid = [() => amort({name:'Test',bal:0,rate:0,min:100,ext:0}), () => amort({name:'Test',bal:1200,rate:-1,min:100,ext:0}), () => amort({name:'Test',bal:1e13,rate:0,min:1,ext:0}), () => amort({name:'Test',bal:1200,rate:0,min:0.01,ext:0})].map(fn => {try{fn();return false;}catch(e){return true;}});
            return {zero,extra,interest,interestExtra,decimals,baseline,invalid};
        });
        assert.equal(examples.zero.mo,12); assert.equal(examples.zero.sc.at(-1).bal,0);
        assert.equal(examples.extra.mo,6); assert.equal(examples.extra.saved,6);
        assert.equal(examples.interest.mo,11);
        assert.equal(examples.interest.sc[0].i,10);
        assert(examples.interestExtra.mo < examples.interest.mo);
        assert(examples.interestExtra.sc.reduce((s,r)=>s+r.i,0) < examples.interest.sc.reduce((s,r)=>s+r.i,0));
        assert.equal(examples.decimals.sc.at(-1).pay,0.02);
        assert.equal(examples.baseline.origM,null);
        assert(examples.invalid.every(Boolean));
        const inputs = page.locator('#debt-rows input');
        for (const [i,value] of ['Example debt','1200','0','100','100'].entries()) await inputs.nth(i).fill(value);
        await page.locator('.btn-calc').click();
        await page.waitForSelector('.res-card');
        assert.match(await page.locator('#results').innerText(), /6 mo/);
        assert(await page.locator('#results').innerText().then(text=>text.includes(new Date(new Date().getFullYear(),new Date().getMonth()+6,1).toLocaleDateString('en-US',{month:'long',year:'numeric'}))));
        await page.locator('.tog-btn').click();
        assert.equal(await page.locator('table.sched tbody tr').count(),6);
        const debtDownload = page.waitForEvent('download');
        await page.locator('.btn-export').click();
        const debtReport = await debtDownload;
        assert.match(debtReport.suggestedFilename(), /Debt_Payoff_Report.xlsx$/);
        await debtReport.saveAs(path.join(artifacts, debtReport.suggestedFilename()));
        await page.screenshot({path:path.join(artifacts,'debt-desktop.png'),fullPage:false});
        await page.goto(base+'/mortgage',{waitUntil:'networkidle'});
        for(const [id,value] of Object.entries({loan_amount:'1200',annual_rate:'0',term_years:'1',monthly_pay:'120',escrow:'20',extra_fees:'5',extra_payment:'100'})) await page.locator('#'+id).fill(value);
        await page.locator('.btn-calc').click();
        const mortgage = await page.evaluate(() => lastResult);
        assert.equal(mortgage.noExtra.months,12); assert.equal(mortgage.wExtra.months,6);
        assert.equal(mortgage.noExtra.totInt,0);
        assert.equal(mortgage.wExtra.sc.reduce((sum,r)=>sum+r.pay,0),1350);
        assert.equal(mortgage.wExtra.sc.at(-1).bal,0);
        const positive = await page.evaluate(() => {
            const payment=calcMinPI(100000,0.06/12,360);
            const normal=mortgageAmort(100000,0.06/12,payment,0,0,0);
            const extra=mortgageAmort(100000,0.06/12,payment,0,0,100);
            return {payment,normal,extra};
        });
        assert.equal(positive.payment,599.55);
        assert(positive.extra.months<positive.normal.months);
        assert(positive.extra.totInt<positive.normal.totInt);
        const mortgageDownload=page.waitForEvent('download');
        await page.locator('.btn-export').click();
        const mortgageReport = await mortgageDownload;
        assert.match(mortgageReport.suggestedFilename(),/Mortgage_Report.xlsx$/);
        await mortgageReport.saveAs(path.join(artifacts, mortgageReport.suggestedFilename()));
        await page.locator('#extra_payment').fill('-1'); await page.locator('.btn-calc').click();
        assert.match(await page.locator('#results').innerText(),/negative/);
        assert.equal(await page.evaluate(()=>lastResult),null);
        await page.locator('.btn-reset').click(); await page.locator('.btn-calc').click();
        assert.match(await page.locator('#results').innerText(),/Loan Amount/);
        await page.goto(base+'/free-resources',{waitUntil:'networkidle'});
        for(const name of ['monthly-budget-worksheet','sinking-fund-tracker','debt-payoff-worksheet','budget-buffer-worksheet']){
            const link=page.locator('a[download][href$="/'+name+'.pdf"]').first();
            assert(await link.count()>0);
            const pending=page.waitForEvent('download');await link.click();
            const download=await pending;await download.saveAs(path.join(artifacts,download.suggestedFilename()));
            assert(fs.readFileSync(path.join(artifacts,download.suggestedFilename())).subarray(0,5).toString()==='%PDF-');
        }
        assert.equal(await page.locator('form').count(),0);
        for(const width of [320,390,768,1440]){
            await page.setViewportSize({width,height:900});
            for(const route of ['/','/mortgage','/free-resources','/buffer','/budget-printables','/grocery-budget','/how-to-cut-expenses']){
                await page.goto(base+route,{waitUntil:'networkidle'});
                assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), route+' horizontal overflow at '+width);
                const tables = page.locator('.tbl-scroll, .article-table-wrap, .guide-table-wrap, .comparison-table-wrap');
                for (const table of await tables.all()) {
                    const canScroll = await table.evaluate(el => { if(el.scrollWidth <= el.clientWidth) return true; el.scrollLeft = 80; return el.scrollLeft > 0; });
                    assert(canScroll, route + ': table must scroll');
                }
                await page.locator('.nav-tools > summary').click();
                assert(await page.locator('.nav-tools').evaluate(el=>el.open));
                await page.keyboard.press('Escape');
                assert(!await page.locator('.nav-tools').evaluate(el=>el.open));
                if(width===390&&route==='/') {
                    await page.locator('#debt-rows input').nth(1).fill('1200');
                    await page.locator('#debt-rows input').nth(2).fill('0');
                    await page.locator('#debt-rows input').nth(3).fill('100');
                    await page.locator('.btn-calc').click(); await page.waitForSelector('.res-card');
                    await page.locator('#debt-payoff-tool').scrollIntoViewIfNeeded();
                    await page.screenshot({path:path.join(artifacts,'debt-mobile.png')});
                }
                if(width===390&&route==='/free-resources') await page.screenshot({path:path.join(artifacts,'resources-mobile.png')});
                if(width===390&&route==='/mortgage') {
                    for(const [id,value] of Object.entries({loan_amount:'1200',annual_rate:'0',term_years:'1',monthly_pay:'120',escrow:'20',extra_fees:'5',extra_payment:'100'})) await page.locator('#'+id).fill(value);
                    await page.locator('.btn-calc').click(); await page.waitForSelector('.res-card');
                    await page.locator('#results').scrollIntoViewIfNeeded();
                    assert.match(await page.locator('#results').innerText(), /225.00/);
                    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
                    await page.screenshot({path:path.join(artifacts,'mortgage-mobile.png')});
                }
            }
        }
        await page.goto(base+'/budget-printables',{waitUntil:'networkidle'});
        await page.pdf({path:path.join(artifacts,'browser-printed-worksheets.pdf'),format:'Letter',margin:{top:'0.4in',bottom:'0.4in',left:'0.4in',right:'0.4in'}});
        // A fresh context verifies that consent is neither inherited nor preselected.
        const fresh=await browser.newContext({viewport:{width:390,height:844}});
        const consent=await fresh.newPage();
        await consent.route(/googletagmanager|googlesyndication/,route=>route.fulfill({contentType:'application/javascript',body:''}));
        await consent.goto(base+'/free-resources',{waitUntil:'networkidle'});
        assert(await consent.locator('#ck-banner').isVisible());
        assert.equal(await consent.locator('script[src*="adsbygoogle"]').count(),0);
        await consent.getByRole('button',{name:'Decline',exact:true}).click();
        assert.equal(await consent.locator('script[src*="adsbygoogle"]').count(),0);
        await consent.getByRole('button',{name:'Cookie choices',exact:true}).click();
        await consent.getByRole('button',{name:'Accept All',exact:true}).click();
        assert.equal(await consent.locator('script[src*="adsbygoogle"]').count(),1);
        await consent.reload({waitUntil:'networkidle'});
        assert.equal(await consent.locator('script[src*="adsbygoogle"]').count(),1);
        await consent.getByRole('button',{name:'Cookie choices',exact:true}).click();
        await consent.getByRole('button',{name:'Decline',exact:true}).click();
        await consent.waitForLoadState('networkidle');
        assert.equal(await consent.locator('script[src*="adsbygoogle"]').count(),0);
        assert.deepEqual(errors,[]);
        console.log('PASS: calculator examples and edge cases, both Excel exports, four PDF downloads, consent, navigation, and overflow at 320/390/768/1440px.');
        console.log('Screenshots and downloads: '+artifacts);
    } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
