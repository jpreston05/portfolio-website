"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { Label } from "@/components/Label";
import { Lightbox } from "@/components/Lightbox";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";
import { projects } from "@/lib/projects";
import { EASE_SNAPPY } from "@/lib/motion";

/* /projects/<slug>: the page for a project with a `story` (lib/projects).
   Header, "Why I rebuilt it" (the old build's problem beside the new build's
   fix), then the screenshots, switchable by build (v2 / v1) and by view
   (the owner's signed-in app / the public read-only site). Any shot opens
   the Lightbox on the set currently shown. Right column only. */

const MotionLink = motion.create(Link);

type Option = { id: string; label: string };

// Same segmented control as the /projects filter, on the card's dark well.
const Segmented = ({
  pillId,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  pillId: string;
  ariaLabel: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className="depth-track inline-flex gap-1 rounded-2xl p-1.5"
    style={{ background: c.bg }}
  >
    {options.map(({ id, label }) => {
      const isActive = id === value;
      return (
        <motion.button
          key={id}
          type="button"
          aria-pressed={isActive}
          onClick={() => onChange(id)}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          transition={{ duration: 0.2, ease: EASE_SNAPPY }}
          className="relative rounded-[10px] px-4 py-2 text-sm font-medium"
          style={{ color: isActive ? c.text : c.muted }}
        >
          {isActive && (
            <motion.span
              layoutId={pillId}
              className="depth-chip absolute inset-0 rounded-[10px]"
              style={{ background: c.surface2 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative">{label}</span>
        </motion.button>
      );
    })}
  </div>
);

const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    whileHover={{ y: -2, color: "#ECECEA" }}
    transition={{ duration: 0.2, ease: EASE_SNAPPY }}
    className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-[#A6B0A8]"
  >
    {children}
    <FiArrowUpRight aria-hidden />
  </motion.a>
);

export const ProjectPage = ({ slug }: { slug: string }) => {
  const reduce = useReducedMotion();
  const project = projects.find((p) => p.slug === slug);
  const story = project?.story;
  const [buildLabel, setBuildLabel] = useState(story?.builds[0]?.label ?? "");
  const [viewId, setViewId] = useState(story?.views[0]?.id ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!project || !story) return null;

  const { title, tagline, stack, links } = project;
  const build = story.builds.find((b) => b.label === buildLabel) ?? story.builds[0];
  const view = story.views.find((v) => v.id === viewId) ?? story.views[0];
  const shots = build.shots[view.id] ?? [];
  const count = shots.length;
  const open = (i: number) => {
    setIndex(i);
    setLightboxOpen(true);
  };

  return (
    <motion.div
      className="mx-auto w-full max-w-[960px] lg:mx-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <MotionLink
        href="/projects"
        whileHover={{ y: -2, color: "#ECECEA" }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        className="depth-chip mb-6 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-[#A6B0A8]"
        style={{ background: c.surface }}
      >
        <FiArrowLeft aria-hidden />
        All projects
      </MotionLink>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: c.text }}>
          {title}
          <span style={{ color: c.accent }}>.</span>
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
          {tagline}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          {links.github && <ExternalLink href={links.github}>GitHub</ExternalLink>}
          {links.live && <ExternalLink href={links.live}>Live</ExternalLink>}
          {stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{ background: c.surface, color: c.muted }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <SectionCard title="Why I rebuilt it">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-1 xl:grid-cols-2">
            {story.why.map(({ label, text }) => (
              <div key={label}>
                <Label>{label}</Label>
                <p className="text-[15px] leading-relaxed" style={{ color: c.text }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Then and now">
          <div className="flex flex-wrap gap-3">
            <Segmented
              pillId={`${slug}-build-pill`}
              ariaLabel="Version"
              options={story.builds.map((b) => ({ id: b.label, label: b.label }))}
              value={build.label}
              onChange={setBuildLabel}
            />
            <Segmented
              pillId={`${slug}-view-pill`}
              ariaLabel="View"
              options={story.views.map((v) => ({ id: v.id, label: v.label }))}
              value={view.id}
              onChange={setViewId}
            />
          </div>

          <p className="mt-4 max-w-[70ch] text-sm leading-relaxed" style={{ color: c.muted }}>
            <span className="font-semibold" style={{ color: c.text }}>
              {build.label}, {build.summary.toLowerCase()}.
            </span>{" "}
            {view.note}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={`${build.label}-${view.id}`}
              className="mt-6 grid gap-x-4 gap-y-5 sm:grid-cols-2"
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE_SNAPPY }}
            >
              {shots.map((shot, i) => (
                // An odd count gives the first shot the full row, so the grid
                // never ends on an orphan.
                <li key={shot.src} className={count % 2 === 1 && i === 0 ? "sm:col-span-2" : ""}>
                  <motion.button
                    type="button"
                    aria-label={`View screenshot: ${shot.caption}`}
                    onClick={() => open(i)}
                    initial="rest"
                    whileHover={reduce ? undefined : "hover"}
                    className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl"
                    style={{ background: c.bg, cursor: "zoom-in" }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
                      transition={{ duration: 0.3, ease: EASE_SNAPPY }}
                    >
                      <Image
                        src={shot.src}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 900px, (min-width: 640px) 50vw, 100vw"
                        className="object-contain"
                        draggable={false}
                      />
                    </motion.div>
                  </motion.button>
                  <p className="mt-2 text-sm" style={{ color: c.muted }}>
                    {shot.caption}
                  </p>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </SectionCard>
      </div>

      {count > 0 && (
        <Lightbox
          open={lightboxOpen}
          images={shots.map((s) => s.src)}
          title={`${title} ${build.label}, ${view.label.toLowerCase()}`}
          index={index}
          onIndex={(n) => setIndex((n + count) % count)}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </motion.div>
  );
};
