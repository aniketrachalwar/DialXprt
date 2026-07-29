const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  const categories = await page.$$('.cursor-pointer');
  if (categories.length > 0) {
    console.log("Clicking category...");
    await categories[0].click();
    await new Promise(r => setTimeout(r, 2000));
  }
  
  await browser.close();
})();
