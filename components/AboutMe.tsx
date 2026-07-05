"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

/* Home-page "About Me" — degree, GPA and current courses at a glance, with a CTA
   to /timeline for the full journey (mirrors FeaturedProjects → /projects). */

const MotionLink = motion.create(Link);

// Placeholder — Jack to write. A few sentences on who he is / what he's after.
const PARAGRAPH =
  "Placeholder — a short paragraph about who I am, what I'm drawn to in engineering, and what I'm looking for. To be written.";

// Placeholder — swap for the real papers once confirmed.
const COURSES = [
  "Course 1 — placeholder",
  "Course 2 — placeholder",
  "Course 3 — placeholder",
  "Course 4 — placeholder",
];

const Stat = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-xl p-4" style={{ background: c.surface2 }}>
    <p className="mb-1.5 font-mono text-xs uppercase tracking-wider" style={{ color: c.muted }}>
      {label}
    </p>
    {children}
  </div>
);

export const AboutMe = () => (
  <SectionCard id="about" title="About Me">
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
        {PARAGRAPH}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Degree">
          <p className="text-sm font-semibold" style={{ color: c.text }}>
            BE(Hons), Software Engineering &amp; BCom
          </p>
          <p className="mt-0.5 text-sm" style={{ color: c.muted }}>
            University of Auckland · Third year
          </p>
        </Stat>

        <Stat label="Current GPA">
          <p className="font-bold leading-none" style={{ color: c.text }}>
            <span className="text-3xl">8.0</span>
            <span className="text-lg" style={{ color: c.muted }}>
              {" "}
              / 9.0
            </span>
          </p>
          <p className="mt-1 text-sm" style={{ color: c.muted }}>
            A average
          </p>
        </Stat>
      </div>

      <div>
        <p
          className="mb-2 font-mono text-xs uppercase tracking-wider"
          style={{ color: c.muted }}
        >
          Currently taking
        </p>
        <div className="flex flex-wrap gap-2">
          {COURSES.map((course) => (
            <span
              key={course}
              className="rounded-md px-2 py-0.5 font-mono text-xs"
              style={{ background: c.bg, color: c.muted }}
            >
              {course}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-5 flex justify-end">
      {/* Colour lives in classes (not inline style) so the hover actually wins. */}
      <MotionLink
        href="/timeline"
        whileTap={{ scale: 0.97 }}
        className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-[#A6B0A8] transition-colors hover:text-[#DB5461]"
      >
        My journey
        <FiArrowRight className="transition-transform duration-200 ease-snappy group-hover:translate-x-0.5" />
      </MotionLink>
    </div>
  </SectionCard>
);
