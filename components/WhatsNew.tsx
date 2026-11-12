"use client";

import { Label } from "@/components/Label";
import { SectionCard } from "@/components/SectionCard";
import { c } from "@/components/palette";
import { notices } from "@/lib/notices";

/* Home "What's new" — a short dated list from lib/notices.ts (newest first).
   Renders nothing while the list is empty. */
export const WhatsNew = () => {
  if (notices.length === 0) return null;

  return (
    <SectionCard>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <Label className="">What&apos;s new</Label>
        <p className="text-xs" style={{ color: c.muted }}>
          Updated {notices[0].when}
        </p>
      </div>
      <ul>
        {notices.map((n, i) => (
          <li
            key={`${n.when}-${n.text}`}
            className="flex gap-4 py-3 text-sm last:pb-0"
            style={i > 0 ? { borderTop: `1px solid ${c.line}` } : undefined}
          >
            <span className="w-20 shrink-0 tabular-nums" style={{ color: c.muted }}>
              {n.when}
            </span>
            {/* Newest reads brighter; older notices recede. */}
            <span style={{ color: i === 0 ? c.text : c.muted }}>{n.text}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};
