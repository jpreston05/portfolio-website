"use client";

import { motion, useReducedMotion } from "framer-motion";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

type SectionCardProps = {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

/* A right-column "card" section: one surface, hairline border, fades in on view.
   Shared shell so every scrolling section matches the hero card aesthetic. */
export const SectionCard = ({
  id,
  title,
  children,
  className = "",
}: SectionCardProps) => {
  const reduce = useReducedMotion();
  return (
  <motion.section
    id={id}
    className={`scroll-mt-26 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)] sm:p-8 ${className}`}
    style={{ background: c.surface }}
    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, ease: EASE_SNAPPY }}
  >
    <header className="mb-6">
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: c.text }}
      >
        {title}
      </h2>
    </header>
    {children}
  </motion.section>
  );
};
