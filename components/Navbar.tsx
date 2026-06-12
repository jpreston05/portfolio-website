"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const navLinkClass =
  "relative cursor-pointer font-medium text-ink transition-colors hover:text-accent " +
  "after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-0 after:bg-accent " +
  "after:transition-[width] after:duration-300 after:content-[''] hover:after:w-full";

export const Navbar = () => {
  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-[1000] flex items-center justify-between border-b border-line bg-[rgba(15,23,42,0.8)] px-[5%] py-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-[10px]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-2xl font-bold text-accent [text-shadow:0_0_10px_rgba(244,114,182,0.3)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Jack Preston
      </motion.div>

      <motion.ul
        className="flex list-none gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.li variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a href="#home" className={navLinkClass}>
            Home
          </a>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a href="#projects" className={navLinkClass}>
            Projects
          </a>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a href="#timeline" className={navLinkClass}>
            Timeline
          </a>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <a href="#contact" className={navLinkClass}>
            Contact
          </a>
        </motion.li>
      </motion.ul>
    </motion.nav>
  );
};
