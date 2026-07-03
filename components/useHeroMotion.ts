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

// Horizontal padding outside the max-w container (lg:px-8) — used to size EXTRA.
const CONTAINER_PAD = 64; // 2 * 2rem

export function useHeroMotion() {
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
  const dock = useTransform(scrollY, [0, intro], [0, 1], { clamp: true });

  // The card's overflow beyond its docked width. EXTRA appears in both cardWidth
  // and contentX so contentLeft - cardRight stays exactly the grid gap. Numeric
  // (px) so the hero can do position math off cardWidth without calc-string nesting.
  const extra = Math.max(0, Math.min(iw || 1280, 1400) - RAIL_W - CONTAINER_PAD);
  const cardWidth = useTransform(dock, [0, 1], [RAIL_W + extra, RAIL_W]);
  const contentX = useTransform(dock, [0, 1], [extra, 0]);
  // Numeric big-state card width — the hero sizes its big portrait off this so
  // the portrait and the one-row button cap never collide.
  const bigCardW = RAIL_W + extra;

  // Fade in over the collapse range. (Vertical hold is native sticky in page.tsx,
  // not a transform — transforms lag native scroll and visibly jitter.)
  const contentOpacity = useTransform(scrollY, [0, intro], [0, 1], { clamp: true });

  return { enabled, dock, vh, cardWidth, bigCardW, contentX, contentOpacity };
}
