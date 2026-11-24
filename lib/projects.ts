/* Single source of truth for projects. The home page's FeaturedProjects and
   the /projects page both read from here — tag a project `featured: true` and
   it appears on the home page; no duplicated copy anywhere. `category` drives
   the filter buttons on the /projects page. */

export type ProjectCategory = "personal" | "hackathon" | "other";

// A screenshot on a project page, with a short caption under it.
export type Shot = { src: string; caption: string };

// One build of a rebuilt project ("v1", "v2"): its screenshots per view id.
export type ProjectBuild = {
  label: string;
  summary: string; // the build in a few words, "Adaptive daily queue"
  shots: Record<string, Shot[]>;
};

/* A project with a story gets its own page at /projects/<slug>: why it was
   rebuilt, then every build's screenshots, switchable by build and by view. */
export type ProjectStory = {
  why: { label: string; text: string }[]; // side-by-side paragraphs
  views: { id: string; label: string; note: string }[]; // e.g. owner / public
  builds: ProjectBuild[]; // newest first; builds[0] is the current one
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory; // filter grouping on the /projects page
  event?: string; // shown after the category, e.g. "WDCC x SESA 2025"
  tagline: string; // one-liner under the title
  // 1-3 short facts with a number ("62% win rate vs random"); omit ⇒ no row.
  metrics?: string[];
  description: string; // longer write-up (not rendered at the moment)
  highlights: string[]; // substance bullets (not rendered at the moment)
  stack: string[];
  links: { github?: string; live?: string };
  // /projects/<slug>/* — the first is the card cover, all open in the
  // lightbox; empty ⇒ an initials tile.
  images: string[];
  featured: boolean; // true ⇒ shows in home FeaturedProjects
  story?: ProjectStory; // set ⇒ a /projects/<slug> page + a card link to it
};

/* Every screenshot of a build, view by view: what a card's lightbox shows. */
export function allShots(build: ProjectBuild): string[] {
  return Object.values(build.shots).flat().map((s) => s.src);
}

const LT = "/projects/leetcode-tracker";

const LEETCODE_STORY: ProjectStory = {
  why: [
    {
      label: "What went wrong in v1",
      text: "The first version gave every solved problem the same fixed 7-step review ladder (1 day out to 6 months). For the full LeetCode 150 that adds up to over 1,000 scheduled reviews, most of them on problems I already knew well. It got overwhelming, and the app never told me what to actually work on each day.",
    },
    {
      label: "What v2 does instead",
      text: "I rebuilt it around an adaptive daily queue. Each day it sets 3 solves: one guaranteed new problem plus the 2 most overdue reviews. Review gaps grow after clean, timed solves and reset after failed ones, and a problem retires once I can solve it cleanly after 3+ weeks. Review time now goes to problems I struggle with instead of ones I've already mastered.",
    },
  ],
  views: [
    {
      id: "owner",
      label: "My view",
      note: "Only I can sign in. I built this to keep myself accountable, not as a product for other people, so this side of the app is mine alone.",
    },
    {
      id: "public",
      label: "Public view",
      note: "What anyone visiting the live site sees: a read-only logbook of my progress, with links to each solution.",
    },
  ],
  builds: [
    {
      label: "v2",
      summary: "Adaptive daily queue",
      shots: {
        owner: [
          { src: `${LT}/v2/logged-in/home-dark.png`, caption: "Today's plan: one new problem, then the reviews" },
          { src: `${LT}/v2/logged-in/home-light.png`, caption: "The dashboard in light mode" },
          { src: `${LT}/v2/logged-in/problems.png`, caption: "Problems" },
          { src: `${LT}/v2/logged-in/problem.png`, caption: "A single problem" },
          { src: `${LT}/v2/logged-in/log.png`, caption: "Logging a solve: time, grade and confidence set the first review" },
        ],
        public: [
          { src: `${LT}/v2/logged-out/home.png`, caption: "Public dashboard" },
          { src: `${LT}/v2/logged-out/problems.png`, caption: "Public problem log" },
        ],
      },
    },
    {
      label: "v1",
      summary: "Fixed 7-step review ladder",
      shots: {
        owner: [
          { src: `${LT}/v1/logged-in/home1.png`, caption: "Dashboard" },
          { src: `${LT}/v1/logged-in/home2.png`, caption: "This week's load, stats and activity" },
          { src: `${LT}/v1/logged-in/problems.png`, caption: "Problems" },
          { src: `${LT}/v1/logged-in/problem.png`, caption: "A single problem" },
          { src: `${LT}/v1/logged-in/logproblem.png`, caption: "Logging a problem" },
        ],
        public: [
          { src: `${LT}/v1/logged-out/home.png`, caption: "Public dashboard" },
          { src: `${LT}/v1/logged-out/problems.png`, caption: "Public problem log" },
        ],
      },
    },
  ],
};

