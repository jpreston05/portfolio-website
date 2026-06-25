"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Herov2";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { TechStack } from "@/components/TechStack";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const reduce = useReducedMotion();

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
    <motion.div
      className="min-h-screen w-full overflow-x-clip"
      style={{ background: "#0B0B0C" }}
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

        {/* RIGHT COLUMN — scrolling content */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {!reduce && (
            <div aria-hidden className="hidden lg:block lg:h-[180vh]" />
          )}
          <FeaturedProjects />
          <TechStack />
          <Timeline />
          <Contact />
          <Footer />
        </div>
      </main>

      <ControlPanel />
    </motion.div>
  );
}
