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
          animate={{ x: `${-index * 100}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_SNAPPY }}
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_PX) go(index + 1);
            else if (info.offset.x > SWIPE_PX) go(index - 1);
          }}
          onPointerDown={(e) => {
            downXY.current = { x: e.clientX, y: e.clientY };
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
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors hover:text-[#ECECEA]"
              style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors hover:text-[#ECECEA]"
              style={{ background: "rgba(24,31,28,0.7)", color: c.muted }}
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="h-2 w-2 rounded-full transition-colors"
              style={{ background: i === index ? c.accent : c.line }}
            />
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
