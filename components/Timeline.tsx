"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { FilterSelect } from "@/components/FilterSelect";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";
import {
  CATEGORY_LABELS,
  milestones,
  overviewMilestones,
  type Milestone,
  type TimelineCategory,
} from "@/lib/timeline";

/* The /timeline list: category tabs (Overview = a curated cross-section) over
   a dated rail of entry cards. Each row is [date | rail dot + line | card];
   below sm the date column folds into the card. An entry with a `detail`
   expands in place (several may be open at once); one-liners render static. */

type Tab = "overview" | TimelineCategory;

// Explicit order: most recent life-phase first, after the curated Overview.
const TAB_ORDER: TimelineCategory[] = ["career", "university", "highschool"];
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  ...TAB_ORDER.map((id) => ({ id, label: CATEGORY_LABELS[id] })),
];

const countFor = (id: Tab) =>
  id === "overview"
    ? overviewMilestones.length
    : milestones.filter((m) => m.category === id).length;

const TimelineEntry = ({
  milestone,
  first,
  last,
  showCategory,
  open,
  onToggle,
}: {
  milestone: Milestone;
  first: boolean;
  last: boolean;
  showCategory: boolean; // only on Overview, where categories are mixed
  open: boolean;
  onToggle: () => void;
}) => {
  const reduce = useReducedMotion();
  const { category, when, title, org, blurb, detail } = milestone;
  const expandable = !!detail;

  const Head = (
    <>
      <span className="block min-w-0">
        {/* Category chip (Overview only) + the date on phones, where the date
            column is hidden. Nothing to show ⇒ the whole row drops out. */}
        <span
          className={`mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 ${
            showCategory ? "" : "sm:hidden"
          }`}
        >
          {showCategory && (
            <span
              className="rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{ background: c.bg, color: c.muted }}
            >
              {CATEGORY_LABELS[category]}
            </span>
          )}
          <span className="text-xs sm:hidden" style={{ color: c.muted }}>
            {when}
          </span>
        </span>
        <span className="block text-lg font-semibold leading-snug" style={{ color: c.text }}>
          {title}
        </span>
        {org && (
          <span className="mt-0.5 block text-sm" style={{ color: c.muted }}>
            {org}
          </span>
        )}
        <span className="mt-1.5 block text-sm leading-relaxed" style={{ color: c.muted }}>
          {blurb}
        </span>
      </span>
      {expandable && (
        // Colour lives in classes (not inline style) so the group-hover wins —
        // the chevron lightening is the card's "this expands" hover hint.
        <motion.span
          aria-hidden
          className="mt-0.5 shrink-0 text-lg text-[#A6B0A8] transition-colors group-hover:text-[#ECECEA]"
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
      {/* Date column — right-aligned against the rail (sm+). */}
      <p
        className="hidden w-24 shrink-0 pt-[1.3rem] text-right text-xs leading-snug tabular-nums sm:block"
        style={{ color: c.muted }}
      >
        {when}
      </p>

      {/* Rail: line segment above the marker, the squircle marker (same shape
          language as the cards and buttons), line segment below. The
          row's bottom padding is inside this column's height, so the line runs
          unbroken through the gap between cards. */}
      <div aria-hidden className="flex flex-col items-center">
        <span className="h-6 w-0.5" style={{ background: first ? "transparent" : c.line }} />
        <span
          className="h-3 w-3 shrink-0 rounded-[4px]"
          style={{
            background: c.accent,
            // The newest entry in view gets a ring.
            ...(first && { outline: `2px solid ${c.accent}`, outlineOffset: 3 }),
          }}
        />
        <span className="w-0.5 flex-1" style={{ background: last ? "transparent" : c.line }} />
      </div>

      <div className={`min-w-0 flex-1 ${last ? "" : "pb-3"}`}>
        <div
          className="rounded-2xl depth-card"
          style={{ background: c.surface }}
        >
          {expandable ? (
            // The WHOLE card is the toggle — the detail lives inside the
            // button, so the hover lift and the click target always match the
            // card's full (collapsed or expanded) size.
            <motion.button
              type="button"
              aria-expanded={open}
              onClick={onToggle}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="group block w-full rounded-2xl p-5 text-left"
            >
              <span className="flex items-start justify-between gap-3">{Head}</span>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    className="block overflow-hidden"
                    initial={reduce ? { height: "auto" } : { height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: EASE_SNAPPY }}
                  >
                    <span
                      className="block max-w-[65ch] pt-3 text-sm leading-relaxed"
                      style={{ color: c.muted }}
                    >
                      {detail}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <div className="flex items-start justify-between gap-3 p-5">{Head}</div>
          )}
        </div>
      </div>
    </li>
  );
};

export const Timeline = () => {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("overview");
  // Multiple entries may be open at once, friendlier for scanning. Keyed by
  // slug so it survives a tab switch.
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
    <div>
      {/* Tab filter — same control as the /projects filter. Phones get a
          dropdown (the tab row doesn't fit); sm+ gets the segmented control
          with the sliding active pill. */}
      <div className="mb-8 sm:hidden">
        <FilterSelect
          options={TABS.map(({ id, label }) => ({ id, label, count: countFor(id) }))}
          value={tab}
          onChange={(id) => setTab(id as Tab)}
          ariaLabel="Filter timeline by category"
          trackBg={c.surface}
        />
      </div>
      <div
        className="depth-track mb-8 hidden gap-1 rounded-2xl p-1.5 sm:inline-flex"
        style={{ background: c.surface }}
      >
        {TABS.map(({ id, label }) => {
          const isActive = tab === id;
          return (
            <motion.button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTab(id)}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="relative rounded-[10px] px-4 py-2 text-sm font-medium"
              style={{ color: isActive ? c.text : c.muted }}
            >
              {isActive && (
                <motion.span
                  layoutId="timeline-tab-pill"
                  className="depth-chip absolute inset-0 rounded-[10px]"
                  style={{ background: c.surface2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">
                {label}
                {/* Full-opacity muted — dimming fell under the 4.5:1 AA floor. */}
                <span className="ml-1.5 text-xs" style={{ color: c.muted }}>
                  {countFor(id)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Keyed by tab so the list cross-fades on switch; the rail's first/last
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
            first={i === 0}
            last={i === shown.length - 1}
            showCategory={tab === "overview"}
            open={open.has(m.slug)}
            onToggle={() => toggle(m.slug)}
          />
        ))}
      </motion.ol>
    </div>
  );
};
