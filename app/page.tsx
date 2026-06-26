"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Herov2";
import { useHeroMotion } from "@/components/useHeroMotion";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { TechStack } from "@/components/TechStack";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Shared collapse motion. contentX is the card's overflow beyond its docked
  // width, so the content tracks the card's right edge with a constant gap
  // (never behind it). Vertical hold is done with native sticky (see JSX).
  const { enabled, contentX, contentOpacity } = useHeroMotion();

  useEffect(() => {
    // Own scroll restoration so a refresh always starts at the top.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    setIsLoaded(true);
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
  }, []);

  return (
    <>
      <motion.div
        className="relative z-10 min-h-screen w-full overflow-x-clip"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      <Navbar />

      <main className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-10 pt-24 sm:px-6 lg:grid-cols-[minmax(360px,400px)_1fr] lg:gap-8 lg:px-8">
        {/* LEFT RAIL — collapsing hero, pinned the whole way on desktop */}
        <div className="relative z-10 lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-7rem)] lg:items-center">
          <Hero />
        </div>

        {/* RIGHT COLUMN — during the collapse the content is held in place by a
            native sticky pin (no transform jitter) while it slides in from the
            right (x) + fades; the trailing spacer gives the sticky its scroll
            range, after which the content scrolls normally. */}
        <div className="flex flex-col">
          <motion.div
            className="flex flex-col gap-6 lg:sticky lg:top-24 lg:gap-8"
            style={
              enabled ? { opacity: contentOpacity, x: contentX } : undefined
            }
          >
            <FeaturedProjects />
            <TechStack />
            <Timeline />
            <Contact />
          </motion.div>
          {enabled && (
            <div aria-hidden className="hidden lg:block lg:h-[50vh]" />
          )}
        </div>
      </main>

      {/* Full-width footer — spans the page, caps the end normally */}
      <Footer />

        <ControlPanel />
      </motion.div>
    </>
  );
}
