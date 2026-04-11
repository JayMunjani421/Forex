const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('api') || url.includes('quote') || url.includes('price')) {
            try {
                const text = await response.text();
                // only log if it looks like json with prices
                if (text.includes('bid') && text.includes('ask')) {
                    console.log('URL:', url);
                    // console.log('Response:', text.substring(0, 300));
                }
            } catch (e) {}
        }
    });

    await page.goto('https://www.octabroker.com/markets/profit-calculator/', { waitUntil: 'networkidle2' });
    
    // Select an option to trigger price fetch
    await page.evaluate(() => {
        const input = document.querySelector('.chosen-search-input');
        if (input) {
            input.value = 'GBPUSD';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    await new Promise(r => setTimeout(r, 5000));
    await browser.close();
})();
