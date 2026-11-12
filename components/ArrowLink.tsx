"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { EASE_SNAPPY } from "@/lib/motion";

const MotionLink = motion.create(Link);

/* The arrow/text link at the foot of a card ("Full timeline →"): nudges right
   and goes accent on hover. Colour lives in a class (not inline style) so the
   framer hover colour wins. */
export const ArrowLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <MotionLink
    href={href}
    whileHover={{ x: 3, color: "#DB5461" }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2, ease: EASE_SNAPPY }}
    className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-[#A6B0A8]"
  >
    {children}
    <FiArrowRight aria-hidden />
  </MotionLink>
);
