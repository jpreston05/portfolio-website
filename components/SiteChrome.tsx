"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Herov2";
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
  heroHeld: boolean; // arrived on home from another route: rail held docked
  releaseHero: () => void; // home page: scroll is in place, follow it again
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

  const revealed = revealContent || introSeen;
  const isHome = usePathname() === "/";

  // Coming back to home from another tab must not snap the docked rail open
  // into the big hero. While on any other route we arm a hold; the home page
  // then lands pre-scrolled past the collapse and releases it (app/page.tsx).
  // Until released the card ignores scroll and stays docked, so there is no
  // frame where it shows big. A first load / refresh on "/" is never held, so
  // it opens on the big hero as before. (State adjusted during render: the
  // hold must already be set in the render where isHome flips to true.)
  const [heroHeld, setHeroHeld] = useState(false);
  if (!isHome && !heroHeld) setHeroHeld(true);
  const releaseHero = useCallback(() => setHeroHeld(false), []);

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
        revealed,
        onReveal,
        onDone,
        heroHeld,
        releaseHero,
      }}
    >
      <Navbar brandVisible={brandVisible} />

      {/* The shared page frame: left rail (the hero card) + right column (the
          route's content) + footer. Mounted once, so the rail persists across
          routes exactly like the nav. Opacity is gated on the intro reveal.
          Vertical rhythm: nav bottom at 80px; content starts 24px below
          (top-26 = 104px) and the rail keeps 24px at the viewport bottom. */}
      <motion.div
        data-page-reveal
        className="relative z-10 flex min-h-screen w-full flex-col overflow-x-clip"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <main className="mx-auto grid w-full max-w-[1400px] flex-1 gap-6 px-4 pb-6 pt-26 sm:px-6 lg:grid-cols-[minmax(360px,400px)_1fr] lg:gap-8 lg:px-8">
          {/* LEFT RAIL — collapsing hero on home, pinned docked card elsewhere.
              Below lg it only shows on home (subpages go straight to content). */}
          <div
            className={`relative z-10 lg:sticky lg:top-26 lg:flex lg:h-[calc(100vh-8rem)] lg:items-center ${
              isHome ? "" : "hidden"
            }`}
          >
            <Hero revealed={revealed} home={isHome} held={heroHeld} />
          </div>
          {/* The footer lives INSIDE the right column, so the rail stays pinned
              all the way to the end of the page (a full-width footer below the
              grid made the rail scroll away and the whole screen move). mt-auto
              in Footer parks it at the column floor on short pages. main's
              pb-6 matches the rail's 24px bottom gap, so nothing shifts at the
              very end of the scroll. */}
          <div className="flex min-w-0 flex-col">
            {children}
            <Footer />
          </div>
        </main>
      </motion.div>

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
