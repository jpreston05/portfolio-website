"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* Lightweight photo carousel for project cards — slide track + prev/next +
   dots, swipeable. No images yet ⇒ renders placeholder tiles so the mechanics
   are visible before real screenshots exist. */

const SWIPE_PX = 60; // drag distance that commits a slide change

type CarouselProps = { images: string[]; title: string };

const PlaceholderTile = ({ n }: { n: number }) => (
  <div
    className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-2"
    style={{ background: c.surface2 }}
  >
    <span className="text-6xl font-black leading-none" style={{ color: "rgba(236,236,234,0.08)" }}>
      JP.
    </span>
    <span className="font-mono text-xs" style={{ color: c.muted }}>
      screenshot {n} coming soon
    </span>
  </div>
);

export const Carousel = ({ images, title }: CarouselProps) => {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = images.length || 3; // 3 placeholder tiles when no images yet

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
        >
          {images.length > 0
            ? images.map((src, i) => (
                <div key={src} className="relative h-full w-full shrink-0">
                  <Image
                    src={src}
                    alt={`${title} — screenshot ${i + 1} of ${count}`}
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              ))
            : [1, 2, 3].map((n) => <PlaceholderTile key={n} n={n} />)}
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
    </div>
  );
};
