"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { EASE_SNAPPY } from "@/lib/motion";

/* Floating "dock" nav — a centred pill: monogram + divider + links with a
   sliding active highlight, and a single coral CTA. Every item is a route;
   the active pill follows the pathname. */

const LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "timeline", label: "Timeline", href: "/timeline" },
];

const MotionLink = motion.create(Link);

// useLayoutEffect warns during SSR; this client component is still SSR'd.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const Navbar = ({ brandVisible = true }: { brandVisible?: boolean }) => {
  const pathname = usePathname();
  // "home" only on "/" exactly — on routes without a nav item (e.g. /contact)
  // no pill is active.
  const active =
    pathname === "/"
      ? "home"
      : LINKS.find((l) => l.href !== "/" && pathname.startsWith(l.href))?.id;

  // The active-pill slides by measuring the active item's layout offset and
  // animating transform-x + width on a single persistent element. offsetLeft /
  // offsetWidth are layout metrics, unaffected by window scroll — so unlike a
  // shared-layout (layoutId) FLIP, the slide can't be corrupted by the scroll
  // reset that fires on route navigation.
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const el = active ? itemRefs.current[active] : null;
    // A display:none item (Home below sm) measures 0 — no pill rather than a
    // zero-width sliver.
    setPill(
      el && el.offsetWidth > 0 ? { x: el.offsetLeft, width: el.offsetWidth } : null
    );
  }, [active]);

  // Position before paint on active change; the pill snaps on first mount
  // (initial={false}) and springs only when its value changes while mounted.
  useIsoLayoutEffect(measure, [measure]);

  // Re-measure if the nav reflows (e.g. viewport resize changes wrapping).
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <motion.nav
      // w-max: a fixed element's shrink-to-fit width is capped at the space
      // right of left:50% (half the viewport) — without it the CTA label wraps
      // on anything narrower than ~1000px.
      className="fixed left-1/2 top-6 z-[1000] w-max -translate-x-1/2"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_SNAPPY }}
    >
      {/* Solid surface dock — same material AND shape language as the section
          cards (rounded-2xl); the links/CTA inside stay pills for hierarchy.
          Below sm the dock compresses (tighter padding, 14px labels) and the
          Home item hides — the JP. brand IS the home link — so the pill fits
          a 320px viewport; max-[319px] squeezes once more for fold phones. */}
      <div className="flex items-center gap-1 rounded-2xl bg-[#2F3733] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_32px_rgba(0,0,0,0.45)] sm:gap-1.5 sm:p-2">
        <Link
          href="/"
          aria-label="Home, Jack Preston"
          className="px-2.5 text-base font-bold tracking-tight text-[#ECECEA] transition-opacity duration-200 max-[319px]:px-1.5 sm:px-4"
          style={{ opacity: brandVisible ? 1 : 0 }}
        >
          <span data-brand>
            JP<span style={{ color: "#DB5461" }}>.</span>
          </span>
        </Link>
        <span className="mx-0.5 h-6 w-px bg-[#4A524C]" aria-hidden />

        <ul className="relative flex items-center gap-0.5">
          {/* Sliding active highlight — one persistent element. */}
          {pill && (
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-full bg-[#3A423D]"
              initial={false}
              animate={{ x: pill.x, width: pill.width }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li
                key={link.id}
                ref={(el) => {
                  itemRefs.current[link.id] = el;
                }}
                className={link.id === "home" ? "hidden sm:block" : undefined}
              >
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative block rounded-full px-3 py-2 text-sm font-medium transition-colors max-[319px]:px-2 max-[319px]:text-[13px] sm:px-5 sm:text-[15px] ${
                    isActive ? "text-[#ECECEA]" : "text-[#A6B0A8] hover:text-[#ECECEA]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <MotionLink
          href="/contact"
          className="ml-1 rounded-full bg-[#DB5461] px-3.5 py-2 text-sm font-semibold text-[#181F1C] max-[319px]:px-2.5 max-[319px]:text-[13px] sm:ml-1.5 sm:px-5 sm:text-[15px]"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Let&apos;s talk
        </MotionLink>
      </div>
    </motion.nav>
  );
};
