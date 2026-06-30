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
      className="fixed left-1/2 top-4 z-[1000] -translate-x-1/2"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-1 rounded-full border border-[#4A524C] bg-[rgba(24,31,28,0.82)] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-[10px]">
        <a
          href="#home"
          aria-label="Home — Jack Preston"
          className="px-3 text-sm font-bold tracking-tight text-[#ECECEA] transition-opacity duration-200"
          style={{ opacity: brandVisible ? 1 : 0 }}
        >
          <span data-brand>
            JP<span style={{ color: "#DB5461" }}>.</span>
          </span>
        </a>
        <span className="mx-0.5 h-5 w-px bg-[#4A524C]" aria-hidden />

        <ul className="flex items-center gap-0.5">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative block rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#ECECEA]"
                      : "text-[#9BA89F] hover:text-[#ECECEA]"
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
          className="ml-1 rounded-full bg-[#DB5461] px-4 py-1.5 text-sm font-semibold text-[#181F1C]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Let&apos;s talk
        </motion.a>
      </div>
    </motion.nav>
  );
};
