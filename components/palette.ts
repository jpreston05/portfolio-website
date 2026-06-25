/* Shared CLAUDE.md palette. Kept as a TS object (consumed via inline styles)
   until the global token migration — the globals.css @theme values are still the
   stale Vite-era colors, so we don't rely on bg-bg/text-accent here yet. */
export const c = {
  bg: "#0B0B0C",
  surface: "#141417",
  surface2: "#1B1B1F",
  line: "#26262B",
  text: "#ECECEA",
  muted: "#8A8A82",
  muted2: "#5C5C5C",
  accent: "#4ADE80",
} as const;
