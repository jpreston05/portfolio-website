"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { c } from "@/components/palette";
import {
  PORTRAIT_BIG,
  PORTRAIT_SMALL,
  useHeroMotion,
} from "@/components/useHeroMotion";

/* Seamless hero. The card width, the portrait (size + right→top position) and the
   text (column → full width) are all interpolated continuously from `dock` (0 = big
   2-col hero, 1 = docked vertical card) — no container-query snapping. On mobile /
   reduced-motion it renders as a plain static vertical card. */

const PAD = 28; // card inset (matches the absolute children's top/left/bottom)
const GAP = 40; // space between the text column and the portrait in the big state
const NAVBAR = 112; // 7rem — the rail height is calc(100vh - 7rem)
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
    <span className="text-[1.1em] transition-colors group-hover:text-[#4ADE80]">
      {icon}
    </span>
    <span className="transition-colors group-hover:text-[#ECECEA]">{label}</span>
  </motion.a>
);

/* Portrait art — the red panel + the cutout image, fills its container. */
const PortraitArt = () => (
  <>
    <div
      className="absolute inset-x-0 bottom-0 h-[85%] rounded-xl border"
      style={{ borderColor: c.line, background: "#DB5461" }}
    />
    <Image
      src="/portrait.png"
      alt="Portrait of Jack Preston"
      fill
      priority
      className="z-10 object-contain object-bottom"
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
      className="text-[3.4em] font-bold leading-[0.9] tracking-tight"
      style={{ color: c.text }}
    >
      <span className="block whitespace-nowrap">Jack</span>
      <span className="block whitespace-nowrap">Preston</span>
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

  // Portrait big size is capped so it never overflows the card height.
  const pwSmall = PORTRAIT_SMALL;
  const Hc = (vh || 800) - NAVBAR - 2 * PAD; // card content-box height
  const pwBig = Math.min(PORTRAIT_BIG, (Hc / 1.25) * 0.92);

  // Two-phase choreography so the portrait never crosses over the text:
  //  phase 1 (d 0→~0.55): portrait shrinks + rises to the top, staying RIGHT;
  //                        text stays a full-height left column.
  //  phase 2 (d ~0.5→1):  portrait slides left to center (now at the top); the
  //                        text widens to full and drops below it.
  const phase = (d: number, a: number, b: number) =>
    Math.max(0, Math.min(1, (d - a) / (b - a)));
  // smootherstep — eases a 0→1 ramp so the glide has no hard start/stop.
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  // Portrait shrinks across almost the whole scroll (NOT front-loaded) so the
  // scale runs at the same time as the move → a single diagonal glide.
  const pwAt = (d: number) => lerp(pwBig, pwSmall, ease(phase(d, 0, 0.9)));
  // Portrait's current left edge (content-box coords) — the across overlaps the
  // shrink/rise so it travels diagonally, not "up then across".
  const portraitLeftAt = (d: number, Wc: number) => {
    const pw = pwAt(d);
    return lerp(Wc - pw /* right */, (Wc - pw) / 2 /* centre */, ease(phase(d, 0.25, 1)));
  };

  // Headline glides between FIXED endpoints (monotonic — no bob).
  const dockedY = pwSmall * 1.25 + 26; // headline top sits just below docked portrait
  const bigY = Math.max(PAD, (Hc - 220) / 2); // vertically centered when big

  const portraitW = useTransform(dock, pwAt);
  const portraitY = useTransform(dock, (d) => {
    const ph = pwAt(d) * 1.25;
    const centerY = Math.max(0, (Hc - ph) / 2);
    return lerp(centerY, 0, ease(phase(d, 0, 0.6))); // rise overlaps the shrink/slide
  });
  const portraitX = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    portraitLeftAt(d, w - 2 * PAD)
  );

  // Headline: glide down (fixed targets); width hugs the moving portrait's left
  // edge (always clear of it) then widens to full late, once it's small + at top.
  const headlineYAt = (d: number) => lerp(bigY, dockedY, ease(phase(d, 0.1, 0.8)));
  const headlineY = useTransform(dock, headlineYAt);
  const headlineW = useTransform([dock, cardWidth], ([d, w]: number[]) => {
    const Wc = w - 2 * PAD;
    const beside = Math.max(120, portraitLeftAt(d, Wc) - GAP);
    return lerp(beside, Wc, ease(phase(d, 0.72, 1)));
  });

  // Buttons GLIDE down to the card floor, but never above the headline's bottom
  // (so they can't collide) — they ease from just-below-headline to the floor.
  const HEADLINE_H = 210; // generous estimate of the headline block height
  const BTN_BLOCK = 90; // ~2 rows of buttons
  const floorTop = Hc - BTN_BLOCK;
  const buttonsTopV = useTransform(dock, (d) => {
    const belowHeadline = headlineYAt(d) + HEADLINE_H + 16;
    return lerp(belowHeadline, floorTop, ease(phase(d, 0.2, 0.95)));
  });
  // Buttons sit BELOW the (risen) portrait, so their width only hugs it at the
  // very start, then widens early to full — never narrow enough to stack 1-up.
  const buttonsW = useTransform([dock, cardWidth], ([d, w]: number[]) => {
    const Wc = w - 2 * PAD;
    const beside = portraitLeftAt(d, Wc) - GAP; // left of portrait until it rises
    const widened = lerp(beside, Wc, ease(phase(d, 0.5, 0.78)));
    return Math.max(widened, Math.min(Wc, 260)); // ≥ ~2-button width
  });
  // Whole text block scales as it docks (children are em-relative).
  const textFont = useTransform(dock, [0, 1], [20, 16]);

  return (
    <motion.div
      data-testid="hero-card"
      className={
        enabled
          ? "relative shrink-0 overflow-hidden rounded-2xl border lg:h-[calc(100vh-7rem)]"
          : "w-full max-w-md rounded-2xl border p-6"
      }
      style={{
        borderColor: c.line,
        background: c.surface,
        ...(enabled ? { width: cardWidth } : {}),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      {enabled ? (
        <>
          <motion.div
            data-testid="hero-portrait"
            className="absolute aspect-[4/5] overflow-hidden rounded-xl"
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
            data-testid="hero-text"
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
            data-testid="hero-buttons"
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
            data-testid="hero-portrait"
            className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-xl"
          >
            <PortraitArt />
          </div>
          <div data-testid="hero-text" className="mt-6">
            <Headline />
          </div>
          <div data-testid="hero-buttons" className="mt-6">
            <ButtonRow />
          </div>
        </div>
      )}
    </motion.div>
  );
};
