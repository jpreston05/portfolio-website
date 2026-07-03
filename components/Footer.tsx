"use client";

import { motion } from "framer-motion";
import { c } from "@/components/palette";

export const Footer = () => {
  return (
    <motion.footer
      className="px-[5%] py-8 text-center text-sm"
      style={{ background: c.bg, color: c.muted }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <p>&copy; {new Date().getFullYear()} Jack Preston — designed &amp; built in Auckland.</p>
    </motion.footer>
  );
};
