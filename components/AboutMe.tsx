"use client";

import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";

/* Home "About me" — the short personal paragraph. The numbers live in
   StatTiles and the story in /timeline. Edit PARAGRAPH to update. */

const PARAGRAPH =
  "I grew up in Waihi Beach, a small rural town in New Zealand, and started building games on an iPad at around age 10. I built my first website in Year 10 and have been aiming at software engineering ever since.";

export const AboutMe = () => (
  <SectionCard id="about" title="About me">
    {/* 60ch cap ≈ 75 real characters/line in Inter (ch measures the wide "0"). */}
    <p className="max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
      {PARAGRAPH}
    </p>
  </SectionCard>
);
