"use client";

import { motion } from "framer-motion";
import { c } from "@/components/palette";

export const Footer = () => {
  return (
    <motion.footer
      className="mt-auto pt-10 text-center text-sm"
      style={{ color: c.muted }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p>&copy; {new Date().getFullYear()} Jack Preston. Designed &amp; built in Auckland, New Zealand.</p>
    </motion.footer>
  );
};
