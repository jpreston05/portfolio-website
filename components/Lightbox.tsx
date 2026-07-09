"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* Fullscreen image viewer for the project Carousel. Presentational: the Carousel
   owns index/go, so navigating here also moves the inline track. Portalled to
   document.body so framer layout transforms / overflow-hidden ancestors can't
   clip or mis-position the fixed overlay. */

type LightboxProps = {
  open: boolean;
  images: string[];
  title: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export const Lightbox = ({ open, images, title, index, onIndex, onClose }: LightboxProps) => {
  const reduce = useReducedMotion();
  const count = images.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<Element | null>(null);

  // SSR guard: createPortal needs document, which isn't there on the server.
  // useSyncExternalStore returns false during SSR/first render, true on the
  // client — avoids a hydration mismatch without a setState-in-effect.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Keyboard: Esc closes, arrows navigate, Tab cycles inside the dialog (it's
  // aria-modal, so focus must not wander into the page behind the overlay).
  // Re-bound when index changes so the closure sees the current slide.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex(index + 1);
      else if (e.key === "ArrowLeft") onIndex(index - 1);
      else if (e.key === "Tab") {
        const items = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? []
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        const inside = dialogRef.current?.contains(active) ?? false;
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, onIndex, onClose]);

  // Body scroll lock (mirrors the Preloader idiom).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus the close button on open; restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const el = restoreRef.current;
      if (el instanceof HTMLElement && el.isConnected) el.focus();
    };
  }, [open]);

  if (!mounted) return null;

  const dur = reduce ? 0 : 0.2;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshot ${index + 1} of ${count}`}
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
          style={{ background: "rgba(16,18,15,0.92)" }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur, ease: EASE_SNAPPY }}
        >
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2.5 transition-colors hover:text-[#ECECEA]"
            style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
          >
            <FiX className="text-xl" />
          </button>

          <motion.div
            className="relative flex h-[88vh] w-[92vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: dur, ease: EASE_SNAPPY }}
          >
            <Image
              src={images[index]}
              alt={`${title} — screenshot ${index + 1} of ${count}`}
              fill
              sizes="92vw"
              className="object-contain"
              draggable={false}
              priority
            />
          </motion.div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(index - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition-colors hover:text-[#ECECEA]"
                style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex(index + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition-colors hover:text-[#ECECEA]"
                style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
              >
                <FiChevronRight className="text-xl" />
              </button>
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs"
                style={{ color: c.muted }}
              >
                {index + 1} / {count}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
