"use client";

import { ArrowLink } from "@/components/ArrowLink";
import { Label } from "@/components/Label";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";
import { latestRole } from "@/lib/timeline";

/* Home "Experience" — the most recent career milestone from lib/timeline.ts.
   Two columns at xl (role on the left, the story on the right) so the card
   uses its width instead of leaving half of it empty; stacked below that.
   Shows `highlights` as bullets when set; until then the `detail` paragraph
   stands in. */
export const ExperienceCard = () => {
  if (!latestRole) return null;
  const { when, title, org, blurb, detail, highlights } = latestRole;

  return (
    <SectionCard>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-10">
        <div>
          <Label className="mb-3">Experience</Label>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: c.text }}>
            {title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: c.muted }}>
            {org ? `${org} · ${when}` : when}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-medium leading-relaxed" style={{ color: c.text }}>
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
              <p className="mt-2 text-sm leading-relaxed" style={{ color: c.muted }}>
                {detail}
              </p>
            )
          )}

          <div className="mt-4 flex justify-end">
            <ArrowLink href="/timeline">Full timeline</ArrowLink>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
