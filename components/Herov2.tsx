"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { c } from "@/components/palette";
import {
  PORTRAIT_BIG,
  PORTRAIT_SMALL,
  RAIL_W,
  useHeroMotion,
} from "@/components/useHeroMotion";
import { EASE_SNAPPY } from "@/lib/motion";

/* Seamless hero. The card width + height, the portrait (size + right→top
   position) and the text/buttons are all interpolated continuously from `dock`
   (0 = big 2-col hero, 1 = docked vertical card) — no container-query snapping.
   On mobile / reduced-motion it renders as a plain static vertical card. */

const PAD = 28; // card inset (matches the absolute children's top/left/bottom)
const NAVBAR = 128; // 8rem — matches the rail: top-26 (104px) + 24px bottom gap
const BIG_CARD_RATIO = 0.68; // big card height as a fraction of the docked (full) height
const NAME_EM_DOCKED = 4.2; // display-name size (em of the text wrapper) when docked
const NAME_EM_BIG_MAX = 5.2; // poster-size ceiling for the big state
const BIG_BTN_W = 590; // cap on the big-state row: fits 4 buttons (basis-8em) in one tidy line
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CURRENTLY = [
  "building this site, in the open",
  "applying for summer internships",
  "starting that leetcode grind",
  "building passion projects",
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

  // Crossfade + slight blur (no vertical travel — nothing to clip, and the
  // text keeps its natural inline baseline next to "Currently").
  // Deliberately NOT aria-live: announcing a decorative rotation every few
  // seconds is noise for screen reader users; they get the current item.
  return (
    <span>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="inline-block whitespace-nowrap"
          style={{ color: "var(--hero-ink)" }}
          initial={reduce ? false : { opacity: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.3, ease: EASE_SNAPPY }}
        >
          {CURRENTLY[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  download?: string; // set ⇒ downloads (with this filename) instead of opening a tab
};

const Action = ({ href, label, icon, download }: ActionProps) => (
  <motion.a
    href={href}
    download={download}
    target={download ? undefined : "_blank"}
    rel={download ? undefined : "noreferrer"}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="group flex flex-1 basis-[8em] items-center justify-center gap-[0.5em] rounded-lg px-[0.9em] py-[0.7em] text-[0.85em] font-medium transition-colors"
    style={{ color: c.muted, background: c.bg }}
  >
    <span className="text-[1.1em] transition-colors duration-200 group-hover:text-[#ECECEA]">
      {icon}
    </span>
    <span className="transition-colors duration-200 group-hover:text-[#ECECEA]">
      {label}
    </span>
  </motion.a>
);

/* Portrait art — a carbon SQUARE pinned to the bottom of the box, with the
   cutout sitting on it so the head/hair pokes out above the square on the pink
   card. object-cover fills the frame (no invisible gap above the hair). */
const PortraitArt = () => (
  <>
    <div
      className="absolute inset-x-0 bottom-0 aspect-square rounded-xl"
      style={{ background: "var(--hero-square)" }}
    />
    <Image
      src="/portrait.png"
      alt="Portrait of Jack Preston"
      fill
      priority
      sizes="(min-width: 1024px) 560px, 280px"
      className="z-10 object-cover object-bottom"
    />
  </>
);

/* Entrance choreography — runs once, gated on the Preloader's reveal
   (`revealed` prop). Items rise in sequence. Only orchestrated in the morphing
   branch; in the static branch these variants are inert (no parent animate),
   and reduced-motion users always get the static branch anyway. */
const entranceGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const entranceItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SNAPPY },
  },
};

/* Headline (no buttons) — em-relative so it scales with the wrapper font-size.
   The name reads its size from --hero-name (poster-big → docked). */
const Headline = () => (
  <>
    <motion.p
      variants={entranceItem}
      className="mb-[0.4em] font-mono text-[0.72em] tracking-wide"
      style={{ color: "var(--hero-sub)" }}
    >
      Hello, I&apos;m
    </motion.p>
    <h1
      className="font-bold leading-[0.9] tracking-tight"
      style={{
        color: "var(--hero-ink)",
        fontSize: "calc(var(--hero-name, 4.2) * 1em)",
      }}
    >
      <motion.span variants={entranceItem} className="block whitespace-nowrap">
        Jack
      </motion.span>
      <motion.span variants={entranceItem} className="block whitespace-nowrap">
        Preston<span style={{ color: "var(--hero-dot)" }}>.</span>
      </motion.span>
    </h1>
    <motion.p
      variants={entranceItem}
      className="mt-[0.8em] text-[0.95em] leading-relaxed"
      style={{ color: "var(--hero-sub)" }}
    >
      Third-year BE(Hons) &amp; BCom student at the University of Auckland.
    </motion.p>
    <motion.p
      variants={entranceItem}
      className="mt-[0.3em] text-[0.95em] leading-relaxed"
      style={{ color: "var(--hero-sub)" }}
    >
      Currently <CurrentlyLine />
    </motion.p>
  </>
);

