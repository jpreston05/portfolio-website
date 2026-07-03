"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

const projects = [
  {
    title: "Project One",
    description: "A brief description of Project One.",
    stack: ["React", "TypeScript", "Node"],
    href: "#",
  },
  {
    title: "Project Two",
    description: "A brief description of Project Two.",
    stack: ["Python", "FastAPI", "Postgres"],
    href: "#",
  },
  {
    title: "Project Three",
    description: "A brief description of Project Three.",
    stack: ["C++", "CMake"],
    href: "#",
  },
];

export const FeaturedProjects = () => (
  <SectionCard id="projects" title="Featured Projects">
    <div className="flex flex-col gap-4">
      {projects.map((p) => (
        <motion.a
          key={p.title}
          href={p.href}
          className="group flex flex-col gap-3 rounded-xl p-5 transition-colors"
          style={{ background: c.surface2 }}
          whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(0,0,0,0.28)" }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-lg font-semibold transition-colors group-hover:text-[#DB5461]"
              style={{ color: c.text }}
            >
              {p.title}
            </h3>
            <FiArrowUpRight
              className="mt-0.5 shrink-0 text-lg text-[#737F77] transition-[transform,color] duration-200 ease-snappy group-hover:translate-x-0.5 group-hover:text-[#DB5461]"
            />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
            {p.description}
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
        </motion.a>
      ))}
    </div>
  </SectionCard>
);
