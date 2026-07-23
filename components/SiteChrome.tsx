"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";

/* Persistent site chrome. The Navbar renders ONCE here (inside layout.tsx) and
   survives route changes — so the active-pill layoutId FLIPs smoothly between
   items instead of re-measuring from a freshly-mounted nav (which made it fly
   in from outside), and the nav's entrance plays once per load, not per route.
   Also owns the intro-once-per-session state AND renders the Preloader here —
   so the branded intro plays on the FIRST load of ANY page (a direct visit to
   /projects or /timeline), not only the home page. The home content reveal is
   gated on `revealed`; subpages fade in on their own beneath the backdrop. */

type IntroState = {
  introSeen: boolean; // this session already completed the intro
  revealed: boolean; // home content may show
  onReveal: () => void; // Preloader: backdrop starts fading
  onDone: () => void; // Preloader: "JP." landed on the nav brand
};

const Ctx = createContext<IntroState | null>(null);

export const useIntro = (): IntroState => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIntro must be used within <SiteChrome>");
  return ctx;
};

// Never re-notifies — sessionStorage only matters at mount (and at onDone,
// which triggers its own re-render via setState).
const emptySubscribe = () => () => {};

export const SiteChrome = ({ children }: { children: ReactNode }) => {
  const [revealContent, setRevealContent] = useState(false);
  const [navBrandShown, setNavBrandShown] = useState(false);
  const [intro, setIntro] = useState(true);

  // Read via useSyncExternalStore so the server render (false) and the client
  // value can differ without a hydration error.
  const introSeen = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("introSeen") === "1",
    () => false
  );

  // The brand slot is hidden while the intro is pending on ANY page — the
  // Preloader glides "JP." onto this slot, so it must be empty until the glide
  // lands (else two "JP." would show). Once the intro is done (or was already
  // seen this session), the brand is visible everywhere.
  const brandVisible = navBrandShown || introSeen;

  const onReveal = () => setRevealContent(true);
  const onDone = () => {
    // Flag AFTER the intro completes — flagging at mount would flip
    // introSeen on the first mid-intro re-render and cut it short.
    sessionStorage.setItem("introSeen", "1");
    setNavBrandShown(true);
  };

  return (
    <Ctx.Provider
      value={{
        introSeen,
        revealed: revealContent || introSeen,
        onReveal,
        onDone,
      }}
    >
      <Navbar brandVisible={brandVisible} />
      {children}

      {/* Branded intro — plays on the first load of any page, then hands the
          "JP." off to the nav brand. Rendered here (not per-page) so a direct
          visit to /projects or /timeline gets it too. */}
      <AnimatePresence>
        {intro && !introSeen && (
          <Preloader
            onReveal={onReveal}
            onDone={() => {
              onDone();
              setIntro(false);
            }}
          />
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
};
