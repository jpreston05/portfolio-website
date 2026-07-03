"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown, FiExternalLink, FiGithub } from "react-icons/fi";
import { Carousel } from "@/components/Carousel";
import { c } from "@/components/palette";
import { projects, type Project } from "@/lib/projects";
import { EASE_SNAPPY } from "@/lib/motion";

/* The /projects accordion — big cards, exactly one expanded at a time.
   Deep-linkable: /projects?open=<slug> arrives with that card expanded and
   scrolled into view. Surface recipe matches SectionCard (borderless tonal). */

const LinkChip = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:text-[#ECECEA]"
    style={{ color: c.muted, background: c.bg }}
  >
    {icon}
    {label}
  </a>
);

const ProjectCard = ({
  project,
  open,
  onToggle,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.article
      id={project.slug}
      className="scroll-mt-26 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)]"
      style={{ background: c.surface }}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE_SNAPPY }}
    >
      {/* Collapsed header — the whole row toggles. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${project.slug}-body`}
        onClick={onToggle}
        className="flex w-full items-center gap-5 rounded-2xl p-5 text-left sm:p-6"
      >
        {/* thumbnail */}
        <div
          className="relative hidden aspect-video w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:flex"
          style={{ background: c.surface2 }}
        >
          <span className="text-2xl font-black" style={{ color: "rgba(236,236,234,0.08)" }}>
            JP.
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: c.text }}>
            {project.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: c.muted }}>
            {project.tagline}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 font-mono text-xs"
                style={{ background: c.bg, color: c.muted }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <motion.span
          aria-hidden
          className="shrink-0 text-xl"
          style={{ color: c.muted }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE_SNAPPY }}
        >
          <FiChevronDown />
        </motion.span>
      </button>

      {/* Expanded body — height animates open; instant under reduced motion. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${project.slug}-body`}
            className="overflow-hidden"
            initial={reduce ? { height: "auto" } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SNAPPY }}
          >
            <div className="grid gap-6 p-5 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
              <Carousel images={project.images} title={project.title} />

              <div className="flex flex-col gap-5">
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
                  {project.description}
                </p>

                <div>
                  <p
                    className="mb-2 font-mono text-xs uppercase tracking-wider"
                    style={{ color: c.muted }}
                  >
                    Highlights
                  </p>
                  <ul className="flex flex-col gap-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-sm leading-relaxed">
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: c.accent }}
                        />
                        <span style={{ color: c.muted }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  {project.links.github && (
                    <LinkChip href={project.links.github} label="GitHub" icon={<FiGithub />} />
                  )}
                  {project.links.live && (
                    <LinkChip href={project.links.live} label="Live" icon={<FiExternalLink />} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export const ProjectShowcase = ({ initialOpen }: { initialOpen?: string }) => {
  const validInitial = projects.some((p) => p.slug === initialOpen) ? initialOpen : undefined;
  const [openSlug, setOpenSlug] = useState<string | undefined>(validInitial);

  // Deep link: land with the card expanded and in view. validInitial never
  // changes after mount in practice (the ?open param arrives with the page),
  // so this runs once.
  useEffect(() => {
    if (!validInitial) return;
    document.getElementById(validInitial)?.scrollIntoView({ block: "start" });
  }, [validInitial]);

  return (
    <div className="flex flex-col gap-6">
      {projects.map((p) => (
        <ProjectCard
          key={p.slug}
          project={p}
          open={openSlug === p.slug}
          onToggle={() => setOpenSlug(openSlug === p.slug ? undefined : p.slug)}
        />
      ))}
    </div>
  );
};
