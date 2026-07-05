"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { c } from "@/components/palette";

/* /projects — all projects as big expandable cards (one open at a time).
   Deep-linkable via ?open=<slug> (used by the home page's featured cards).
   No preloader on subpages; the page fades in and the nav brand is visible. */

// useSearchParams needs a Suspense boundary (Next CSR bailout).
const ShowcaseWithParams = () => {
  const initialOpen = useSearchParams().get("open") ?? undefined;
  return <ProjectShowcase initialOpen={initialOpen} />;
};

export default function ProjectsPage() {
  return (
    <>
      <motion.div
        className="relative z-10 flex min-h-screen flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <main className="mx-auto w-full max-w-[1000px] flex-1 px-4 pb-16 pt-26 sm:px-6">
          <header className="mb-8">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: c.text }}
            >
              Projects<span style={{ color: c.accent }}>.</span>
            </h1>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
              Things I&apos;ve built — expand a card for screenshots and the details.
            </p>
          </header>

          <Suspense fallback={<ProjectShowcase />}>
            <ShowcaseWithParams />
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
