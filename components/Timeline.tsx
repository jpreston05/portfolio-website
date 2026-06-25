"use client";

import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

const milestones = [
  {
    when: "2023 — present",
    what: "BE(Hons) Software Engineering & BCom",
    where: "University of Auckland",
  },
  {
    when: "2024",
    what: "First internship",
    where: "Placeholder — to be filled in",
  },
  {
    when: "2022",
    what: "Started programming seriously",
    where: "Self-directed projects",
  },
];

export const Timeline = () => (
  <SectionCard id="timeline" eyebrow="03" title="Timeline">
    <ol className="flex flex-col">
      {milestones.map((m, i) => (
        <li key={m.when} className="flex gap-4">
          {/* rail */}
          <div className="flex flex-col items-center">
            <span
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: c.accent }}
            />
            {i < milestones.length - 1 && (
              <span className="w-px flex-1" style={{ background: c.line }} />
            )}
          </div>
          <div className="pb-8">
            <p className="font-mono text-xs" style={{ color: c.muted2 }}>
              {m.when}
            </p>
            <p className="mt-1 font-semibold" style={{ color: c.text }}>
              {m.what}
            </p>
            <p className="text-sm" style={{ color: c.muted }}>
              {m.where}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </SectionCard>
);
