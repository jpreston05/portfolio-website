"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useHeroMotion } from "@/components/useHeroMotion";
import { AboutMe } from "@/components/AboutMe";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";

/* Home — the right column of the shared frame (SiteChrome owns the grid, the
   hero rail, the footer and the intro-gated reveal). */

export default function Home() {
  // Shared collapse motion. contentX is the card's overflow beyond its docked
  // width, so the content tracks the card's right edge with a constant gap
  // (never behind it). Vertical hold is done with native sticky (see JSX).
  const { enabled, contentX, contentOpacity } = useHeroMotion();

  useEffect(() => {
    // Own scroll restoration so a refresh always starts at the top — but hash
    // links from other pages (/#timeline, /#contact) must land on their target.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  /* During the collapse the content is held in place by a native sticky pin
     (no transform jitter) while it slides in from the right (x) + fades; the
     trailing spacer gives the sticky its scroll range, after which the content
     scrolls normally. */
  return (
    <div className="flex flex-col">
      <motion.div
        className="flex flex-col gap-6 lg:sticky lg:top-26 lg:gap-8"
        style={enabled ? { opacity: contentOpacity, x: contentX } : undefined}
      >
        <AboutMe />
        <FeaturedProjects />
        <TechStack />
        <Contact />
      </motion.div>
      {/* collapse range (~50vh) + a dwell so the docked card + content sit
          still for a stretch before the page scrolls on */}
      {enabled && <div aria-hidden className="hidden lg:block lg:h-[80vh]" />}
    </div>
  );
}