/* Action buttons — one row when wide, wraps to 2×2 as the column narrows. */
const ButtonRow = () => (
  <div className="flex flex-wrap gap-[0.6em]">
    <Action
      href="/Jack-Preston-CV.pdf"
      label="CV"
      icon={<FiDownload />}
      download="Jack-Preston-CV.pdf"
    />
    <Action
      href="/Jack-Preston-Transcript.pdf"
      label="Transcript"
      icon={<FiFileText />}
      download="Jack-Preston-Transcript.pdf"
    />
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

export const Hero = ({ revealed = true }: { revealed?: boolean }) => {
  const { enabled, dock, vh, cardWidth, bigCardW } = useHeroMotion();

  // Dye-on-dock: at the top the card is DARK with the pink held in the portrait
  // square + the full stop (the original accent discipline); scrolling dyes the
  // card pink while the square inverts to carbon — a figure-ground inversion
  // that "creates" the docked brand mark. The card/square dye gets a long ramp
  // (the visible story); the text swaps steeply at the crossover so the
  // mid-tone low-contrast window is a transient blink. Children consume these
  // as CSS vars so no color needs prop-drilling into Headline/PortraitArt.
  const cardBg = useTransform(dock, [0.2, 0.8], [c.surface, c.accent]);
  const squareBg = useTransform(dock, [0.2, 0.8], [c.accent, c.bg]);
  const inkColor = useTransform(dock, [0.42, 0.58], [c.text, c.heroInk]);
  const subColor = useTransform(dock, [0.42, 0.58], [c.muted, c.heroMuted]);
  const dotColor = useTransform(dock, [0.42, 0.58], [c.accent, c.heroMuted]);
  const focusColor = useTransform(dock, [0.42, 0.58], [c.accent, c.heroInk]);
  // Big-state-only dressing fades away as the card docks.
  const watermarkOpacity = useTransform(dock, [0.3, 0.7], [1, 0]);
  const cueOpacity = useTransform(dock, [0, 0.08], [1, 0]);

  // Card content-box height GROWS from a shorter big card to the full rail
  // height as it docks; the geometry below reads hcAt(d), not a fixed Hc.
  const dockedHc = (vh || 800) - NAVBAR - 2 * PAD; // full rail content height
  const bigHc = dockedHc * BIG_CARD_RATIO; // shorter big card
  const hcAt = (d: number) => lerp(bigHc, dockedHc, d);

  // Short-viewport guard: the docked stack (portrait + headline + buttons, all
  // of which scale with `s`) must fit dockedHc — on ~768-800px-tall laptops it
  // doesn't at full size and the buttons clipped the "Currently" line. Scale
  // the docked portrait + type down just enough to fit; ≥ ~860px viewports get
  // s = 1 and are pixel-identical. (312.5/235/90 are the portrait block,
  // docked headline and button block heights at s = 1; 12/16 the fixed gaps.)
  const DOCKED_STACK = PORTRAIT_SMALL * 1.25 + 235 + 90;
  const DOCKED_GAPS = 12 + 16 + 8; // portrait→headline, headline→buttons, slack
  const s = Math.min(1, Math.max(0.78, (dockedHc - DOCKED_GAPS) / DOCKED_STACK));
  const pwSmall = PORTRAIT_SMALL * s;

  // Poster name: as large as the big card's height allows. Estimated big-state
  // block height at font 20 ≈ 215 + 36·nameEm (eyebrow + 2 name lines + blurb +
  // currently + gap + one button row); keep it inside bigHc with ~40px margin.
  const nameEmBig = Math.min(
    NAME_EM_BIG_MAX,
    Math.max(NAME_EM_DOCKED, (bigHc - 255) / 36)
  );
  const nameEm = useTransform(dock, [0, 0.66], [nameEmBig, NAME_EM_DOCKED]);
  // Big portrait sized so (a) the CENTRED square + its hair overhang (~0.167·w
  // above, from the 6/7 frame) still clears the top of the big card, and (b) it
  // clears the one-row button cap horizontally (16px gap) — no chip overlap.
  const pwBig = Math.min(
    PORTRAIT_BIG,
    (bigHc / 2 - 10) / 0.667,
    bigCardW - 2 * PAD - BIG_BTN_W - 16
  );

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
  // Centre the whole headline+buttons block (height tracks the poster name size).
  const bigBlockH = 215 + 36 * nameEmBig;
  const bigY = Math.max(PAD, (bigHc - bigBlockH) / 2);
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
  // with the font (poster-big name → shorter docked) — the big value derives
  // from nameEmBig (eyebrow + 2 name lines + blurb + currently ≈ 145 + 36·em).
  const headlineHAt = (d: number) => lerp(145 + 36 * nameEmBig, 235 * s, d);
  const BTN_BLOCK = 90 * s; // ~2 rows of buttons at the docked font size
  const buttonsTopV = useTransform(dock, (d) => {
    const belowHeadline = headlineYAt(d) + headlineHAt(d) + 16;
    const floorTop = hcAt(d) - BTN_BLOCK; // floor grows with the card
    // Math.max ENFORCES the never-above-the-headline rule — on short viewports
    // the mid-collapse floor sits higher than the still-tall headline block and
    // the un-clamped lerp used to pull the buttons up through the text.
    return Math.max(lerp(belowHeadline, floorTop, ease(phase(d, 0.2, 0.85))), belowHeadline);
  });
  // Buttons width shrinks MONOTONICALLY from the big one-row cap to the docked
  // column — so they wrap 4×1 → 2×2 exactly once and never flip back.
  const buttonsW = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    Math.min(w - 2 * PAD, lerp(BIG_BTN_W, dockedW, ease(phase(d, 0.25, 0.85))))
  );
  // Whole text block scales as it docks (children are em-relative); the docked
  // size shrinks with `s` on short viewports so the stack fits the card.
  const textFont = useTransform(dock, [0, 1], [20, 16 * s]);

  return (
    <>
    <motion.div
      data-on-accent
      className={
        enabled
          ? "relative shrink-0 overflow-hidden rounded-2xl"
          : "w-full max-w-md rounded-2xl p-6"
      }
      style={{
        background: "var(--hero-card)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        ...(enabled
          ? {
              width: cardWidth,
              height: cardHeight,
              "--hero-card": cardBg,
              "--hero-square": squareBg,
              "--hero-ink": inkColor,
              "--hero-sub": subColor,
              "--hero-dot": dotColor,
              "--hero-focus": focusColor,
              "--hero-name": nameEm,
            }
          : {
              // Static variant (mobile / reduced-motion): the docked look.
              "--hero-card": c.accent,
              "--hero-square": c.bg,
              "--hero-ink": c.heroInk,
              "--hero-sub": c.heroMuted,
              "--hero-dot": c.heroMuted,
              "--hero-focus": c.heroInk,
              "--hero-name": NAME_EM_DOCKED,
            }),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      {enabled ? (
        <>
          {/* Monogram watermark — tone-on-tone poster crop, gone by mid-dye. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-2 select-none font-black leading-none tracking-tight"
            style={{
              fontSize: textFont,
              color: "rgba(236,236,234,0.04)",
              opacity: watermarkOpacity,
            }}
          >
            <span className="block translate-y-[0.28em] text-[12em]">JP.</span>
          </motion.div>

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
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, y: 10 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_SNAPPY, delay: 0.5 }}
            >
              <PortraitArt />
            </motion.div>
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
            <motion.div
              className="flex flex-col"
              variants={entranceGroup}
              initial="hidden"
              animate={revealed ? "show" : "hidden"}
            >
              <Headline />
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_SNAPPY, delay: 0.6 }}
            >
              <ButtonRow />
            </motion.div>
          </motion.div>
        </>
      ) : (
        // Base font scales with the viewport on small phones so the em-relative
        // name (Preston. is whitespace-nowrap) can't overflow the card below
        // ~360px; capped at 16px so larger screens are unaffected.
        <div className="flex flex-col text-[clamp(13px,4.2vw,16px)]">
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

    {/* Scroll cue — invites the scroll that triggers the dye-on-dock signature;
        fades the instant scrolling starts. Fixed to the viewport bottom-centre. */}
    {enabled && (
      <motion.div
        aria-hidden
        className="pointer-events-none fixed bottom-8 left-1/2 z-20 -translate-x-1/2"
        style={{ opacity: cueOpacity }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: c.muted }}
          >
            scroll
          </span>
          <span className="relative h-6 w-px" style={{ background: c.line }}>
            <span
              className="animate-cue absolute -left-[1.5px] top-0 h-1 w-1 rounded-full"
              style={{ background: c.accent }}
            />
          </span>
        </motion.div>
      </motion.div>
    )}
    </>
  );
};
