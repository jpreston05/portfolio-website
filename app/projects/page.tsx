"use client";

import { motion } from "framer-motion";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { c } from "@/components/palette";

/* /projects — every project as a card in a filterable grid. Renders the right
   column only; SiteChrome owns the frame (rail + footer). */

export default function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <header className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: c.text }}
        >
          Projects<span style={{ color: c.accent }}>.</span>
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
          Things I&apos;ve built. Click a cover to see the screenshots.
        </p>
      </header>

      <ProjectShowcase />
    </motion.div>
  );
}
