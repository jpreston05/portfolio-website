"use client";

import { motion } from "framer-motion";
import { c } from "@/components/palette";

export const Footer = () => {
  return (
    <motion.footer
      className="rounded-2xl border p-6 text-center text-sm"
      style={{ borderColor: c.line, background: c.surface, color: c.muted }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p>&copy; 2025 Jack Preston. All rights reserved.</p>
    </motion.footer>
  );
};
