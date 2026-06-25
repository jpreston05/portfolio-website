import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = process.env.URL || "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
// Defeat headless's reduced-motion default so the morph runs.
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "no-preference" },
]);

await page.goto(URL, { waitUntil: "networkidle0" });
await sleep(1200);

const probe = async (y) => {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(700);
  return page.$eval('[data-testid="hero-card"]', (el) => ({
    rectW: Math.round(el.getBoundingClientRect().width),
    inlineW: el.style.width || "(none)",
    computedW: getComputedStyle(el).width,
    enabled: el.getAttribute("data-enabled"),
    vh: el.getAttribute("data-vh"),
  }));
};

const reduce = await page.evaluate(
  () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
);
const innerWidth = await page.evaluate(() => window.innerWidth);

const shot = async (y, name) => {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(800);
  await page.screenshot({ path: name });
};

const at0 = await probe(0);
const at300 = await probe(300);
const at900 = await probe(900);

await shot(0, "shot-0.png");
await shot(400, "shot-400.png");
await shot(900, "shot-900.png");

console.log(JSON.stringify({ reduce, innerWidth, at0, at300, at900 }, null, 2));
await browser.close();
