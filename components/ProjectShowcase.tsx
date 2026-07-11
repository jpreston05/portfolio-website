"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown, FiExternalLink, FiGithub } from "react-icons/fi";
import { Carousel } from "@/components/Carousel";
import { FilterSelect } from "@/components/FilterSelect";
import { c } from "@/components/palette";
import {
  CATEGORY_LABELS,
  initials,
  projects,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";
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
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -2, color: "#ECECEA" }}
    transition={{ duration: 0.2, ease: EASE_SNAPPY }}
    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
    style={{ color: c.muted, background: c.bg }}
  >
    {icon}
    {label}
  </motion.a>
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
  const hasImages = project.images.length > 0;

  // On collapse the thumbnail's space is reserved immediately (so the text
  // slides back over it) but its content only fades in once that slide has
  // settled — the thumbnail appears AFTER the text moves. On expand it's hidden
  // at once (the cover morphs into the carousel). `coverReady` is reset in render
  // on the open→/←close edge; only the delayed reveal lives in the effect.
  const [coverReady, setCoverReady] = useState(!open);
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    setCoverReady(open ? false : reduce === true); // collapse under reduced motion reveals at once
  }
  useEffect(() => {
    if (open || coverReady) return;
    const t = setTimeout(() => setCoverReady(true), 300);
    return () => clearTimeout(t);
  }, [open, coverReady]);

  return (
    <motion.article
      id={project.slug}
      layout="position"
      className="scroll-mt-26 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)]"
      style={{ background: c.surface }}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_SNAPPY }}
    >
      {/* Collapsed header — the whole row toggles. */}
      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={`${project.slug}-body`}
        onClick={onToggle}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        className="group flex w-full items-start gap-5 rounded-2xl p-5 text-left sm:p-6"
      >
        {/* Thumbnail — only while collapsed, so on expand it's gone and the text
            slides over to fill the space. The box reserves its slot as soon as a
            card collapses (driving the text slide), but the surface + content only
            appear once `coverReady` flips (after the slide) so the thumbnail lands
            after the text has moved. Image projects show the first screenshot
            (which morphs into the carousel's first slide on expand); image-less
            projects show a branded initials tile. */}
        {!open && (
          <div
            className="relative hidden aspect-video w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:flex"
            style={{ background: coverReady ? c.surface2 : "transparent" }}
          >
            {coverReady &&
              (hasImages ? (
                reduce ? (
                  <Image
                    src={project.images[0]}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-contain"
                    draggable={false}
                  />
                ) : (
                  <motion.div
                    layoutId={`cover-${project.slug}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: EASE_SNAPPY }}
                  >
                    <Image
                      src={project.images[0]}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain"
                      draggable={false}
                    />
                  </motion.div>
                )
              ) : (
                <motion.span
                  className="text-2xl font-black"
                  style={{ color: "rgba(236,236,234,0.08)" }}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE_SNAPPY }}
                >
                  {initials(project.title)}
                </motion.span>
              ))}
          </div>
        )}

        <motion.div layout={reduce ? false : "position"} className="min-w-0 flex-1">
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
        </motion.div>

        {/* Colour in classes so the group-hover wins — the chevron lightening
            is the header's "this expands" hover hint (same grammar as the
            timeline rows). */}
        <motion.span
          aria-hidden
          className="shrink-0 self-center text-xl text-[#A6B0A8] transition-colors group-hover:text-[#ECECEA]"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE_SNAPPY }}
        >
          <FiChevronDown />
        </motion.span>
      </motion.button>

      {/* Expanded body — height animates open; instant under reduced motion. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${project.slug}-body`}
            className="overflow-hidden"
            initial={reduce ? { height: "auto" } : { height: 0 }}
            animate={{ height: "auto" }}
            exit={reduce ? undefined : { height: 0 }}
            transition={{ duration: 0.4, ease: EASE_SNAPPY }}
          >
            {/* Height animates on the body; opacity is applied to the text
                column only so the morphing carousel cover stays fully opaque. */}
            <div className="grid gap-6 p-5 pt-0 sm:p-6 sm:pt-0 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
              <Carousel
                images={project.images}
                title={project.title}
                coverLayoutId={!reduce && hasImages ? `cover-${project.slug}` : undefined}
              />

              <motion.div
                className="flex flex-col gap-5"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE_SNAPPY, delay: 0.1 }}
              >
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

type Filter = "all" | ProjectCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
  })),
];

const countFor = (id: Filter) =>
  id === "all" ? projects.length : projects.filter((p) => p.category === id).length;

export const ProjectShowcase = ({ initialOpen }: { initialOpen?: string }) => {
  const validInitial = projects.some((p) => p.slug === initialOpen) ? initialOpen : undefined;
  const [openSlug, setOpenSlug] = useState<string | undefined>(validInitial);
  // A deep-linked card opens on "all" (default), so it's always visible.
  const [filter, setFilter] = useState<Filter>("all");

  // Deep link: land with the card expanded and in view. validInitial never
  // changes after mount in practice (the ?open param arrives with the page),
  // so this runs once.
  useEffect(() => {
    if (!validInitial) return;
    document.getElementById(validInitial)?.scrollIntoView({ block: "start" });
  }, [validInitial]);

  const shown =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      {/* Category filter. Phones get a dropdown (the pill row doesn't fit);
          sm+ gets the segmented control with the sliding active pill. */}
      <div className="mb-8 sm:hidden">
        <FilterSelect
          options={FILTERS.map((f) => ({ ...f, count: countFor(f.id) }))}
          value={filter}
          onChange={(id) => setFilter(id as Filter)}
          ariaLabel="Filter projects by category"
          trackBg={c.surface}
        />
      </div>
      <div
        className="mb-8 hidden gap-1 rounded-full p-1.5 sm:inline-flex"
        style={{ background: c.surface }}
      >
        {FILTERS.map(({ id, label }) => {
          const isActive = filter === id;
          return (
            <motion.button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(id)}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="relative rounded-full px-4 py-2 text-sm font-medium"
              style={{ color: isActive ? c.text : c.muted }}
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: c.surface2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">
                {label}
                {/* Mono to match the timeline tabs; full-opacity muted — the
                    dimmed version fell under the 4.5:1 AA floor. */}
                <span className="ml-1.5 font-mono text-xs" style={{ color: c.muted }}>
                  {countFor(id)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div layout className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              open={openSlug === p.slug}
              onToggle={() => setOpenSlug(openSlug === p.slug ? undefined : p.slug)}
            />
          ))}
        </AnimatePresence>

        {shown.length === 0 && (
          <p className="text-sm" style={{ color: c.muted }}>
            No projects in this category yet.
          </p>
        )}
      </motion.div>
    </div>
  );
};
