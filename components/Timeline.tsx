"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";
import {
  CATEGORY_LABELS,
  milestones,
  overviewMilestones,
  type Milestone,
  type TimelineCategory,
} from "@/lib/timeline";

/* Milestone list on the /timeline page: same tonal card surface as SectionCard,
   without the heading (the page's h1 carries it). Tabs filter by category
   (Overview = a curated cross-section); each entry with a `detail` expands to its
   fuller story. Filter-pill + accordion patterns mirror ProjectShowcase. */

type Tab = "overview" | TimelineCategory;

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  ...(Object.keys(CATEGORY_LABELS) as TimelineCategory[]).map((id) => ({
    id,
    label: CATEGORY_LABELS[id],
  })),
];

const countFor = (id: Tab) =>
  id === "overview"
    ? overviewMilestones.length
    : milestones.filter((m) => m.category === id).length;

const TimelineEntry = ({
  milestone,
  last,
  open,
  onToggle,
}: {
  milestone: Milestone;
  last: boolean;
  open: boolean;
  onToggle: () => void;
}) => {
  const reduce = useReducedMotion();
  const { slug, when, title, org, blurb, detail } = milestone;
  const expandable = !!detail;

  const Head = (
    <>
      <div className="min-w-0">
        <p className="font-mono text-xs" style={{ color: c.muted }}>
          {when}
        </p>
        <p className="mt-1 font-semibold" style={{ color: c.text }}>
          {title}
        </p>
        {org && (
          <p className="text-sm" style={{ color: c.muted }}>
            {org}
          </p>
        )}
        <p className="mt-1 text-sm leading-relaxed" style={{ color: c.muted }}>
          {blurb}
        </p>
      </div>
      {expandable && (
        <motion.span
          aria-hidden
          className="mt-0.5 shrink-0 text-lg"
          style={{ color: c.muted }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: EASE_SNAPPY }}
        >
          <FiChevronDown />
        </motion.span>
      )}
    </>
  );

  return (
    <li className="flex gap-4">
      {/* rail: a uniform dot per entry + a connector line */}
      <div className="flex flex-col items-center">
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: c.accent }}
        />
        {!last && <span className="w-px flex-1" style={{ background: c.line }} />}
      </div>

      <div className={`min-w-0 flex-1 ${last ? "" : "pb-8"}`}>
        {expandable ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${slug}-details`}
            onClick={onToggle}
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            {Head}
          </button>
        ) : (
          <div className="flex items-start justify-between gap-3">{Head}</div>
        )}

        {expandable && (
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={`${slug}-details`}
                className="overflow-hidden"
                initial={reduce ? { height: "auto" } : { height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SNAPPY }}
              >
                <p className="pt-3 text-sm leading-relaxed" style={{ color: c.muted }}>
                  {detail}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </li>
  );
};

export const Timeline = () => {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("overview");
  // Multiple entries may be open at once, friendlier for scanning than the
  // one-at-a-time projects accordion. Keyed by slug so it survives a tab switch.
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  const shown =
    tab === "overview" ? overviewMilestones : milestones.filter((m) => m.category === tab);

  return (
    <motion.section
      className="rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)] sm:p-8"
      style={{ background: c.surface }}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_SNAPPY }}
    >
      {/* Tab filter: solid track, sliding active pill (matches the nav / projects). */}
      <div
        className="mb-8 inline-flex flex-wrap gap-1 rounded-full p-1.5"
        style={{ background: c.bg }}
      >
        {TABS.map(({ id, label }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTab(id)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? "" : "hover:text-[#ECECEA]"
              }`}
              style={{ color: isActive ? c.text : c.muted }}
            >
              {isActive && (
                <motion.span
                  layoutId="timeline-tab-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: c.surface2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">
                {label}
                <span className="ml-1.5 font-mono text-xs opacity-50">{countFor(id)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Keyed by tab so the list cross-fades on switch; the rail's connector
          logic (index within `shown`) then never animates mid-transition. */}
      <motion.ol
        key={tab}
        className="flex flex-col"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SNAPPY }}
      >
        {shown.map((m, i) => (
          <TimelineEntry
            key={m.slug}
            milestone={m}
            last={i === shown.length - 1}
            open={open.has(m.slug)}
            onToggle={() => toggle(m.slug)}
          />
        ))}
      </motion.ol>
    </motion.section>
  );
};
