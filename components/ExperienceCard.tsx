"use client";

import { ArrowLink } from "@/components/ArrowLink";
import { Label } from "@/components/Label";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";
import { latestRole } from "@/lib/timeline";

/* Home "Experience" — the most recent career milestone from lib/timeline.ts.
   Shows its `highlights` as bullets when set; until then, the `detail`
   paragraph stands in so the card is never thin. */
export const ExperienceCard = () => {
  if (!latestRole) return null;
  const { when, title, org, blurb, detail, highlights } = latestRole;

  return (
    <SectionCard>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <Label className="">Experience</Label>
        <p className="text-xs" style={{ color: c.muted }}>
          {when}
        </p>
      </div>

      <h2 className="text-2xl font-bold tracking-tight" style={{ color: c.text }}>
        {title}
      </h2>
      {org && (
        <p className="mt-0.5 text-sm" style={{ color: c.muted }}>
          {org}
        </p>
      )}
      <p className="mt-3 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.text }}>
        {blurb}
      </p>

      {highlights?.length ? (
        <ul className="mt-3 flex flex-col gap-2">
          {highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: c.accent }}
              />
              <span style={{ color: c.muted }}>{h}</span>
            </li>
          ))}
        </ul>
      ) : (
        detail && (
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed" style={{ color: c.muted }}>
            {detail}
          </p>
        )
      )}

      <div className="mt-5 flex justify-end">
        <ArrowLink href="/timeline">Full timeline</ArrowLink>
      </div>
    </SectionCard>
  );
};
