"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { c } from "@/components/palette";

/* /projects — all projects as big expandable cards (one open at a time).
   Deep-linkable via ?open=<slug> (used by the home page's featured cards).
   Renders the right column only; SiteChrome owns the frame (rail + footer). */

// useSearchParams needs a Suspense boundary (Next CSR bailout).
const ShowcaseWithParams = () => {
  const initialOpen = useSearchParams().get("open") ?? undefined;
  return <ProjectShowcase initialOpen={initialOpen} />;
};

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
          Things I&apos;ve built. Expand a card for screenshots and the details.
        </p>
      </header>

      <Suspense fallback={<ProjectShowcase />}>
        <ShowcaseWithParams />
      </Suspense>
    </motion.div>
  );
}
