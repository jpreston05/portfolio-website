"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Label } from "@/components/Label";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* Home stat row — three at-a-glance tiles on the same surface recipe as
   SectionCard. Edit TILES to update the numbers. */

const TILES: { label: string; value: string; unit?: string; note: string; big: boolean }[] = [
  { label: "Current GPA", value: "8.0", unit: "/ 9.0", note: "A average", big: true },
  {
    label: "Scholarship",
    value: "$5,000",
    note: "140th Anniversary Scholarship, 2024",
    big: true,
  },
  {
    label: "Degree",
    value: "BE(Hons) + BCom",
    note: "Software Engineering · Finance & Management",
    big: false, // words, not a number: set smaller so it fits one line
  },
];

export const StatTiles = () => {
  const reduce = useReducedMotion();
  return (
    <motion.section
      aria-label="At a glance"
      className="grid gap-4 sm:grid-cols-3"
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE_SNAPPY }}
    >
      {TILES.map((t) => (
        <div
          key={t.label}
          className="rounded-2xl p-5 depth-card"
          style={{ background: c.surface }}
        >
          <Label className="mb-2">{t.label}</Label>
          <p
            className={`flex min-h-9 items-baseline gap-1.5 font-bold leading-none tracking-tight ${
              t.big ? "text-3xl" : "text-lg"
            }`}
            style={{ color: c.text }}
          >
            <span className={t.big ? "" : "self-center"}>{t.value}</span>
            {t.unit && (
              <span className="text-base font-semibold" style={{ color: c.muted }}>
                {t.unit}
              </span>
            )}
          </p>
          <p className="mt-2 text-sm leading-snug" style={{ color: c.muted }}>
            {t.note}
          </p>
        </div>
      ))}
    </motion.section>
  );
};
