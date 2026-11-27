"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

/* Single source of truth for the hero-collapse motion. Both the hero card
   (Herov2) and the right column (page.tsx) call this so the card's width and
   the content's x-offset are derived from the EXACT same formula — that's what
   keeps the gap between them constant and the content out from behind the card. */

// Tunables.
export const RAIL_W = 400; // docked card width at full scale (tall viewports)
// Collapse spans this fraction of one viewport of scroll. Must match the right
// column's trailing sticky-spacer height in page.tsx so the slide-in finishes
// exactly when the sticky pin releases.
export const COLLAPSE_VH = 0.5;
export const PORTRAIT_BIG = 560; // portrait width (px) at the big hero state
export const PORTRAIT_SMALL = 250; // portrait width (px) when docked
// Big card geometry. Height is a fraction of the docked rail height, floored at
// what its own stack needs: BIG_MIN_HC = Herov2's BIG_STACK_EM (407, headline
// at the docked name size + CTA row at font 20) + BTN_GAP_BIG (36) + 2 ·
// BIG_MARGIN (40). A fixed ratio alone clipped the CTA row on short laptops.
// Width fills the container but never exceeds BIG_MAX_ASPECT × the card's
// height, so a short window gets a proportionally narrower, centred card
// instead of a wide strip (tall screens are unaffected).
export const BIG_CARD_RATIO = 0.68;
export const BIG_MIN_HC = 483;
export const BIG_MAX_ASPECT = 2.2;
export const HERO_PAD = 28; // card inset
const NAVBAR = 136; // 8.5rem: the rail's lg top-28 (112px) + 24px bottom gap

// Docked stack (heights in px at scale 1): portrait block (6/7 frame), the
// headline estimate (retune if the headline copy changes) and two thin button
// rows, plus the fixed gaps (portrait→headline 12, headline→buttons 16, 8 slack).
export const HEADLINE_DOCKED = 281; // whole docked headline at font 16
const DOCKED_PORTRAIT = PORTRAIT_SMALL * 1.25;
const DOCKED_TEXT = HEADLINE_DOCKED + 90;
const DOCKED_GAPS = 12 + 16 + 8;
const DOCKED_COL = RAIL_W - 2 * HERO_PAD; // text column at scale 1 (344)
// Short viewports: everything scales down together until the type reaches
// TYPE_MIN (below that it gets hard to read); past it only the portrait keeps
// shrinking, to PORTRAIT_MIN. The rail's WIDTH follows the type scale, so the
// card stays in proportion instead of a wide slab around shrunken text.
const TYPE_MIN = 0.78;
const PORTRAIT_MIN = 0.4;

const clamp = (lo: number, v: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* Docked-card scales for a given rail content height. `slack` is the height
   left over at full scale (tall viewports), which the buttons grow into. */
export function dockedScales(dockedHc: number) {
  const avail = dockedHc - DOCKED_GAPS;
  const type = clamp(TYPE_MIN, avail / (DOCKED_TEXT + DOCKED_PORTRAIT), 1);
  const portrait = clamp(PORTRAIT_MIN, (avail - type * DOCKED_TEXT) / DOCKED_PORTRAIT, 1);
  const slack = Math.max(0, avail - type * DOCKED_TEXT - portrait * DOCKED_PORTRAIT);
  const railW = Math.round(DOCKED_COL * type + 2 * HERO_PAD);
  return { type, portrait, slack, railW };
}

/* Viewport size + whether the morph runs (lg+ with motion allowed). Shared by
   useHeroMotion and SiteChrome (which sizes the grid's rail track). */
export function useViewport() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [vh, setVh] = useState(0);
  const [iw, setIw] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setEnabled(mq.matches && !reduce);
      setVh(window.innerHeight);
      setIw(window.innerWidth);
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [reduce]);

  return { enabled, vh, iw };
}

const dockedHcFor = (vh: number) => (vh || 800) - NAVBAR - 2 * HERO_PAD;

/* Docked rail width: scaled on short viewports while the morph runs; the
   static card (mobile / reduced motion) isn't scaled, so it keeps RAIL_W. */
export const railWidth = (vh: number, enabled: boolean) =>
  enabled ? dockedScales(dockedHcFor(vh)).railW : RAIL_W;

// Horizontal padding outside the max-w container (lg:px-8) — used to size EXTRA.
const CONTAINER_PAD = 64; // 2 * 2rem

// `collapsing` is true only on the home page. Everywhere else the rail is the
// same card pinned at dock = 1 (no scroll choreography), so subpages show
// exactly the docked state the home page ends on.
export function useHeroMotion(collapsing = true) {
  // Morph only on lg+ with motion allowed; else static (mobile / reduced-motion).
  const { enabled, vh, iw } = useViewport();

  // Window scroll is reliably 0 at the very top. dock: 0 = big, 1 = docked.
  const { scrollY } = useScroll();
  const intro = (vh || 800) * COLLAPSE_VH;
  const dock = useTransform(scrollY, (y) =>
    collapsing ? Math.max(0, Math.min(1, y / intro)) : 1
  );

  // Card content-box heights (px): docked = the full rail, big = see above.
  const dockedHc = dockedHcFor(vh);
  const scales = dockedScales(dockedHc);
  const railW = scales.railW;
  const bigHc = Math.min(dockedHc, Math.max(dockedHc * BIG_CARD_RATIO, BIG_MIN_HC));

  // The big card is centred in the container (cardX) when the aspect cap makes
  // it narrower than the container. The right column's offset is the card's
  // right edge beyond its docked width (cardX + cardWidth - railW): both sides
  // are linear in dock, so contentLeft - cardRight stays exactly the grid gap.
  // Numeric (px) so the hero can do position math off cardWidth without
  // calc-string nesting.
  const fullW = Math.max(railW, Math.min(iw || 1280, 1400) - CONTAINER_PAD);
  const bigCardW = Math.max(
    railW,
    Math.min(fullW, (bigHc + 2 * HERO_PAD) * BIG_MAX_ASPECT)
  );
  const shift = (fullW - bigCardW) / 2;
  const cardWidth = useTransform(dock, [0, 1], [bigCardW, railW]);
  const cardX = useTransform(dock, [0, 1], [shift, 0]);
  const contentX = useTransform(dock, [0, 1], [shift + bigCardW - railW, 0]);

  // Fade in over the collapse range. (Vertical hold is native sticky in page.tsx,
  // not a transform — transforms lag native scroll and visibly jitter.)
  const contentOpacity = useTransform(scrollY, [0, intro], [0, 1], { clamp: true });

  return {
    enabled,
    dock,
    dockedHc,
    scales,
    bigHc,
    cardWidth,
    cardX,
    bigCardW,
    contentX,
    contentOpacity,
  };
}
