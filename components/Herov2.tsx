"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiDownload, FiFileText } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { c } from "@/components/palette";

/* Reflow-&-shrink hero. On load it fills the content width as a 2-column hero
   (text left, portrait right). As the intro spacer scrolls away the card's width
   shrinks — anchored at the left, so the right edge + portrait slide left — and
   the inner layout reflows (container query) into the docked vertical rail card. */

// Tunables.
const RAIL_W = 400; // docked width, matches the grid track max
const COLLAPSE_VH = 0.8; // collapse completes over this fraction of one viewport of scroll

const CURRENTLY = [
  "building this site, in the open",
  "learning low-latency systems",
  "reading about market microstructure",
  "shipping side projects",
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

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

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const Action = ({ href, label, icon }: ActionProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    variants={fadeUp}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="group inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
    style={{ borderColor: c.line, color: c.muted, background: c.surface2 }}
  >
    <span className="text-base transition-colors group-hover:text-[#4ADE80]">
      {icon}
    </span>
    <span className="transition-colors group-hover:text-[#ECECEA]">{label}</span>
  </motion.a>
);

export const Hero = () => {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [vh, setVh] = useState(0);

  // Width morph only on lg+ with motion allowed; otherwise the card renders at
  // its docked width (static vertical card on mobile / reduced-motion).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setEnabled(mq.matches && !reduce);
      setVh(window.innerHeight);
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [reduce]);

  // Drive the collapse from window scroll (reliably 0 at the very top) over the
  // first ~viewport of scrolling. The 180vh spacer in the right column then
  // holds the content below the fold until the card has docked.
  const { scrollY } = useScroll();
  const dock = useTransform(scrollY, [0, (vh || 800) * COLLAPSE_VH], [0, 1], {
    clamp: true,
  });
  const inv = useTransform(dock, (v) => 1 - v);
  const width = useMotionTemplate`calc(${RAIL_W}px + ${inv} * (min(100vw, 1400px) - ${RAIL_W}px - 4rem))`;

  return (
    <motion.div
      data-testid="hero-card"
      className="w-full max-w-md rounded-2xl border p-5 sm:p-6 lg:max-w-none lg:shrink-0 @container"
      style={{ borderColor: c.line, background: c.surface, ...(enabled ? { width } : {}) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
    >
      <motion.div
        className="grid grid-cols-1 gap-5 @[860px]:grid-cols-[1.1fr_0.9fr] @[860px]:items-center @[860px]:gap-10"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Portrait — top when narrow, right when wide */}
        <motion.div
          variants={fadeUp}
          className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border @[860px]:order-2 @[860px]:aspect-auto @[860px]:h-[64vh]"
          style={{ borderColor: c.line, background: c.surface2 }}
        >
          {/* Drop a real photo at /public/portrait.jpg to replace this. */}
          <Image
            src="/portrait.jpg"
            alt="Portrait of Jack Preston"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold @[860px]:text-6xl"
            style={{ color: c.line }}
          >
            JP
          </div>
        </motion.div>

        {/* Intro + actions */}
        <div className="@[860px]:order-1">
          <motion.p
            variants={fadeUp}
            className="mb-1 font-mono text-xs tracking-wide @[860px]:text-sm"
            style={{ color: c.muted }}
          >
            Hello, I&apos;m
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-3xl font-bold leading-tight tracking-tight @[860px]:text-6xl"
            style={{ color: c.text }}
          >
            Jack Preston
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-sm leading-relaxed @[860px]:mt-6 @[860px]:text-lg"
            style={{ color: c.muted }}
          >
            Third-year BE(Hons) &amp; BCom student at the University of Auckland.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-1 text-sm leading-relaxed @[860px]:mt-2 @[860px]:text-lg"
            style={{ color: c.muted }}
          >
            Currently <CurrentlyLine />
          </motion.p>

          <motion.div
            variants={stagger}
            className="mt-5 flex flex-wrap gap-2 @[860px]:mt-8"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
