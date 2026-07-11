"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";
import { Lightbox } from "@/components/Lightbox";
import { initials } from "@/lib/projects";

/* Lightweight photo carousel for project cards — slide track + prev/next +
   dots, swipeable. Click a real image to enlarge it in a fullscreen Lightbox.
   No images yet ⇒ renders a branded placeholder tile. */

const SWIPE_PX = 60; // drag distance that commits a slide change
const TAP_SLOP = 6; // pointer travel (px) still treated as a tap, not a drag

type CarouselProps = {
  images: string[];
  title: string;
  coverLayoutId?: string; // shared-element id for slide 0 (thumbnail morph)
};

const PlaceholderTile = ({ title }: { title: string }) => (
  <div
    className="flex h-full w-full shrink-0 items-center justify-center"
    style={{ background: c.surface2 }}
  >
    <span className="text-7xl font-black leading-none" style={{ color: "rgba(236,236,234,0.08)" }}>
      {initials(title)}
    </span>
  </div>
);

export const Carousel = ({ images, title, coverLayoutId }: CarouselProps) => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const downXY = useRef<{ x: number; y: number } | null>(null);
  const hasImages = images.length > 0;
  const count = images.length || 1; // single branded tile when no images yet

  const go = (n: number) => setIndex((n + count) % count);

  return (
    <div role="group" aria-roledescription="carousel" aria-label={`${title} screenshots`}>
      <div className="relative overflow-hidden rounded-xl" style={{ background: c.surface2 }}>
        <motion.div
          className="flex aspect-video"
          style={{ touchAction: "pan-y" }}
          animate={{ x: `${-index * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_SNAPPY }}
          onPointerDown={(e) => {
            downXY.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            // Swipe from the raw pointer travel — no framer `drag`, so the
            // index-driven `animate` owns `x` alone (dragging it too made the
            // track flash back to slide 0 before landing on the next one).
            const d = downXY.current;
            if (!d || count <= 1) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(e.clientY - d.y)) {
              go(dx < 0 ? index + 1 : index - 1);
            }
          }}
          onClickCapture={(e) => {
            const d = downXY.current;
            if (!d) return;
            // A swipe drags the pointer; a tap barely moves it. Swallow the
            // click after a drag so it never opens the lightbox.
            if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_SLOP) {
              e.stopPropagation();
              return;
            }
            if (hasImages) setLightboxOpen(true);
          }}
        >
          {hasImages
            ? images.map((src, i) => (
                <motion.div
                  key={src}
                  layoutId={i === 0 ? coverLayoutId : undefined}
                  whileHover={reduce ? undefined : { scale: 1.03 }}
                  className="group/slide relative h-full w-full shrink-0 cursor-zoom-in"
                >
                  <Image
                    src={src}
                    alt={`${title} — screenshot ${i + 1} of ${count}`}
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-contain"
                    draggable={false}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-2 rounded-full p-1.5 opacity-0 transition-opacity duration-200 group-hover/slide:opacity-100"
                    style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
                  >
                    <FiMaximize2 className="text-sm" />
                  </span>
                </motion.div>
              ))
            : <PlaceholderTile title={title} />}
        </motion.div>

        {count > 1 && (
          <>
            <motion.button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(index - 1)}
              whileHover={{ scale: 1.15, color: "#ECECEA" }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="absolute left-2 top-1/2 rounded-full p-2"
              style={{ background: "rgba(24,31,28,0.7)", color: c.muted, y: "-50%" }}
            >
              <FiChevronLeft />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(index + 1)}
              whileHover={{ scale: 1.15, color: "#ECECEA" }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="absolute right-2 top-1/2 rounded-full p-2"
              style={{ background: "rgba(24,31,28,0.7)", color: c.muted, y: "-50%" }}
            >
              <FiChevronRight />
            </motion.button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-1.5 flex justify-center">
          {/* 24px buttons around the 8px dots — a real touch target (WCAG
              2.5.8) without changing the visual. */}
          {Array.from({ length: count }, (_, i) => (
            <motion.button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: EASE_SNAPPY }}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className="h-2 w-2 rounded-full transition-colors"
                style={{ background: i === index ? c.accent : c.line }}
              />
            </motion.button>
          ))}
        </div>
      )}

      {hasImages && (
        <Lightbox
          open={lightboxOpen}
          images={images}
          title={title}
          index={index}
          onIndex={go}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
