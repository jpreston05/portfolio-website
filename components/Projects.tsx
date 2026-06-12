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

const projects = [
  { title: "Project One", description: "A brief description of Project One." },
  { title: "Project Two", description: "A brief description of Project Two." },
  { title: "Project Three", description: "A brief description of Project Three." },
];

export const Projects = () => {
  return (
    <motion.section
      id="projects"
      className="relative bg-bg px-[5%] py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.h2
        className="mb-12 text-center text-[2.5rem]"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        My Projects
      </motion.h2>
      <motion.div
        className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {projects.map((project) => (
          <motion.div
            key={project.title}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all hover:border-accent hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            variants={fadeInUp}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-10 [background:linear-gradient(135deg,#1e0161_0%,#3365bb_100%)]"
            />
            <div
              className="h-60 bg-cover bg-center"
              style={{ backgroundImage: "url('/projects/placeholder.png')" }}
            />
            <h3 className="px-6 pb-2 pt-6 text-2xl text-ink">{project.title}</h3>
            <p className="grow px-6 pb-4 text-muted">{project.description}</p>
            <div className="flex flex-wrap gap-2 px-6 pb-6 text-[0.9rem]">
              <span className="rounded-[50px] border border-[rgba(244,114,182,0.2)] bg-white/10 px-[0.8rem] py-[0.3rem] text-[0.8rem] text-accent">
                *temp*
              </span>
              <span className="rounded-[50px] border border-[rgba(244,114,182,0.2)] bg-white/10 px-[0.8rem] py-[0.3rem] text-[0.8rem] text-accent">
                *temp*
              </span>
              <span className="rounded-[50px] border border-[rgba(244,114,182,0.2)] bg-white/10 px-[0.8rem] py-[0.3rem] text-[0.8rem] text-accent">
                *temp*
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
