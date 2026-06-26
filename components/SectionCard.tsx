"use client";

import { motion } from "framer-motion";
import { c } from "@/components/palette";

type SectionCardProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

/* A right-column "card" section: one surface, hairline border, fades in on view.
   Shared shell so every scrolling section matches the hero card aesthetic. */
export const SectionCard = ({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: SectionCardProps) => (
  <motion.section
    id={id}
    className={`scroll-mt-24 rounded-2xl border p-6 sm:p-8 ${className}`}
    style={{ borderColor: c.line, background: c.surface }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    <header className="mb-6">
      {eyebrow && (
        <p
          className="mb-1 font-mono text-xs uppercase tracking-wider"
          style={{ color: c.muted2 }}
        >
          {eyebrow}
        </p>
      )}
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
