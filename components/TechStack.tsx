"use client";

import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

const groups = [
  { label: "Languages", items: ["Java", "Python", "C++", "C", "JavaScript", "SQL"] },
  { label: "Web", items: ["React", "Next.js", "HTML", "CSS"] },
  { label: "Tools", items: ["Git", "Linux", "Figma"] },
];

export const TechStack = () => (
  <SectionCard id="tech" title="Tech Stack">
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g.label}>
          <p
            className="mb-2 font-mono text-xs uppercase tracking-wider"
            style={{ color: c.muted }}
          >
            {g.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {g.items.map((item) => (
              <span
                key={item}
                className="rounded-lg px-3 py-1.5 text-sm transition-colors hover:text-[#ECECEA]"
                style={{ background: c.surface2, color: c.muted }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionCard>
);
