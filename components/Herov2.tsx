"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type Variants,
} from "framer-motion";
import { FiArrowDown, FiArrowRight, FiDownload, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { c } from "@/components/palette";
import {
  COLLAPSE_VH,
  HERO_PAD,
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

const PAD = HERO_PAD; // card inset (matches the absolute children's top/left/bottom)
const BIG_MARGIN = 20; // min space above/below the big-state text block (see BIG_MIN_HC)
const NAME_EM_DOCKED = 4.2; // display-name size (em of the text wrapper) when docked
const NAME_EM_BIG_MAX = 5.2; // poster-size ceiling for the big state
const BIG_BTN_W = 590; // horizontal room reserved for the big-state CTA row (BigActions ≈ 560px)
// Headline block heights (px), measured with the 2-line status chip:
const HEADLINE_DOCKED = 281; // whole docked headline at font 16
const BIG_REST = 202; // everything except the two name lines, at font 20
// Gap between the headline block and the action buttons: roomy in the big
// hero (the stack read as cluttered at 16), tight in the docked rail.
const BTN_GAP_BIG = 36;
const BTN_GAP_DOCKED = 16;
// Docked 2×2 buttons grow into spare rail height (tall viewports only):
// BTN_GROW of the slack goes to the buttons (the rest stays as breathing room
// above them), each row capped at MAX_ROW; rows ≥ BOXY_MIN_ROW stack icon/label.
const BTN_GROW = 0.6;
const MAX_ROW = 84;
const BOXY_MIN_ROW = 64;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Static status chip under the blurb (edit here to update it).
export const STATUS = "Seeking a 2027–28 summer internship. Open to Sydney.";

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  download?: string; // set ⇒ downloads (with this filename) instead of opening a tab
};

const Action = ({
  href,
  label,
  icon,
  download,
  boxy = false,
}: ActionProps & { boxy?: boolean }) => (
  <motion.a
    href={href}
    download={download}
    target={download ? undefined : "_blank"}
    rel={download ? undefined : "noreferrer"}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className={`depth-chip group flex items-center justify-center rounded-lg px-[0.9em] font-medium transition-colors ${
      boxy ? "h-full flex-col gap-[0.45em] text-[0.85em]" : "gap-[0.5em] py-[0.7em] text-[0.85em]"
    }`}
    style={{ color: c.muted, background: c.bg }}
  >
    <span
      className={`transition-colors duration-200 group-hover:text-[#ECECEA] ${
        boxy ? "text-[1.45em]" : "text-[1.1em]"
      }`}
    >
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
const Headline = ({ home }: { home: boolean }) => {
  // The name is the page h1 only on the home page; subpages carry their own.
  const Name = home ? "h1" : "p";
  return (
  <>
    <motion.p
      variants={entranceItem}
      className="mb-[0.4em] text-[0.8em] font-medium"
      style={{ color: "var(--hero-sub)" }}
    >
      Hello, I&apos;m
    </motion.p>
    <Name
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
    </Name>
    <motion.p
      variants={entranceItem}
      className="mt-[0.8em] text-[0.95em] leading-relaxed"
      style={{ color: "var(--hero-sub)" }}
    >
      Penultimate-year BE(Hons) &amp; BCom student at the University of Auckland.
    </motion.p>
    {/* Status chip — carbon on either card state (dark surface or pink), so
        its colours are fixed rather than dye vars. Always wraps to 2 lines:
        the block width scales with the font, like the blurb above. */}
    <motion.p
      variants={entranceItem}
      className="depth-chip mt-[1.6em] flex items-start gap-[0.6em] rounded-lg px-[0.9em] py-[0.7em] text-[0.8em] font-medium leading-[1.45]"
      style={{ background: c.bg, color: c.text }}
    >
      <span
        aria-hidden
        className="mt-[0.5em] h-[0.45em] w-[0.45em] shrink-0 rounded-full"
        style={{ background: c.accent }}
      />
      {STATUS}
    </motion.p>
  </>
  );
};

const CV = { href: "/Jack-Preston-CV.pdf", file: "Jack-Preston-CV.pdf" };
const TRANSCRIPT = {
  href: "/Jack-Preston-Transcript.pdf",
  file: "Jack-Preston-Transcript.pdf",
};
const GITHUB = "https://github.com/jpreston05";
const LINKEDIN = "https://www.linkedin.com/in/jackdpreston/";

const MotionLink = motion.create(Link);

/* Icon-only squircle for the big CTA row (label lives in aria-label). */
const IconAction = ({ href, label, icon, download }: ActionProps) => (
  <motion.a
    href={href}
    aria-label={label}
    title={label}
    download={download}
    target={download ? undefined : "_blank"}
    rel={download ? undefined : "noreferrer"}
    whileHover={{ y: -2, color: c.text }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: EASE_SNAPPY }}
    className="depth-chip flex h-[2.9em] w-[2.9em] shrink-0 items-center justify-center rounded-xl"
    style={{ color: c.muted, background: c.bg }}
  >
    <span className="text-[1.15em]">{icon}</span>
  </motion.a>
);

/* Big-state CTA row — one primary action (projects), one secondary (CV), then
   the quiet icon links. Only exists at the top of the page: it fades out before
   the card dyes pink (so the pink CTA never sits on a pink card) and the
   DockedActions grid takes over. Sized in em of the 20px big-state font; the
   whole row must stay inside BIG_BTN_W. */
const BigActions = () => (
  <div className="flex items-center gap-[0.6em] whitespace-nowrap text-[0.8em]">
    <MotionLink
      href="/projects"
      whileHover={{ y: -2, filter: "brightness(1.08)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE_SNAPPY }}
      className="depth-cta flex h-[2.9em] items-center gap-[0.6em] rounded-xl px-[1.3em] font-semibold"
      style={{ background: c.accent, color: c.heroInk }}
    >
      View my projects
      <FiArrowRight aria-hidden />
    </MotionLink>
    <motion.a
      href={CV.href}
      download={CV.file}
      whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE_SNAPPY }}
      className="flex h-[2.9em] items-center gap-[0.6em] rounded-xl px-[1.2em] font-semibold"
      style={{
        color: c.text,
        boxShadow: "inset 0 0 0 1px rgba(236,236,234,0.35)",
      }}
    >
      <FiDownload aria-hidden />
      Download CV
    </motion.a>
    <span aria-hidden className="mx-[0.3em] h-[1.8em] w-px" style={{ background: c.line }} />
    <IconAction
      href={TRANSCRIPT.href}
      label="Download transcript"
      icon={<FiFileText />}
      download={TRANSCRIPT.file}
    />
    <IconAction href={GITHUB} label="GitHub" icon={<FaGithub />} />
    <IconAction href={LINKEDIN} label="LinkedIn" icon={<FaLinkedin />} />
  </div>
);

/* Docked action buttons — a fixed 2×2 grid (also the static mobile card).
   `rowH` (px) = each row's height when the docked card has spare height to
   give them (tall viewports); tall enough rows go boxy (icon above label).
   Omitted ⇒ the thin padding-sized buttons (mobile, short laptops). */
const DockedActions = ({ rowH }: { rowH?: number }) => {
  const boxy = rowH !== undefined && rowH >= BOXY_MIN_ROW;
  return (
    <div
      className="grid grid-cols-2 gap-[0.6em]"
      style={rowH ? { gridAutoRows: `${rowH}px` } : undefined}
    >
      <Action href={CV.href} label="CV" icon={<FiDownload />} download={CV.file} boxy={boxy} />
      <Action
        href={TRANSCRIPT.href}
        label="Transcript"
        icon={<FiFileText />}
        download={TRANSCRIPT.file}
        boxy={boxy}
      />
      <Action href={GITHUB} label="GitHub" icon={<FaGithub />} boxy={boxy} />
      <Action href={LINKEDIN} label="LinkedIn" icon={<FaLinkedin />} boxy={boxy} />
    </div>
  );
};

/* `home` = the collapsing hero (scroll-driven). Elsewhere the same card sits
   pinned in its docked state as the persistent left rail. */
export const Hero = ({
  revealed = true,
  home = true,
  held = false,
}: {
  revealed?: boolean;
  home?: boolean;
  held?: boolean; // on home but pinned docked (arriving from another route)
}) => {
  const { enabled, dock, dockedHc, bigHc, cardWidth, cardX, bigCardW } =
    useHeroMotion(home && !held);

  // Dye-on-dock: at the top the card is DARK with the pink held in the portrait
  // square + the full stop (the original accent discipline); scrolling dyes the
  // card pink while the square inverts to carbon — a figure-ground inversion
  // that "creates" the docked brand mark. The card/square dye gets a long ramp
  // (the visible story); the text swaps steeply at the crossover so the
  // mid-tone low-contrast window is a transient blink. Children consume these
  // as CSS vars so no color needs prop-drilling into Headline/PortraitArt.
  const cardBg = useTransform(dock, [0.2, 0.8], [c.surface, c.accent]);
  const squareBg = useTransform(dock, [0.2, 0.8], [c.accent, c.bg]);
  // Hairline ring (see --depth-hero): matches the other cards while dark, gone
  // by the time the dye is half in.
  const ringColor = useTransform(dock, [0.2, 0.5], ["rgba(255,255,255,0.07)", "rgba(255,255,255,0)"]);
  const inkColor = useTransform(dock, [0.42, 0.58], [c.text, c.heroInk]);
  const subColor = useTransform(dock, [0.42, 0.58], [c.muted, c.heroMuted]);
  const dotColor = useTransform(dock, [0.42, 0.58], [c.accent, c.heroMuted]);
  const focusColor = useTransform(dock, [0.42, 0.58], [c.accent, c.heroInk]);
  // Big-state-only dressing fades away as the card docks.
  const cueOpacity = useTransform(dock, [0, 0.08], [1, 0]);
  const cueVisibility = useTransform(dock, (d) => (d >= 0.08 ? "hidden" : "visible"));

  // Card content-box height GROWS from a shorter big card to the full rail
  // height as it docks; the geometry below reads hcAt(d), not a fixed Hc.
  // dockedHc = full rail content height; bigHc = the big card's (a ratio of the
  // rail, floored so its stack fits; see useHeroMotion). The font-scaled part of
  // that stack (headline at the docked name size + CTA row) at the 20px big
  // font; BTN_GAP_BIG is fixed px. Keep BIG_MIN_HC in sync with it.
  const BIG_STACK_EM = BIG_REST + 36 * NAME_EM_DOCKED + 54; // px at font 20
  // Rail too short for even the floor (≲680px-tall viewports): shrink the
  // big-state type until the stack fits. 1 everywhere else.
  const sb = Math.min(
    1,
    Math.max(0.8, (bigHc - BTN_GAP_BIG - 2 * BIG_MARGIN) / BIG_STACK_EM)
  );
  const bigFont = 20 * sb;
  const bigBtnW = BIG_BTN_W * sb; // the CTA row is em-sized, so it shrinks too
  const hcAt = (d: number) => lerp(bigHc, dockedHc, d);

  // Short-viewport guard: the docked stack (portrait + headline + buttons, all
  // of which scale with `s`) must fit dockedHc — on ~768-800px-tall laptops it
  // doesn't at full size and the buttons clipped the status chip. Scale the
  // docked portrait + type down just enough to fit; ≥ ~900px viewports get
  // s = 1 and are pixel-identical. (312.5/HEADLINE_DOCKED/90 are the portrait
  // block, docked headline and button block heights at s = 1; 12/16 the gaps.)
  const DOCKED_STACK = PORTRAIT_SMALL * 1.25 + HEADLINE_DOCKED + 90;
  const DOCKED_GAPS = 12 + 16 + 8; // portrait→headline, headline→buttons, slack
  const s = Math.min(1, Math.max(0.72, (dockedHc - DOCKED_GAPS) / DOCKED_STACK));
  const pwSmall = PORTRAIT_SMALL * s;

  // Poster name: as large as the big card's height allows. Estimated big-state
  // block height ≈ sb·(BIG_REST + 54 + 36·nameEm) + BTN_GAP_BIG (eyebrow + 2 name
  // lines + blurb + status chip, then gap + one button row); keep it inside
  // bigHc with BIG_MARGIN above and below.
  const nameEmBig = Math.min(
    NAME_EM_BIG_MAX,
    Math.max(
      NAME_EM_DOCKED,
      ((bigHc - BTN_GAP_BIG - 2 * BIG_MARGIN) / sb - BIG_REST - 54) / 36
    )
  );
  const nameEm = useTransform(dock, [0, 0.66], [nameEmBig, NAME_EM_DOCKED]);
  // Big portrait sized so (a) the CENTRED square + its hair overhang (~0.167·w
  // above, from the 6/7 frame) still clears the top of the big card, and (b) it
  // clears the one-row button cap horizontally (16px gap) — no chip overlap.
  const pwBig = Math.min(
    PORTRAIT_BIG,
    (bigHc / 2 - 10) / 0.667,
    bigCardW - 2 * PAD - bigBtnW - 16
  );

  const phase = (d: number, a: number, b: number) =>
    Math.max(0, Math.min(1, (d - a) / (b - a)));
  // smootherstep — eases a 0→1 ramp so the glide has no hard start/stop.
  const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  // Big-state balance: the free width beside the text column (BIG_BTN_W) and the
  // portrait is split evenly into left margin / middle gap / right margin, so
  // the pair sits centred instead of hugging the edges with a void between.
  // pwBig already guarantees free ≥ 16.
  // Text: the inset eases out over the same span as its downward glide (ends
  // 0.66), so it travels one smooth diagonal back to the card edge.
  // Portrait: the inset is a FIXED offset on its right-hand start point, never
  // faded on its own — fading it pushed the portrait right before the across
  // glide pulled it left (a visible back-and-forth). The across lerp to centre
  // absorbs it, so the portrait only ever moves one way.
  const bigInset = Math.max(0, (bigCardW - 2 * PAD - bigBtnW - pwBig) / 3);
  const textX = useTransform(dock, (d) => bigInset * (1 - ease(phase(d, 0, 0.66))));
  // Portrait shrinks over the first ~0.72 (still overlaps the slide → diagonal),
  // small enough early that the text can drop fully below it before it centres.
  const pwAt = (d: number) => lerp(pwBig, pwSmall, ease(phase(d, 0, 0.72)));
  // Portrait's current left edge (content-box coords) — the across overlaps the
  // shrink/rise so it travels diagonally, not "up then across".
  const portraitLeftAt = (d: number, Wc: number) => {
    const pw = pwAt(d);
    return lerp(Wc - pw - bigInset /* right, inset */, (Wc - pw) / 2 /* centre */, ease(phase(d, 0.25, 1)));
  };

  // Headline glides between FIXED endpoints (monotonic — no bob).
  const dockedY = pwSmall * 1.25 + 12; // headline top sits just below docked portrait
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

  // Headline height as the type scales: font 20→16·s (whole collapse) and the
  // name nameEmBig→docked (by 0.66). BIG_REST is the non-name part at font 20;
  // each name em adds 36px at font 20 (two lines at leading 0.9).
  const fontAt = (d: number) => lerp(bigFont, 16 * s, d);
  const nameEmAt = (d: number) => lerp(nameEmBig, NAME_EM_DOCKED, phase(d, 0, 0.66));
  const headlineHAt = (d: number) => fontAt(d) * (BIG_REST / 20 + 1.8 * nameEmAt(d));
  // The whole text block (headline + gap + one big button row, 54px at font 20)
  // stays CENTRED in the growing card, like the portrait, until the drop takes
  // over. Anchoring it at the top made it rise while the type shrank (a bounce).
  const centredTopAt = (d: number) => {
    const blockH = headlineHAt(d) + lerp(BTN_GAP_BIG, BTN_GAP_DOCKED, d) + 2.7 * fontAt(d);
    return Math.max(PAD, (hcAt(d) - blockH) / 2);
  };
  // Then drops below the portrait EARLY (by ~0.66, before the portrait centres)
  // so a stable-width text block never collides with it.
  const headlineYAt = (d: number) =>
    lerp(centredTopAt(d), dockedY, ease(phase(d, 0.25, 0.66)));
  const headlineY = useTransform(dock, headlineYAt);
  // Width scales WITH the font (20→16) so the blurb keeps the exact same 2-line
  // wrap at every size — final composition from the start, never re-wraps.
  // (The name is whitespace-nowrap, so the column width doesn't affect it.)
  const headlineW = useTransform([dock, cardWidth], ([d, w]: number[]) =>
    Math.min(w - 2 * PAD, lerp(dockedW * 1.25, dockedW, d))
  );

  // Buttons GLIDE down to the card floor, but never above the headline's bottom
  // (so they can't collide), using headlineHAt above.
  // Thin rows are ~40px at s = 1 (90px block incl. the 0.6em grid gap). Any
  // height the docked stack leaves over (only when s = 1, i.e. ≳910px-tall
  // viewports) partly goes to the rows, so big monitors get boxy tiles.
  const gridGap = 0.6 * 16 * s;
  const thinRow = (90 * s - gridGap) / 2;
  const dockedSlack = Math.max(0, dockedHc - DOCKED_GAPS - s * DOCKED_STACK);
  const rowH = Math.min(MAX_ROW, thinRow + (dockedSlack * BTN_GROW) / 2);
  const BTN_BLOCK = 2 * rowH + gridGap;
  const buttonsTopV = useTransform(dock, (d) => {
    const belowHeadline =
      headlineYAt(d) + headlineHAt(d) + lerp(BTN_GAP_BIG, BTN_GAP_DOCKED, d);
    const floorTop = hcAt(d) - BTN_BLOCK; // floor grows with the card
    // Math.max ENFORCES the never-above-the-headline rule — on short viewports
    // the mid-collapse floor sits higher than the still-tall headline block and
    // the un-clamped lerp used to pull the buttons up through the text.
    return Math.max(lerp(belowHeadline, floorTop, ease(phase(d, 0.2, 0.85))), belowHeadline);
  });
  // Two button layers share this block: the big CTA row fades out early
  // (before the dye reaches it) and the docked 2×2 grid fades in once the card
  // is mostly pink. Whichever is invisible is `inert` (no focus, no clicks).
  const bigActionsOpacity = useTransform(dock, [0.15, 0.35], [1, 0]);
  // (Not before ~0.6: earlier, the still-shrinking headline pushes the grid
  // below the card floor and it fades in clipped.)
  const dockedActionsOpacity = useTransform(dock, [0.62, 0.82], [0, 1]);
  const [actionsDocked, setActionsDocked] = useState(() => dock.get() > 0.55);
  useMotionValueEvent(dock, "change", (d) => setActionsDocked(d > 0.55));
  // Whole text block scales as it docks (children are em-relative); the docked
  // size shrinks with `s` on short viewports so the stack fits the card.
  const textFont = useTransform(dock, [0, 1], [bigFont, 16 * s]);

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
        boxShadow: "var(--depth-hero)",
        ...(enabled
          ? {
              width: cardWidth,
              height: cardHeight,
              x: cardX,
              "--hero-card": cardBg,
              "--hero-ring": ringColor,
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
              x: textX,
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
              <Headline home={home} />
            </motion.div>
          </motion.div>

          {/* Buttons — glide down to the floor, always kept below the headline. */}
          <motion.div
            className="absolute"
            style={{
              top: PAD,
              left: PAD,
              width: dockedW,
              fontSize: textFont,
              x: textX,
              y: buttonsTopV,
            }}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={revealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_SNAPPY, delay: 0.6 }}
            >
              {/* Big row overflows the docked-width block to the right (nowrap,
                  ≤ BIG_BTN_W, which pwBig keeps clear of the portrait). */}
              <motion.div
                className="absolute left-0 top-0"
                style={{ opacity: bigActionsOpacity }}
                inert={actionsDocked}
              >
                <BigActions />
              </motion.div>
              <motion.div
                style={{ opacity: dockedActionsOpacity }}
                inert={!actionsDocked}
              >
                <DockedActions rowH={rowH} />
              </motion.div>
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
            <Headline home={home} />
          </div>
          <div className="mt-6">
            <DockedActions />
          </div>
        </div>
      )}
    </motion.div>

    {/* Scroll cue — a bobbing squircle button that plays the dye-on-dock
        collapse when pressed; fades the instant scrolling starts, then leaves
        the tab order + hit-testing entirely (visibility). Fixed bottom-centre.
        Three nested layers so the transforms never share an element: fixed
        centring (class) → bob (CSS keyframe) → hover/tap scale (framer). */}
    {enabled && home && (
      <motion.div
        className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2"
        style={{ opacity: cueOpacity, visibility: cueVisibility }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="animate-cue">
            <motion.button
              type="button"
              aria-label="Scroll to content"
              onClick={() =>
                window.scrollTo({
                  top: window.innerHeight * COLLAPSE_VH,
                  behavior: "smooth",
                })
              }
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="flex h-11 w-11 items-center justify-center rounded-[14px] text-lg depth-card"
              style={{ background: c.surface, color: c.text }}
            >
              <FiArrowDown aria-hidden />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
    </>
  );
};