// Display labels// Display labels for the filter buttons (the "All" pill is added in the UI).
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  personal: "Personal",
  hackathon: "Hackathon",
  other: "Other",
};

export const projects: Project[] = [
  {
    slug: "leetcode-tracker",
    title: "LeetCode Tracker",
    category: "personal",
    tagline:
      "A LeetCode practice tracker that hands me an adaptive daily queue of three solves: one new problem plus the two most overdue reviews.",
    description:
      "A full-stack tool I use daily to decide what to practise. Each day it sets three solves: one guaranteed new problem plus the two most overdue reviews. Review gaps grow after clean, timed solves and reset after failed ones, and a problem retires once I can solve it cleanly after three or more weeks. Built with React and Supabase, with PostgreSQL backing the scheduling data and authenticated storage for photos of my handwritten notes.",
    highlights: [
      "Adaptive review intervals that grow after clean, timed solves and reset after failed ones",
      "Daily queue of three solves, one new problem plus the two most overdue reviews, so the workload stays fixed",
      "Problems retire once solved cleanly after a gap of three or more weeks",
    ],
    stack: ["React", "Supabase", "PostgreSQL"],
    links: {
      github: "https://github.com/jpreston05/leetcode-tracker",
      live: "https://leetcode-tracker-liart.vercel.app/",
    },
    images: allShots(LEETCODE_STORY.builds[0]),
    story: LEETCODE_STORY,
    featured: true,
  },
  {
    slug: "trial-ai",
    title: "Trial AI",
    category: "personal",
    tagline: "A courtroom mystery game with AI-powered characters.",
    description:
      "A desktop courtroom mystery game where you play the investigator: interrogate the suspects and witnesses, piece together the evidence, and deliver a verdict. Each character is powered by the OpenAI API with their own persona and hidden knowledge, so no two interrogations play out the same way. Built in Java with JavaFX.",
    highlights: [
      "Prompt-engineered character personas that hold their secrets until the right questions are asked",
      "Multi-scene investigation flow with state management, evidence tracking feeding the final verdict",
      "Text-to-speech dialogue so every character speaks their lines",
    ],
    stack: ["OpenAI API", "Java", "JavaFX"],
    links: { github: "https://github.com/jpreston05/TrialAI" },
    images: [
      "/projects/trial-ai/start_page.webp",
      "/projects/trial-ai/intro.webp",
      "/projects/trial-ai/main_room.webp",
    ],
    featured: false,
  },
  {
    slug: "skool-swaps",
    title: "Skool Swaps",
    category: "hackathon",
    event: "WDCC x SESA 2025",
    tagline: "Made during the WDCC x SESA Hackathon 2025",
    description:
      "A nostalgia themed web app for trading digital replicas of items commonly traded within New Zealand primary schools in the 2010s. The app features a marketplace for users to trade items, a shop to purchase items, and a profile page to showcase a user's collection of items.",
    highlights: [
      "Made with 5 other students during the WDCC x SESA Hackathon 2025",
      "Produced over 2 days, with a live demo and presentation at the end of the hackathon",
    ],
    stack: ["React", "CSS"],
    links: { },
    images: [
      "/projects/skool-swaps/home_page.webp",
      "/projects/skool-swaps/collections.webp",
      "/projects/skool-swaps/collection.webp",
    ],
    featured: false,
  },
  {
    slug: "logic-lift",
    title: "Logic Lift",
    category: "hackathon",
    event: "SESA x DEVS Beginners 2025",
    tagline: "Made during the SESA x DEVS Beginners Hackathon 2025",
    description:
      "A study tool for students to practice concepts taught in 'Software Engineering Theory' (SOFTENG 282) at the University of Auckland. The app features multiple-choice questions, notes on each topic, and a leaderboard to encourage friendly competition among students.",
    highlights: [
      "Won 'Most Useful Solution' at the SESA x DEVS Beginners Hackathon 2025",
    ],
    stack: ["React", "CSS"],
    links: { },
    images: [
      "/projects/logic-lift/award.webp",
      "/projects/logic-lift/home_page.webp",
      "/projects/logic-lift/quiz_page.webp",
    ],
    featured: false,
  },
  {
    slug: "red-bull",
    title: "2025 Red Bull Trolley Grand Prix",
    category: "other",
    tagline: "Head of Design for 'The Flopper'",
    description:
      "I competed in the 2025 Red Bull Trolley Grand Prix, a New Zealand-wide competition where teams design and build gravity-powered trolleys. I led the design of our trolley, 'The Flopper', which was built to be both fast and visually striking. We knew we had to stand out for our submission to be selected for the competition, so I wanted to create a trolley that was inspired by Kiwiana, but was unique to the competition. I designed a trolley that resembled a giant jandal, with an aerodynamic shape and a grass turf top. The design was not only visually appealing but also optimized for speed, allowing us to achieve impressive results on the track.",
    highlights: [
      "1 of 50 teams selected from New Zealand",
      "Built over 3 days with a team of 5",
    ],
    stack: [],
    links: { },
    images: ["/projects/red-bull/team_pic.webp", "/projects/red-bull/initial_drawing1.webp", "/projects/red-bull/initial_drawing2.webp", "/projects/red-bull/logo.webp", "/projects/red-bull/frame1.webp", "/projects/red-bull/frame2.webp", "/projects/red-bull/frame3.webp", "/projects/red-bull/drilling.webp","/projects/red-bull/steering.webp", "/projects/red-bull/trol1.webp", "/projects/red-bull/trol2.webp", "/projects/red-bull/trol3.webp", "/projects/red-bull/side1.webp", "/projects/red-bull/side2.webp", "/projects/red-bull/side3.webp"],
    featured: false,
  },
  {
    slug: "battleships",
    title: "Monte Carlo Battleships",
    category: "personal",
    tagline: "Battleships AI using Monte Carlo Algorithms",
    description:
      "Terminal-based Battleships game, where the player competes against an AI opponent that uses Monte Carlo algorithms to make decisions. The AI evaluates potential moves by simulating numerous random game outcomes, allowing it to choose the most promising strategy.",
    highlights: [
      "Edgecase handling - debugging and refining the AI's decision-making process to ensure it behaves as expected in various scenarios. A big issue I faced was when the player placed ships next to each other, the AI would assume they were the same ship, and get stuck in a loop where the ship would never sink. I had to add logic to handle this edge case.",
    ],
    stack: ["Python", "Numpy"],
    links: { github: "https://github.com/jpreston05/Monte-Carlo-Battleships" },
    images: ["/projects/battleships/start.webp", "/projects/battleships/turn.webp", "/projects/battleships/end.webp"],
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/* 1-2 letter monogram from a title, for the fallback thumbnail on image-less
   cards. Skips leading non-alpha words ("2025 Red Bull …" → "RB"). */
export function initials(title: string): string {
  const words = title.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (words.length === 0) return "JP";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
