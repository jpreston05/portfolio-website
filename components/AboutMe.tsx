"use client";

import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

/* Home "About me" — the personal story. The numbers live in StatTiles and the
   milestones in /timeline. Edit PARAGRAPHS to update. It shares a row with
   Tech stack at xl, so the copy is long enough to fill a card of that height. */

const PARAGRAPHS = [
  "I grew up in Waihi Beach, a small rural town in New Zealand, attending a primary school of under 300 students and a high school of around 800. My interest in programming started early. At around age 10, I was building simple games on my iPad using block-coding apps.",
  "In high school, I built on that foundation: I learned HTML and CSS and built my first website in Year 10, studied searching and sorting algorithms, and started learning Java. That's when I knew software engineering was the path for me, and it's been my goal ever since.",
];

export const AboutMe = () => (
  <SectionCard id="about" title="About me">
    {/* 60ch cap ≈ 75 real characters/line in Inter (ch measures the wide "0"). */}
    <div className="flex max-w-[60ch] flex-col gap-3">
      {PARAGRAPHS.map((p) => (
        <p key={p} className="text-sm leading-relaxed" style={{ color: c.muted }}>
          {p}
        </p>
      ))}
    </div>
  </SectionCard>
);
