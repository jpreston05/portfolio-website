import { c } from "@/components/palette";

/* Small section label ("Highlights", "Languages", "Current GPA"). Inter,
   sentence case. The site uses no monospace anywhere. */
export const Label = ({
  children,
  className = "mb-2",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-xs font-semibold ${className}`} style={{ color: c.muted }}>
    {children}
  </p>
);
