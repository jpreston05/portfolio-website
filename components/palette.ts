/* Shared CLAUDE.md palette. Kept as a TS object (consumed via inline styles)
   until the global token migration — the globals.css @theme values are still the
   stale Vite-era colors, so we don't rely on bg-bg/text-accent here yet. */
export const c = {
  bg: "#181F1C", // Carbon Black
  surface: "#2F3733", // card — olive-tinted mid grey, clearly visible
  surface2: "#3A423D", // nested cards / inputs / badges
  line: "#4A524C", // hairline borders
  text: "#ECECEA",
  muted: "#A6B0A8", // Grey Olive, nudged lighter for AA on both surface + surface2 (≥4.6:1)
  muted2: "#737F77", // dim, DECORATIVE only (icons) — fails AA as body text, never use for copy
  accent: "#DB5461", // Lobster Pink — interactive states + the hero card surface
  heroInk: "#10120F", // near-black text ON the pink hero card (4.89:1 AA)
  heroMuted: "#2A1013", // secondary text ON pink — deep maroon, same hue, never grey (4.61:1 AA)
} as const;
