"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useIntro } from "@/components/SiteChrome";
import { Hero } from "@/components/Herov2";
import { useHeroMotion } from "@/components/useHeroMotion";
import { AboutMe } from "@/components/AboutMe";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { TechStack } from "@/components/TechStack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  // The intro loading screen (and its reveal → hand-off to the nav brand) is
  // owned by SiteChrome so it plays on any page. Here we just gate the home
  // content on `revealed`.
  const { revealed } = useIntro();

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

  return (
    <>
      <motion.div
        data-page-reveal
        className="relative z-10 min-h-screen w-full overflow-x-clip"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      {/* Vertical rhythm: 24px above the nav (top-6) + ~56px pill = nav bottom
          at 80px; content starts 24px below that (top-26 = 104px) and the
          docked rail keeps the same 24px at the viewport bottom (8rem total). */}
      <main id="home" className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-10 pt-26 sm:px-6 lg:grid-cols-[minmax(360px,400px)_1fr] lg:gap-8 lg:px-8">
        {/* LEFT RAIL — collapsing hero, pinned the whole way on desktop */}
        <div className="relative z-10 lg:sticky lg:top-26 lg:flex lg:h-[calc(100vh-8rem)] lg:items-center">
          <Hero revealed={revealed} />
        </div>

        {/* RIGHT COLUMN — during the collapse the content is held in place by a
            native sticky pin (no transform jitter) while it slides in from the
            right (x) + fades; the trailing spacer gives the sticky its scroll
            range, after which the content scrolls normally. */}
        <div className="flex flex-col">
          <motion.div
            className="flex flex-col gap-6 lg:sticky lg:top-26 lg:gap-8"
            style={
              enabled ? { opacity: contentOpacity, x: contentX } : undefined
            }
          >
            <AboutMe />
            <FeaturedProjects />
            <TechStack />
            <Contact />
          </motion.div>
          {/* collapse range (~50vh) + a dwell so the docked card + content sit
              still for a stretch before the page scrolls on */}
          {enabled && (
            <div aria-hidden className="hidden lg:block lg:h-[80vh]" />
          )}
        </div>
      </main>

      {/* Full-width footer — spans the page, caps the end normally */}
      <Footer />
      </motion.div>
    </>
  );
}
