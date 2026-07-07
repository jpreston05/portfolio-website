"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

/* Persistent site chrome. The Navbar renders ONCE here (inside layout.tsx) and
   survives route changes — so the active-pill layoutId FLIPs smoothly between
   items instead of re-measuring from a freshly-mounted nav (which made it fly
   in from outside), and the nav's entrance plays once per load, not per route.
   Also owns the intro-once-per-session state the home Preloader coordinates. */

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
  const pathname = usePathname();
  const [revealContent, setRevealContent] = useState(false);
  const [navBrandShown, setNavBrandShown] = useState(false);

  // Read via useSyncExternalStore so the server render (false) and the client
  // value can differ without a hydration error.
  const introSeen = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem("introSeen") === "1",
    () => false
  );

  // The brand slot is hidden only while the home intro is actually pending —
  // on subpages (direct visits included) it is always visible.
  const brandVisible = pathname !== "/" || navBrandShown || introSeen;

  return (
    <Ctx.Provider
      value={{
        introSeen,
        revealed: revealContent || introSeen,
        onReveal: () => setRevealContent(true),
        onDone: () => {
          // Flag AFTER the intro completes — flagging at mount would flip
          // introSeen on the first mid-intro re-render and cut it short.
          sessionStorage.setItem("introSeen", "1");
          setNavBrandShown(true);
        },
      }}
    >
      <Navbar brandVisible={brandVisible} />
      {children}
    </Ctx.Provider>
  );
};
