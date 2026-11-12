"use client";

import { motion } from "framer-motion";
import { Timeline } from "@/components/Timeline";
import { c } from "@/components/palette";

/* /timeline — the milestones. Renders the right column only; SiteChrome owns
   the frame (rail + footer). */

export default function TimelinePage() {
  return (
    <motion.div
      className="mx-auto w-full max-w-[800px] lg:mx-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <header className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: c.text }}
        >
          Timeline<span style={{ color: c.accent }}>.</span>
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
          Where I&apos;ve been and what I&apos;ve been building along the way.
        </p>
      </header>

      <Timeline />
    </motion.div>
  );
}
