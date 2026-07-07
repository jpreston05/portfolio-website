"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* Intro loading screen. Plays on every load:
   1. "Jack" / "Preston." fades in, centred, on two lines (like the hero).
   2. The trailing letters "ack" / "reston" collapse leftward and the two lines
      merge — the name retracts into "JP." (framer `layout` does the reflow),
      staying centred on screen.
   3. "JP." FLIP-glides + shrinks from the centre onto the navbar brand slot
      ([data-brand]) while the backdrop fades and the site reveals beneath.
   4. Hands off to the real navbar brand (onDone); the parent then unmounts us.
   Reduced motion: a quick static fade, no choreography. */

type Phase = "name" | "combine" | "loading" | "glide" | "done";
type Flip = { x: number; y: number; scale: number };

const NAME_HOLD = 1000; // ms: fade-in + hold on the full name
const COMBINE_MS = 700; // collapse → JP
const HOLD_JP = 350; // pause on "JP." before gliding
const GLIDE_MS = 800;
const LOAD_CAP = 8000; // safety: never wait longer than this for the page to load

const FONT = "clamp(2.75rem, 11vw, 8rem)";
const ACCENT = "#DB5461";
const INK = "#ECECEA";
const collapseT = { duration: 0.5, ease: [0.6, 0, 0.2, 1] as const };
const layoutT = { layout: { duration: 0.6, ease: [0.6, 0, 0.2, 1] as const } };

export const Preloader = ({
  onReveal,
  onDone,
}: {
  onReveal: () => void;
  onDone: () => void;
}) => {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("name");
  const [flip, setFlip] = useState<Flip | null>(null);
  const readyRef = useRef(false);
  const phaseRef = useRef<Phase>("name");
  const brandRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Lock scroll while the intro plays.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Track whether the page has finished loading (all resources). If we're already
  // waiting on "JP." when it lands, proceed to the glide.
  useEffect(() => {
    const mark = () => {
      readyRef.current = true;
      if (phaseRef.current === "loading") setPhase("glide");
    };
    if (document.readyState === "complete") return mark();
    window.addEventListener("load", mark);
    return () => window.removeEventListener("load", mark);
  }, []);

  useEffect(() => {
    if (reduce) {
      onReveal();
      const t = setTimeout(onDone, 450);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setPhase("combine"), NAME_HOLD),
      // After "JP." forms: glide if the page is ready, else wait (bouncing dot).
      setTimeout(
        () => setPhase(readyRef.current ? "glide" : "loading"),
        NAME_HOLD + COMBINE_MS + HOLD_JP
      ),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // While the page is still loading, hold on "JP." (dot bounces). The load
  // handler above advances us when ready; this is just the safety cap.
  useEffect(() => {
    if (phase !== "loading") return;
    const cap = setTimeout(() => setPhase("glide"), LOAD_CAP);
    return () => clearTimeout(cap);
  }, [phase]);

  // FLIP from the centred "JP." onto the nav brand slot.
  useEffect(() => {
    if (phase !== "glide") return;
    const src = brandRef.current?.getBoundingClientRect();
    const target = document.querySelector("[data-brand]")?.getBoundingClientRect();
    if (src && target) {
      const cx = (r: DOMRect) => r.left + r.width / 2;
      const cy = (r: DOMRect) => r.top + r.height / 2;
      setFlip({ x: cx(target) - cx(src), y: cy(target) - cy(src), scale: target.width / src.width });
    }
    onReveal();
    const t = setTimeout(() => {
      onDone();
      setPhase("done");
    }, GLIDE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const combined = reduce || phase !== "name";
  const backdropGone = phase === "glide" || phase === "done";
  const bouncing = phase === "loading"; // slow page load → bounce the full stop

  return (
    <motion.div
      data-preloader
      className="pointer-events-none fixed inset-0 z-[2000]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Carbon backdrop — fades as the JP glides, revealing the site. */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "#181F1C" }}
        animate={{ opacity: backdropGone ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Centred brand: fades in stacked → merges to "JP." → glides to the nav. */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          ref={brandRef}
          style={{ transformOrigin: "center" }}
          initial={{ opacity: 0 }}
          animate={
            flip
              ? { opacity: 1, x: flip.x, y: flip.y, scale: flip.scale }
              : { opacity: 1, x: 0, y: 0, scale: 1 }
          }
          transition={
            flip
              ? { duration: GLIDE_MS / 1000, ease: [0.6, 0, 0.2, 1] }
              : { opacity: { duration: 0.6, ease: "easeOut" } }
          }
        >
          <motion.div
            layout
            transition={layoutT}
            className={`font-bold leading-[0.9] tracking-tight ${
              combined ? "flex items-baseline" : "flex flex-col items-start"
            }`}
            style={{ fontSize: FONT, color: INK }}
          >
            {/* J line */}
            <motion.div layout transition={layoutT} className="flex">
              <span>J</span>
              <AnimatePresence>
                {!combined && (
                  <motion.span
                    key="ack"
                    className="inline-block overflow-hidden"
                    style={{ whiteSpace: "nowrap" }}
                    initial={false}
                    exit={{ width: 0, opacity: 0 }}
                    transition={collapseT}
                  >
                    ack
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            {/* P line */}
            <motion.div layout transition={layoutT} className="flex">
              <span>P</span>
              <AnimatePresence>
                {!combined && (
                  <motion.span
                    key="reston"
                    className="inline-block overflow-hidden"
                    style={{ whiteSpace: "nowrap" }}
                    initial={false}
                    exit={{ width: 0, opacity: 0 }}
                    transition={collapseT}
                  >
                    reston
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                style={{ color: ACCENT, display: "inline-block" }}
                animate={bouncing ? { y: ["0%", "-45%", "0%"] } : { y: "0%" }}
                transition={
                  bouncing
                    ? { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              >
                .
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
