"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilterSelect } from "@/components/FilterSelect";
import { ProjectCard } from "@/components/ProjectCard";
import { c } from "@/components/palette";
import { CATEGORY_LABELS, projects, type ProjectCategory } from "@/lib/projects";
import { EASE_SNAPPY } from "@/lib/motion";

/* The /projects grid — a category filter over static ProjectCards. Each card
   has id=<slug>, so /projects#<slug> lands on it (used by nothing in-app yet,
   but shareable). */

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

export const ProjectShowcase = () => {
  const [filter, setFilter] = useState<Filter>("all");

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
        className="depth-track mb-8 hidden gap-1 rounded-2xl p-1.5 sm:inline-flex"
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
              className="relative rounded-[10px] px-4 py-2 text-sm font-medium"
              style={{ color: isActive ? c.text : c.muted }}
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="depth-chip absolute inset-0 rounded-[10px]"
                  style={{ background: c.surface2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">
                {label}
                {/* Full-opacity muted — the dimmed version fell under the
                    4.5:1 AA floor. */}
                <span className="ml-1.5 text-xs" style={{ color: c.muted }}>
                  {countFor(id)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Two columns wherever a column can stay ≥ ~330px: md (no rail yet) and
          xl (rail + room). At lg the rail leaves ~530px, so one column. */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </AnimatePresence>

        {shown.length === 0 && (
          <p className="text-sm" style={{ color: c.muted }}>
            No projects in this category yet.
          </p>
        )}
      </div>
    </div>
  );
};
