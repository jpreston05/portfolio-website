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
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "no-preference" },
]);
await page.goto(URL, { waitUntil: "networkidle0" });
await sleep(1200);

const probe = async (y) => {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(280);
  return page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { l: Math.round(b.left), t: Math.round(b.top), r: Math.round(b.right), b: Math.round(b.bottom) };
    };
    const q = (s) => box(document.querySelector(s));
    const card = q('[data-testid="hero-card"]');
    const portrait = q('[data-testid="hero-portrait"]');
    const pW = portrait ? portrait.r - portrait.l : null;
    const name = box(document.querySelector('[data-testid="hero-text"] h1'));
    const buttonsBox = q('[data-testid="hero-buttons"]');
    const btnEls = [...document.querySelectorAll('[data-testid="hero-buttons"] a')];
    const btnRows = new Set(btnEls.map((b) => Math.round(b.getBoundingClientRect().top))).size;
    const hit = (a, z) => a && z && a.l < z.r && a.r > z.l && a.t < z.b && a.b > z.t;
    const inside = (a, z) =>
      a && z && a.l >= z.l - 1 && a.r <= z.r + 1 && a.t >= z.t - 1 && a.b <= z.b + 1;
    return {
      card,
      portraitLeft: portrait?.l ?? null,
      portraitW: pW,
      nameTop: name?.t ?? null,
      btnTop: buttonsBox?.t ?? null,
      btnBottom: buttonsBox?.b ?? null,
      btnRows,
      // overlaps (should all be false)
      ovPortraitName: hit(portrait, name),
      ovPortraitBtn: hit(portrait, buttonsBox),
      ovNameBtn: hit(name, buttonsBox),
      // clipping (boxes must be inside the card)
      clipName: !inside(name, card),
      clipBtn: !inside(buttonsBox, card),
    };
  });
};

const N = 14;
const offsets = Array.from({ length: N + 1 }, (_, i) => Math.round((450 * i) / N));
const rows = [];
for (const y of offsets) rows.push({ y, ...(await probe(y)) });

// Monotonic (no bob): every step of name/button top must be >= 0 (never goes up).
const monotonic = (pick) => {
  const v = rows.map(pick).filter((x) => x != null);
  let ok = true,
    worst = 0;
  for (let i = 1; i < v.length; i++) {
    const d = v[i] - v[i - 1];
    if (d < -1) ok = false;
    worst = Math.min(worst, d);
  }
  return { ok, worstUpStep: worst };
};

const nameMono = monotonic((r) => r.nameTop);
const noOverlap = rows.every((r) => !r.ovPortraitName && !r.ovPortraitBtn && !r.ovNameBtn);
const noClip = rows.every((r) => !r.clipName && !r.clipBtn);
const overlapAt = rows.filter((r) => r.ovPortraitName || r.ovPortraitBtn || r.ovNameBtn).map((r) => r.y);
const clipAt = rows.filter((r) => r.clipName || r.clipBtn).map((r) => r.y);
const buttonsBigRows = rows[0].btnRows;
const buttonsDockedRows = rows[rows.length - 1].btnRows;

// Diagonal: portrait width AND left both move through the mid band (d∈[0.3,0.7]),
// i.e. it scales while it slides — not "shrink fully, then slide".
const band = rows.filter((r) => r.y >= 135 && r.y <= 315);
const midFrac = (pick) => {
  const all = rows.map(pick).filter((x) => x != null);
  const total = Math.max(...all) - Math.min(...all) || 1;
  const b = band.map(pick).filter((x) => x != null);
  return Math.round(((Math.max(...b) - Math.min(...b)) / total) * 100);
};
const widthMidPct = midFrac((r) => r.portraitW);
const leftMidPct = midFrac((r) => r.portraitLeft);
const diagonal = widthMidPct > 20 && leftMidPct > 20;

// Buttons glide: lifted (not at floor) when big, at the floor docked, top moves down.
const r0 = rows[0];
const rE = rows[rows.length - 1];
const buttonsLiftedBig = r0.card.b - r0.btnBottom > 60;
const buttonsAtFloorDocked = rE.card.b - rE.btnBottom < 40;
const buttonsGlideDown = rE.btnTop - r0.btnTop > 80;

// Fill: docked content spans most of the card height.
const last = rows[rows.length - 1];
const fillPct =
  last.card && last.btnTop != null
    ? Math.round(((last.btnTop - last.card.t) / (last.card.b - last.card.t)) * 100)
    : null;

for (const [i, y] of [0, 112, 225, 337, 450].entries()) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await sleep(450);
  await page.screenshot({ path: `morph-${i}.png` });
}

console.log(
  JSON.stringify(
    {
      diagonal,
      widthMidPct,
      leftMidPct,
      buttonsLiftedBig,
      buttonsAtFloorDocked,
      buttonsGlideDown,
      nameMono,
      noOverlap,
      overlapAt,
      noClip,
      clipAt,
      buttonsBigRows,
      buttonsDockedRows,
      buttonsTopReachPct: fillPct,
    },
    null,
    2
  )
);
await browser.close();
