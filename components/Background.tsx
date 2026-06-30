"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/* Ambient Lobster-Pink glow behind the page. STATIC by default; an optional
   slow drift can be toggled on (ControlPanel) and is auto-disabled when the OS
   asks for reduced motion. Deliberately subtle — the glow only reads in the
   empty margins, never under text, per the brand's restraint. */

type BackgroundCtx = {
  animated: boolean; // user preference: drift on/off
  setAnimated: (v: boolean) => void;
};

const Ctx = createContext<BackgroundCtx | null>(null);

export const useBackground = (): BackgroundCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBackground must be used within <BackgroundProvider>");
  return ctx;
};

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [animated, setAnimated] = useState(false); // static first
  return <Ctx.Provider value={{ animated, setAnimated }}>{children}</Ctx.Provider>;
};

// --- Tunables -------------------------------------------------------------
// Layered radial glows (accent #DB5461 = rgb 219,84,97). Raise the alphas for a
// stronger tint; move the `at x% y%` anchors to reposition the glow.
const GLOW = [
  "radial-gradient(85rem 72rem at 10% -6%, rgba(219,84,97,0.55), transparent 58%)",
  "radial-gradient(65rem 55rem at 100% 2%, rgba(219,84,97,0.22), transparent 55%)",
].join(",");

export const Background = () => {
  const { animated } = useBackground();
  const reduce = useReducedMotion();
  const drift = animated && !reduce;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className={`absolute inset-0${drift ? " animate-bg-drift" : ""}`}
        style={{ background: GLOW }}
      />
    </div>
  );
};
