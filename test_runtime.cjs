const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 5000 });
    console.log('Page loaded successfully');
  } catch (err) {
    console.log('Navigation Error:', err.message);
  }

  await browser.close();
})();
