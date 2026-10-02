const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.name}: ${err.message}`);
  });

  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  console.log("Waiting 5 seconds for state transitions...");
  await page.waitForTimeout(5000);

  const content = await page.content();
  if (content.includes("Connecting to Velora City")) {
      console.log("STILL CONNECTING.");
  } else {
      console.log("CONNECTED SUCCESSFULLY.");
  }

  await browser.close();
})();
