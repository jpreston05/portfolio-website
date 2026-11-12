"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ContactForm } from "@/components/ContactForm";
import { STATUS } from "@/components/Herov2";
import { Label } from "@/components/Label";
import { c } from "@/components/palette";
import { EASE_SNAPPY } from "@/lib/motion";

/* /contact — the form (the nav CTA lands here) beside a column of context
   cards, so the page uses the frame's width instead of a lone 640px form.
   Two columns at xl; stacked below (form first). Renders the right column
   only; SiteChrome owns the frame (rail + footer). */

const CARD =
  "rounded-2xl p-6 depth-card";

// Mirrors the page intro ("a role, a project, or just want to say hi").
const REASONS = [
  "Internship and graduate roles",
  "A project or hackathon idea",
  "A question about anything on this site",
  "Just saying hi",
];

const ELSEWHERE = [
  { label: "GitHub", href: "https://github.com/jpreston05", icon: <FaGithub aria-hidden /> },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jackdpreston/",
    icon: <FaLinkedin aria-hidden />,
  },
];

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
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

      {/* Rows stretch (the grid default), so at xl the form card is exactly as
          tall as the card column beside it and their bottom edges line up. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-8">
        <section
          aria-label="Send a message"
          className={`${CARD} flex flex-col sm:p-8`}
          style={{ background: c.surface }}
        >
          <ContactForm />
        </section>

        <aside className="flex flex-col gap-6 xl:gap-8">
          <section className={CARD} style={{ background: c.surface }}>
            <Label className="mb-3">What I&apos;m looking for</Label>
            <p className="text-lg font-semibold leading-snug" style={{ color: c.text }}>
              {STATUS}
            </p>
            <p className="mt-2 text-sm" style={{ color: c.muted }}>
              Based in Auckland, New Zealand.
            </p>
          </section>

          <section className={CARD} style={{ background: c.surface }}>
            <Label className="mb-3">Good reasons to write</Label>
            <ul className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: c.accent }}
                  />
                  <span style={{ color: c.muted }}>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Elsewhere — the funnel shouldn't end on a single channel (and on
              phones the rail, which also carries these, isn't shown). */}
          <section className={CARD} style={{ background: c.surface }}>
            <Label className="mb-3">Elsewhere</Label>
            <div className="flex flex-wrap gap-3">
              {ELSEWHERE.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -2, color: "#ECECEA" }}
                  transition={{ duration: 0.2, ease: EASE_SNAPPY }}
                  className="depth-chip inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
                  style={{ color: c.muted, background: c.bg }}
                >
                  {icon}
                  {label}
                </motion.a>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
