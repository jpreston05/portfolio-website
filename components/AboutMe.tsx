"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

/* Home-page "About Me" — degree, GPA and current courses at a glance, with a CTA
   to /timeline for the full journey (mirrors FeaturedProjects → /projects). */

const MotionLink = motion.create(Link);

const PARAGRAPH =
  "I grew up in Waihi Beach, a small rural town in New Zealand, attending a primary school of under 300 students and a high school of around 800. My interest in programming started early. At around age 10, I was building simple games on my iPad using block-coding apps. In high school, I built on that foundation: I learned HTML and CSS and built my first website in Year 10, studied searching and sorting algorithms, and started learning Java. That's when I knew software engineering was the path for me, and it's been my goal ever since.";

const COURSES = [
  { code: "SOFTENG 364", name: "Networks and Security" },
  { code: "SOFTENG 325", name: "Software Architecture" },
  { code: "SOFTENG 306", name: "Software Engineering Design 2" },
  { code: "ACCTG 102", name: "Accounting Concepts" },
  { code: "BUSINESS 202", name: "Business Consulting" },
];

// UoA Curriculum Catalogue — one stable "about the course" page per code.
const courseUrl = (code: string) =>
  `https://study.auckland.ac.nz/ords/r/uoa/catalogue/course?p6_code=${code.replace(/ /g, "+")}`;

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
            BE(Hons), Software Engineering &amp; BCom, Finance &amp; Management
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
            // Colour lives in classes (not inline style) so the hover wins.
            <a
              key={course.code}
              href={courseUrl(course.code)}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs text-[#A6B0A8] transition-colors hover:text-[#DB5461]"
              style={{ background: c.bg }}
            >
              {course.code} — {course.name}
              <FiArrowUpRight className="shrink-0 text-[0.95em] transition-transform duration-200 ease-snappy group-hover:translate-x-0.5" />
            </a>
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
