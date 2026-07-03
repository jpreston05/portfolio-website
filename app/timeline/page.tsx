"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Timeline } from "@/components/Timeline";
import { c } from "@/components/palette";

/* /timeline — the milestones as their own page (nav is route-based now). */

export default function TimelinePage() {
  return (
    <>
      <motion.div
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <main className="mx-auto max-w-[800px] px-4 pb-16 pt-26 sm:px-6">
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
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
