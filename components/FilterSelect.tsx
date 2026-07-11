"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* The MOBILE face of the Projects / Timeline filters — below sm the segmented
   pill row can't fit, so both pages swap it for this dropdown (`sm:hidden` here,
   `hidden sm:inline-flex` on the pill row). A proper listbox: the trigger opens
   an options popover, arrow keys move the active option, Enter/Space commit,
   Esc closes and restores focus, outside clicks dismiss. */

export type FilterOption = {
  id: string;
  label: string;
  count: number;
};

type FilterSelectProps = {
  label: string; // accessible name, e.g. "Filter projects"
  value: string;
  options: FilterOption[];
  onChange: (id: string) => void;
  surface?: string; // trigger bg — matches the page's segmented-control track
  className?: string;
};

export const FilterSelect = ({
  label,
  value,
  options,
  onChange,
  surface = c.surface,
  className = "",
}: FilterSelectProps) => {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.id === value) ?? options[0];

  const openList = () => {
    setActiveIndex(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  };
  const closeList = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };
  const commit = (id: string) => {
    onChange(id);
    closeList();
  };

  // Focus the list when it opens (aria-activedescendant carries the position).
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Outside pointer-down dismisses without stealing the next tap's focus.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(options[activeIndex].id);
        break;
      case "Escape":
        e.preventDefault();
        closeList();
        break;
      case "Tab":
        closeList(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={label}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            openList();
          }
        }}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium"
        style={{ color: c.text, background: surface }}
      >
        <span>
          {selected.label}
          <span className="ml-1.5 text-xs" style={{ color: c.muted }}>
            {selected.count}
          </span>
        </span>
        <motion.span
          aria-hidden
          style={{ color: c.muted }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_SNAPPY }}
        >
          <FiChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={`${listboxId}-${options[activeIndex].id}`}
            onKeyDown={onListKeyDown}
            className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_40px_rgba(0,0,0,0.45)] focus:outline-none"
            style={{ background: c.surface2 }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: EASE_SNAPPY }}
          >
            {options.map((option, i) => {
              const isSelected = option.id === value;
              const isActive = i === activeIndex;
              return (
                <motion.li
                  key={option.id}
                  id={`${listboxId}-${option.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActiveIndex(i)}
                  onClick={() => commit(option.id)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
                  style={{ color: isSelected ? c.text : c.muted }}
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0)",
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <span>
                    {option.label}
                    <span className="ml-1.5 text-xs opacity-60">{option.count}</span>
                  </span>
                  {isSelected && <FiCheck aria-hidden className="shrink-0" />}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
