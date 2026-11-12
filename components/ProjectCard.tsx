"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiImage } from "react-icons/fi";
import { Label } from "@/components/Label";
import { Lightbox } from "@/components/Lightbox";
import { c } from "@/components/palette";
import { CATEGORY_LABELS, initials, type Project } from "@/lib/projects";
import { EASE_SNAPPY } from "@/lib/motion";

/* One project as a static card: cover, category, title, tagline, optional
   metrics, stack, links. Shared by /projects and the home Featured grid.
   The cover is a button that opens the fullscreen Lightbox on ALL of the
   project's screenshots; image-less projects get a branded initials tile. */

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

type ProjectCardProps = {
  project: Project;
  tone?: "surface" | "surface2"; // surface on the page bg, surface2 inside a SectionCard
  heading?: "h2" | "h3";
};

export const ProjectCard = ({ project, tone = "surface", heading: Heading = "h2" }: ProjectCardProps) => {
  const reduce = useReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { slug, title, category, event, tagline, metrics, stack, links, images } = project;
  const count = images.length;

  return (
    <motion.article
      id={slug}
      layout="position"
      className="flex scroll-mt-26 flex-col rounded-2xl p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)]"
      style={{ background: tone === "surface" ? c.surface : c.surface2 }}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: EASE_SNAPPY }}
    >
      {count > 0 ? (
        <motion.button
          type="button"
          aria-label={`View ${title} screenshots (${count})`}
          onClick={() => setLightboxOpen(true)}
          initial="rest"
          whileHover={reduce ? undefined : "hover"}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl"
          style={{ background: c.bg, cursor: "zoom-in" }}
        >
          <motion.div
            className="absolute inset-0"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.03 } }}
            transition={{ duration: 0.3, ease: EASE_SNAPPY }}
          >
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(min-width: 1280px) 440px, (min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              className="object-contain"
              draggable={false}
            />
          </motion.div>
          {count > 1 && (
            <span
              aria-hidden
              className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium"
              style={{ background: "rgba(24,31,28,0.8)", color: c.text }}
            >
              <FiImage />
              {count}
            </span>
          )}
        </motion.button>
      ) : (
        <div
          className="flex aspect-[16/10] w-full items-center justify-center rounded-xl"
          style={{ background: c.bg }}
        >
          <span
            className="text-6xl font-black leading-none"
            style={{ color: "rgba(236,236,234,0.08)" }}
          >
            {initials(title)}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col px-3 pb-2 pt-4">
        <Label className="mb-1.5">
          {CATEGORY_LABELS[category]}
          {event && ` · ${event}`}
        </Label>
        <Heading className="text-xl font-bold tracking-tight" style={{ color: c.text }}>
          {title}
        </Heading>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: c.muted }}>
          {tagline}
        </p>

        {metrics && metrics.length > 0 && (
          <p
            className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-lg px-3 py-2 text-xs font-semibold"
            style={{ background: c.bg, color: c.text }}
          >
            {metrics.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
        )}

        {stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 text-xs"
                style={{ background: c.bg, color: c.muted }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {(links.github || links.live) && (
          // mt-auto pins the link row to the card floor so rows of cards align.
          <div className="mt-auto pt-4">
            <div
              className="flex flex-wrap gap-5 pt-3"
              style={{ borderTop: `1px solid ${c.line}` }}
            >
              {links.github && <ExternalLink href={links.github}>GitHub</ExternalLink>}
              {links.live && <ExternalLink href={links.live}>Live</ExternalLink>}
            </div>
          </div>
        )}
      </div>

      {count > 0 && (
        <Lightbox
          open={lightboxOpen}
          images={images}
          title={title}
          index={index}
          onIndex={(n) => setIndex((n + count) % count)}
          onClose={() => {
            setLightboxOpen(false);
            setIndex(0); // the cover always shows (and reopens on) the first shot
          }}
        />
      )}
    </motion.article>
  );
};
