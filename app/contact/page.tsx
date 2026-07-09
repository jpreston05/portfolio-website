"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { c } from "@/components/palette";

/* /contact — the shared form as its own page (the nav CTA lands here). */

export default function ContactPage() {
  return (
    <>
      <motion.div
        className="relative z-10 flex min-h-screen flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-16 pt-26 sm:px-6">
          <header className="mb-8">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: c.text }}
            >
              Let&apos;s talk<span style={{ color: c.accent }}>.</span>
            </h1>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
              Have a role, a project, or just want to say hi? Send me a message
              and I&apos;ll get back to you.
            </p>
          </header>

          <section
            className="rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)] sm:p-8"
            style={{ background: c.surface }}
          >
            <ContactForm />
          </section>

          {/* Elsewhere — the funnel shouldn't end on a single channel. */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/jpreston05"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:text-[#ECECEA]"
              style={{ color: c.muted, background: c.surface }}
            >
              <FaGithub aria-hidden />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jackdpreston/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:text-[#ECECEA]"
              style={{ color: c.muted, background: c.surface }}
            >
              <FaLinkedin aria-hidden />
              LinkedIn
            </a>
          </div>
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
