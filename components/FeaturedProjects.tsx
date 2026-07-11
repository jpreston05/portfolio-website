"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";
import { featuredProjects } from "@/lib/projects";
import { EASE_SNAPPY } from "@/lib/motion";

/* Home-page preview of /projects — reads the shared data module, so anything
   tagged `featured: true` in lib/projects.ts appears here automatically.
   Each card deep-links to /projects with itself expanded. */

const MotionLink = motion.create(Link);

export const FeaturedProjects = () => (
  <SectionCard id="featured" title="Featured Projects">
    <div className="flex flex-col gap-4">
      {featuredProjects.map((p) => (
        <MotionLink
          key={p.slug}
          href={`/projects?open=${p.slug}`}
          className="group flex flex-col gap-3 rounded-xl p-5 transition-colors"
          style={{ background: c.surface2 }}
          whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.28)" }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-lg font-semibold transition-colors group-hover:text-[#DB5461]"
              style={{ color: c.text }}
            >
              {p.title}
            </h3>
            <FiArrowUpRight className="mt-0.5 shrink-0 text-lg text-[#737F77] transition-[transform,color] duration-200 ease-snappy group-hover:translate-x-0.5 group-hover:text-[#DB5461]" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
            {p.tagline}
          </p>
          <div className="flex flex-wrap gap-2">
            {p.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 font-mono text-xs"
                style={{ background: c.bg, color: c.muted }}
              >
                {tech}
              </span>
            ))}
          </div>
        </MotionLink>
      ))}
    </div>

    <div className="mt-5 flex justify-end">
      {/* Colour lives in classes (not inline style) so the hover actually wins. */}
      <MotionLink
        href="/projects"
        whileHover={{ x: 3, color: "#DB5461" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-[#A6B0A8]"
      >
        All projects
        <FiArrowRight />
      </MotionLink>
    </div>
  </SectionCard>
);
