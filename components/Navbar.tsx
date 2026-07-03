"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* Floating "dock" nav — a centred pill at the top: monogram + divider + links
   with a sliding active highlight, and a single coral CTA. Contact lives only
   in the CTA (no duplicate nav link). */

const LINKS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "timeline", label: "Timeline", href: "#timeline" },
];

export const Navbar = ({ brandVisible = true }: { brandVisible?: boolean }) => {
  const [active, setActive] = useState("home");

  // Scroll-spy. The hero collapse holds the top ~0.45vh as "home"; past that,
  // the active link tracks whichever section heading has crossed the upper band.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 800;
      if (y < vh * 0.45) {
        setActive("home");
        return;
      }
      let current = "projects";
      for (const id of ["projects", "timeline"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= vh * 0.3) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed left-1/2 top-6 z-[1000] -translate-x-1/2"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Solid surface dock — same material AND shape language as the section
          cards (rounded-2xl); the links/CTA inside stay pills for hierarchy. */}
      <div className="flex items-center gap-1.5 rounded-2xl bg-[#2F3733] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_32px_rgba(0,0,0,0.45)]">
        <a
          href="#home"
          aria-label="Home — Jack Preston"
          className="px-4 text-base font-bold tracking-tight text-[#ECECEA] transition-opacity duration-200"
          style={{ opacity: brandVisible ? 1 : 0 }}
        >
          <span data-brand>
            JP<span style={{ color: "#DB5461" }}>.</span>
          </span>
        </a>
        <span className="mx-0.5 h-6 w-px bg-[#4A524C]" aria-hidden />

        <ul className="flex items-center gap-0.5">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative block rounded-full px-5 py-2 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-[#ECECEA]"
                      : "text-[#A6B0A8] hover:text-[#ECECEA]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-[#3A423D]"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <motion.a
          href="#contact"
          className="ml-1.5 rounded-full bg-[#DB5461] px-5 py-2 text-[15px] font-semibold text-[#181F1C]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Let&apos;s talk
        </motion.a>
      </div>
    </motion.nav>
  );
};
