const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run(width, outFile, boundsFile) {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle0' });

  const bounds = await page.evaluate(() => {
    const main = document.querySelector('main');
    const sections = Array.from(main.children).map(el => ({
      cls: el.className, id: el.id,
      top: el.offsetTop, height: el.offsetHeight
    }));
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    return {
      header: { top: header.offsetTop, height: header.offsetHeight },
      sections,
      footer: { top: footer.offsetTop, height: footer.offsetHeight },
      scrollHeight: document.documentElement.scrollHeight
    };
  });

  fs.writeFileSync(boundsFile, JSON.stringify(bounds, null, 2));

  // resize viewport to full page height for a clean full-page screenshot
  await page.setViewport({ width, height: Math.ceil(bounds.scrollHeight) });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: outFile, fullPage: false });

  await page.close();
  await browser.disconnect();
  return bounds;
}

(async () => {
  const mode = process.argv[2];
  if (mode === 'desktop') {
    const b = await run(1440, 'full/desktop-full2.png', 'desktop-bounds.json');
    console.log(JSON.stringify(b));
  } else {
    const b = await run(375, 'full/mobile-full2.png', 'mobile-bounds.json');
    console.log(JSON.stringify(b));
  }
})();
