"use client";

import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cb } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaGithub, FaLinkedin } from "react-icons/fa";

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

const codeContent = `jack@portfolio:~$ ls
about_me.txt  projects/  contact.sh

jack@portfolio:~$ cat about_me.txt

# ─────────────────────────────
#  ABOUT ME
# ─────────────────────────────

name      : Jack Preston
origin    : Waihi Beach, New Zealand
location  : Auckland, New Zealand
role      : Student @ University of Auckland

degrees   :
  [0] BE (Hons) Software Engineering
  [1] BCom Finance & Management

languages : Java  Python  C++  C
            JavaScript  HTML  CSS  SQL
frameworks: React

traits    :
  - perfectionist
  - lifelong learner
  - problem solver
  - team player

mission   : "Bringing ideas to life through
             code, one project at a time."

jack@portfolio:~$ █`;

export const Hero = () => {
  return (
    <motion.section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-[5%] [background:linear-gradient(135deg,#1e0161_0%,#3365bb_100%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-12 pt-[120px] text-center lg:flex-row lg:items-start lg:gap-16 lg:pt-[100px] lg:text-left">
        <motion.div
          className="relative z-[2] max-w-full flex-1 lg:max-w-[600px]"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="mb-6 inline-block rounded-[50px] border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-[5px]"
            variants={fadeInUp}
          >
            <span>Welcome to my portfolio</span>
          </motion.div>
          <motion.h1
            className="relative mb-4 text-7xl font-extrabold leading-none [text-shadow:0_0_10px_rgba(255,255,255,0.5)]"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            Jack Preston
          </motion.h1>
          <motion.h2
            className="mb-6 text-[2rem] font-semibold text-accent"
            variants={fadeInUp}
          >
            Aspiring Software Engineering
          </motion.h2>
          <motion.p
            className="mb-8 text-[1.1rem] leading-[1.7]"
            variants={fadeInUp}
          >
            Hi! I&apos;m Jack, a passionate Software Engineering, Finance and Management
            student at The University of Auckland. I love creating innovative solutions and
            learning new technologies. Explore my projects and feel free to reach out!
          </motion.p>

          <motion.div
            className="mb-8 flex justify-center gap-4 lg:justify-start"
            variants={staggerContainer}
          >
            <motion.a
              href="#projects"
              className="inline-flex min-w-[160px] cursor-pointer items-center justify-center rounded-[50px] border-2 border-white bg-white px-8 py-[0.8rem] text-base font-semibold text-primary shadow-[0_4px_15px_rgba(255,255,255,0.2)] transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="relative inline-flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-[50px] border-2 border-white bg-transparent px-8 py-[0.8rem] text-base font-semibold text-white shadow-[0_4px_15px_rgba(255,255,255,0.2)] backdrop-blur-[5px] transition-all hover:bg-white/10 before:absolute before:left-[-100%] before:top-0 before:h-full before:w-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:transition-all before:duration-500 before:content-[''] hover:before:left-[100%]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.a>
          </motion.div>
          <motion.div
            className="flex justify-center gap-6 lg:justify-start"
            variants={staggerContainer}
          >
            <motion.a
              href="https://github.com/jpreston05"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-2xl text-white transition-colors hover:text-accent"
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/jackdpreston/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-2xl text-white transition-colors hover:text-accent"
            >
              <FaLinkedin />
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative hidden max-w-[600px] flex-1 md:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full">
            <SyntaxHighlighter
              language="bash"
              customStyle={{
                margin: 0,
                padding: "2rem",
                height: "100%",
                borderRadius: "4px",
                background: "#000000",
                marginBottom: 50,
              }}
              style={cb}
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>

          <motion.div
            className="absolute bottom-8 right-[-2rem] rounded-[15px] border border-white/20 bg-white/10 px-6 py-4 shadow-[0_10px_20px_rgba(0,0,0,0.2)] backdrop-blur-[10px]"
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">💻</span>
              <span className="text-[0.9rem] font-medium text-white">
                Currrently working on this website!
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
