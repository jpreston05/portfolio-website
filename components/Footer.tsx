"use client";

import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      className="border-t border-line bg-bg p-8 text-center text-ink"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p>&copy; 2025 JackP. All Rights Reserved.</p>
    </motion.footer>
  );
};
