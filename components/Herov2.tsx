"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useTransform } from "framer-motion";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { c } from "@/components/palette";
import {
  PORTRAIT_BIG,
  PORTRAIT_SMALL,
  RAIL_W,
  useHeroMotion,
} from "@/components/useHeroMotion";

/* Seamless hero. The card width + height, the portrait (size + right→top
   position) and the text/buttons are all interpolated continuously from `dock`
   (0 = big 2-col hero, 1 = docked vertical card) — no container-query snapping.
   On mobile / reduced-motion it renders as a plain static vertical card. */

const PAD = 28; // card inset (matches the absolute children's top/left/bottom)
const NAVBAR = 112; // 7rem — the rail height is calc(100vh - 7rem)
const BIG_CARD_RATIO = 0.75; // big card height as a fraction of the docked (full) height
const BIG_BTN_W = 590; // cap on the big-state row: fits 4 buttons (basis-8em) in one tidy line
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CURRENTLY = [
  "building this site, in the open",
  "learning low-latency systems",
  "reading about market microstructure",
  "shipping side projects",
];

/* Rotating "currently:" status — specific, not generic role-cycling. */
const CurrentlyLine = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % CURRENTLY.length), 3200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span
      className="relative inline-flex h-[1.4em] overflow-hidden align-bottom"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="whitespace-nowrap"
          style={{ color: c.text }}
          initial={reduce ? false : { y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {CURRENTLY[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

type ActionProps = { href: string; label: string; icon: React.ReactNode };

const Action = ({ href, label, icon }: ActionProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="group flex flex-1 basis-[8em] items-center justify-center gap-[0.5em] rounded-lg border px-[0.9em] py-[0.7em] text-[0.85em] font-medium transition-colors"
    style={{ borderColor: c.line, color: c.muted, background: c.surface2 }}
  >
    <span className="text-[1.1em] transition-colors group-hover:text-[#DB5461]">
      {icon}
    </span>
    <span className="transition-colors group-hover:text-[#ECECEA]">{label}</span>
  </motion.a>
);

/* Portrait art — a red SQUARE pinned to the bottom of the box, with the cutout
   sitting on it so the head/hair pokes out above the square on the dark bg.
   object-cover fills the frame (no invisible gap above the hair). */
const PortraitArt = () => (
  <>
    <div
      className="absolute inset-x-0 bottom-0 aspect-square rounded-xl border"
      style={{ borderColor: c.line, background: "#DB5461" }}
    />
    <Image
      src="/portrait.png"
      alt="Portrait of Jack Preston"
      fill
      priority
      className="z-10 object-cover object-bottom"
    />
  </>
);

/* Headline (no buttons) — em-relative so it scales with the wrapper font-size. */
const Headline = () => (
  <>
    <p
      className="mb-[0.4em] font-mono text-[0.72em] tracking-wide"
      style={{ color: c.muted }}
    >
      Hello, I&apos;m
    </p>
    <h1
      className="text-[4.2em] font-bold leading-[0.9] tracking-tight"
      style={{ color: c.text }}
    >
      <span className="block whitespace-nowrap">Jack</span>
      <span className="block whitespace-nowrap">
        Preston<span style={{ color: c.accent }}>.</span>
      </span>
    </h1>
    <p className="mt-[0.8em] text-[0.95em] leading-relaxed" style={{ color: c.muted }}>
      Third-year BE(Hons) &amp; BCom student at the University of Auckland.
    </p>
    <p className="mt-[0.3em] text-[0.95em] leading-relaxed" style={{ color: c.muted }}>
      Currently <CurrentlyLine />
    </p>
  </>
);

/* Action buttons — one row when wide, wraps to 2×2 as the column narrows. */
const ButtonRow = () => (
  <div className="flex flex-wrap gap-[0.6em]">
    <Action href="/cv.pdf" label="CV" icon={<FiDownload />} />
    <Action href="/transcript.pdf" label="Transcript" icon={<FiFileText />} />
    <Action
      href="https://github.com/jpreston05"
      label="GitHub"
      icon={<FaGithub />}
    />
    <Action
      href="https://www.linkedin.com/in/jackdpreston/"
      label="LinkedIn"
      icon={<FaLinkedin />}
    />
  </div>
);

export const Hero = () => {
  const { enabled, dock, vh, cardWidth } = useHeroMotion();

  // Card content-box height GROWS from a shorter big card to the full rail
  // height as it docks; the geometry below reads hcAt(d), not a fixed Hc.
  const pwSmall = PORTRAIT_SMALL;
  const dockedHc = (vh || 800) - NAVBAR - 2 * PAD; // full rail content height
  const bigHc = dockedHc * BIG_CARD_RATIO; // shorter big card
  const hcAt = (d: number) => lerp(bigHc, dockedHc, d);
  // Big portrait sized so the CENTRED red square + its hair overhang (~0.167·w
  // above, from the 6/7 frame) still clears the top of the big card.
  const pwBig = Math.min(PORTRAIT_BIG, (bigHc / 2 - 10) / 0.667);

  const phase = (d: number, a: number, b: number) =>
    Math.max(0, Math.min(1, (d - a) / (b - a)));
  // smootherstep — eases a 0→1 ramp so the glide has no hard start/stop.
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  // Portrait shrinks over the first ~0.72 (still overlaps the slide → diagonal),
  // small enough early that the text can drop fully below it before it centres.
  const pwAt = (d: number) => lerp(pwBig, pwSmall, ease(phase(d, 0, 0.72)));
  // Portrait's current left edge (content-box coords) — the across overlaps the
  // shrink/rise so it travels diagonally, not "up then across".
  const portraitLeftAt = (d: number, Wc: number) => {
    const pw = pwAt(d);
    return lerp(Wc - pw /* right */, (Wc - pw) / 2 /* centre */, ease(phase(d, 0.25, 1)));
  };

  // Headline glides between FIXED endpoints (monotonic — no bob).
  const dockedY = pwSmall * 1.25 + 12; // headline top sits just below docked portrait
  const bigY = Math.max(PAD, (bigHc - 350) / 2); // centre the whole headline+buttons block
  const dockedW = RAIL_W - 2 * PAD; // docked text/button column width (344)

  const cardHeight = useTransform(dock, (d) => hcAt(d) + 2 * PAD);
  const portraitW = useTransform(dock, pwAt);
  const portraitY = useTransform(dock, (d) => {
    // Centre the RED SQUARE (not the 6/7 frame): the square's centre sits 0.667·w
    // below the frame top (~0.167·w hair overhang + half the square).
    const centerY = Math.max(0, hcAt(d) / 2 - 0.667 * pwAt(d));
    return lerp(centerY, 0, ease(phase(d, 0, 0.6))); // rise overlaps the shrink/slide
  });
  const portraitX = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    portraitLeftAt(d, w - 2 * PAD)
  );

  // Headline drops below the portrait EARLY (by ~0.62, before the portrait
  // centres) so a stable-width text block never collides with it.
  const headlineYAt = (d: number) => lerp(bigY, dockedY, ease(phase(d, 0.25, 0.66)));
  const headlineY = useTransform(dock, headlineYAt);
  // Width scales WITH the font (20→16) so the blurb keeps the exact same 2-line
  // wrap at every size — final composition from the start, never re-wraps.
  // (The name is whitespace-nowrap, so the column width doesn't affect it.)
  const headlineW = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    Math.min(w - 2 * PAD, lerp(dockedW * 1.25, dockedW, d))
  );

  // Buttons GLIDE down to the card floor, but never above the headline's bottom
  // (so they can't collide). HEADLINE_H tracks the real text height as it scales
  // with the font (taller big name → shorter docked) — generous in big to clear
  // the text, smaller mid so the buttons still fit the shorter growing card.
  const headlineHAt = (d: number) => lerp(295, 235, d);
  const BTN_BLOCK = 90; // ~2 rows of buttons
  const buttonsTopV = useTransform(dock, (d) => {
    const belowHeadline = headlineYAt(d) + headlineHAt(d) + 16;
    const floorTop = hcAt(d) - BTN_BLOCK; // floor grows with the card
    return lerp(belowHeadline, floorTop, ease(phase(d, 0.2, 0.85)));
  });
  // Buttons width shrinks MONOTONICALLY from the big one-row cap to the docked
  // column — so they wrap 4×1 → 2×2 exactly once and never flip back.
  const buttonsW = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    Math.min(w - 2 * PAD, lerp(BIG_BTN_W, dockedW, ease(phase(d, 0.25, 0.85))))
  );
  // Whole text block scales as it docks (children are em-relative).
  const textFont = useTransform(dock, [0, 1], [20, 16]);

  return (
    <motion.div
      className={
        enabled
          ? "relative shrink-0 overflow-hidden rounded-2xl border"
          : "w-full max-w-md rounded-2xl border p-6"
      }
      style={{
        borderColor: c.line,
        background: c.surface,
        ...(enabled ? { width: cardWidth, height: cardHeight } : {}),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      {enabled ? (
        <>
          <motion.div
            className="absolute aspect-[6/7] overflow-hidden rounded-xl"
            style={{
              top: PAD,
              left: PAD,
              width: portraitW,
              x: portraitX,
              y: portraitY,
            }}
          >
            <PortraitArt />
          </motion.div>

          {/* Headline — glides straight down to its docked spot (monotonic). */}
          <motion.div
            className="absolute flex flex-col"
            style={{
              top: PAD,
              left: PAD,
              width: headlineW,
              y: headlineY,
              fontSize: textFont,
            }}
          >
            <Headline />
          </motion.div>

          {/* Buttons — glide down to the floor, always kept below the headline. */}
          <motion.div
            className="absolute"
            style={{
              top: PAD,
              left: PAD,
              width: buttonsW,
              fontSize: textFont,
              y: buttonsTopV,
            }}
          >
            <ButtonRow />
          </motion.div>
        </>
      ) : (
        <div className="flex flex-col text-base">
          <div
            className="relative mx-auto aspect-[6/7] w-full max-w-[280px] overflow-hidden rounded-xl"
          >
            <PortraitArt />
          </div>
          <div className="mt-6">
            <Headline />
          </div>
          <div className="mt-6">
            <ButtonRow />
          </div>
        </div>
      )}
    </motion.div>
  );
};
