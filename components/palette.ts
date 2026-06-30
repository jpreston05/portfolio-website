/* Shared CLAUDE.md palette. Kept as a TS object (consumed via inline styles)
   until the global token migration — the globals.css @theme values are still the
   stale Vite-era colors, so we don't rely on bg-bg/text-accent here yet. */
export const c = {
  bg: "#181F1C", // Carbon Black
  surface: "#2F3733", // card — olive-tinted mid grey, clearly visible
  surface2: "#3A423D", // nested cards / inputs / badges
  line: "#4A524C", // hairline borders
  text: "#ECECEA",
  muted: "#9BA89F", // Grey Olive, nudged lighter for AA on cards
  muted2: "#737F77", // dim labels / eyebrows
  accent: "#DB5461", // Lobster Pink — all interactive/accent states
} as const;
