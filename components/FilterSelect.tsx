"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* The mobile face of the Projects / Timeline filters. On phones the segmented
   pill row doesn't fit, so instead of cramming or scrolling it we collapse to a
   dropdown: a pill trigger showing the current choice, opening a listbox of all
   options + counts. Keyboard-operable (arrows/Home/End/Esc, roving focus) and
   reduced-motion aware. Desktop keeps the segmented control (see each page). */

export type FilterOption = { id: string; label: string; count: number };

type Props = {
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
  trackBg: string; // matches the desktop track (surface on /projects, bg in the timeline card)
};

export const FilterSelect = ({ options, value, onChange, ariaLabel, trackBg }: Props) => {
  const reduce = useReducedMotion();
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const current = options.find((o) => o.id === value) ?? options[0];

  // Close on click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Move focus onto the selected option when the menu opens.
  useEffect(() => {
    if (!open) return;
    const items = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-opt]");
    items?.[Math.max(0, options.findIndex((o) => o.id === value))]?.focus();
  }, [open, options, value]);

  const close = (focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-opt]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (n: number) => {
      e.preventDefault();
      items[Math.max(0, Math.min(items.length - 1, n))]?.focus();
    };
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "ArrowDown") focusAt(i + 1);
    else if (e.key === "ArrowUp") focusAt(i - 1);
    else if (e.key === "Home") focusAt(0);
    else if (e.key === "End") focusAt(items.length - 1);
    // Tabbing away shouldn't leave an orphaned open menu behind.
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative z-30">
      <motion.button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        whileHover={{ filter: "brightness(1.18)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
        style={{ background: trackBg, color: c.text }}
      >
        <span>
          {current.label}
          {/* Count in full-opacity muted — the opacity-dimmed version fell to
              ~2.9:1, under the 4.5:1 AA floor. */}
          <span className="ml-1.5 font-mono text-xs" style={{ color: c.muted }}>
            {current.count}
          </span>
        </span>
        <motion.span
          aria-hidden
          className="text-base"
          style={{ color: c.muted }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: EASE_SNAPPY }}
        >
          <FiChevronDown />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            onKeyDown={onListKeyDown}
            className="absolute left-0 top-full z-30 mt-2 min-w-[13rem] overflow-hidden rounded-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
            style={{ background: c.surface2 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE_SNAPPY }}
          >
            {/* role="option" lives on the BUTTON (the element that receives
                focus), so screen readers announce "option, selected" rather
                than a bare button; the li is presentational. Active option =
                text-on-bg, the same active language as the desktop segmented
                control (accent-on-bg only hit 4.4:1). */}
            {options.map((o) => {
              const isActive = o.id === value;
              return (
                <li key={o.id} role="none">
                  <motion.button
                    data-opt
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    onClick={() => {
                      onChange(o.id);
                      close(true);
                    }}
                    whileHover={isActive ? undefined : { backgroundColor: "rgba(255,255,255,0.06)", color: "#ECECEA" }}
                    transition={{ duration: 0.15, ease: EASE_SNAPPY }}
                    className="flex w-full items-center justify-between gap-6 rounded-xl px-3 py-2.5 text-sm font-medium"
                    style={{
                      backgroundColor: isActive ? c.bg : "transparent",
                      color: isActive ? c.text : c.muted,
                    }}
                  >
                    <span>{o.label}</span>
                    <span className="font-mono text-xs" style={{ color: c.muted }}>
                      {o.count}
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
