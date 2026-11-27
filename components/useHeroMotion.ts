"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

/* Single source of truth for the hero-collapse motion. Both the hero card
   (Herov2) and the right column (page.tsx) call this so the card's width and
   the content's x-offset are derived from the EXACT same formula — that's what
   keeps the gap between them constant and the content out from behind the card. */

// Tunables.
export const RAIL_W = 400; // docked card width, matches the grid track max
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

// Horizontal padding outside the max-w container (lg:px-8) — used to size EXTRA.
const CONTAINER_PAD = 64; // 2 * 2rem

// `collapsing` is true only on the home page. Everywhere else the rail is the
// same card pinned at dock = 1 (no scroll choreography), so subpages show
// exactly the docked state the home page ends on.
export function useHeroMotion(collapsing = true) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [vh, setVh] = useState(0);
  const [iw, setIw] = useState(0);

  // Morph only on lg+ with motion allowed; else static (mobile / reduced-motion).
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

  // Window scroll is reliably 0 at the very top. dock: 0 = big, 1 = docked.
  const { scrollY } = useScroll();
  const intro = (vh || 800) * COLLAPSE_VH;
  const dock = useTransform(scrollY, (y) =>
    collapsing ? Math.max(0, Math.min(1, y / intro)) : 1
  );

  // Card content-box heights (px): docked = the full rail, big = see above.
  const dockedHc = (vh || 800) - NAVBAR - 2 * HERO_PAD;
  const bigHc = Math.min(dockedHc, Math.max(dockedHc * BIG_CARD_RATIO, BIG_MIN_HC));

  // The big card is centred in the container (cardX) when the aspect cap makes
  // it narrower than the container. The right column's offset is the card's
  // right edge beyond its docked width (cardX + cardWidth - RAIL_W): both sides
  // are linear in dock, so contentLeft - cardRight stays exactly the grid gap.
  // Numeric (px) so the hero can do position math off cardWidth without
  // calc-string nesting.
  const fullW = Math.max(RAIL_W, Math.min(iw || 1280, 1400) - CONTAINER_PAD);
  const bigCardW = Math.max(
    RAIL_W,
    Math.min(fullW, (bigHc + 2 * HERO_PAD) * BIG_MAX_ASPECT)
  );
  const shift = (fullW - bigCardW) / 2;
  const cardWidth = useTransform(dock, [0, 1], [bigCardW, RAIL_W]);
  const cardX = useTransform(dock, [0, 1], [shift, 0]);
  const contentX = useTransform(dock, [0, 1], [shift + bigCardW - RAIL_W, 0]);

  // Fade in over the collapse range. (Vertical hold is native sticky in page.tsx,
  // not a transform — transforms lag native scroll and visibly jitter.)
  const contentOpacity = useTransform(scrollY, [0, intro], [0, 1], { clamp: true });

  return {
    enabled,
    dock,
    dockedHc,
    bigHc,
    cardWidth,
    cardX,
    bigCardW,
    contentX,
    contentOpacity,
  };
}
