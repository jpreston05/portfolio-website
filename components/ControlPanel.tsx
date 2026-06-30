"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronUp, FiMoon, FiZap } from "react-icons/fi";
import { c } from "@/components/palette";
import { useBackground } from "@/components/Background";

type ToggleProps = {
  on: boolean;
  set: (v: boolean) => void;
  icon: React.ReactNode;
  label: string;
};

const Toggle = ({ on, set, icon, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => set(!on)}
    className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition-colors"
    style={{ color: c.muted }}
  >
    <span className="inline-flex items-center gap-2">
      <span className="text-base">{icon}</span>
      {label}
    </span>
    <span
      className="relative h-5 w-9 rounded-full transition-colors"
      style={{ background: on ? c.accent : c.line }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
        style={{ left: on ? "1.125rem" : "0.125rem", background: c.bg }}
      />
    </span>
  </button>
);

/* Floating control panel — sketch bottom-right. Visual stub for now:
   expands upward to reveal theme + motion toggles. Wire to real
   context providers later. */
export const ControlPanel = () => {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  // "Animations" drives the background glow drift (static when off).
  const { animated, setAnimated } = useBackground();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-56 rounded-xl border p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur"
            style={{ borderColor: c.line, background: `${c.surface}f2` }}
          >
            <p
              className="px-3 pb-1 pt-1.5 text-[0.7rem] font-medium uppercase tracking-wider"
              style={{ color: c.muted2 }}
            >
              Display
            </p>
            <Toggle on={dark} set={setDark} icon={<FiMoon />} label="Dark mode" />
            <Toggle
              on={animated}
              set={setAnimated}
              icon={<FiZap />}
              label="Animations"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Display settings"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-colors"
        style={{ borderColor: c.line, background: c.surface, color: c.text }}
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronUp className="text-lg" />
        </motion.span>
      </button>
    </div>
  );
};
