const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('response', async (response) => {
        const url = response.url();
        const type = response.headers()['content-type'];
        if (type && type.includes('json')) {
            console.log('JSON URL:', url);
        }
        if (url.includes('socket')) {
            console.log('WS or Socket:', url);
        }
    });

    await page.goto('https://www.octabroker.com/markets/profit-calculator/', { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
})();
