/* Single source of truth for projects. The home page's FeaturedProjects and
   the /projects page both read from here — tag a project `featured: true` and
   it appears on the home page; no duplicated copy anywhere. `category` drives
   the filter buttons on the /projects page. */

export type ProjectCategory = "personal" | "hackathon" | "other";

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory; // filter grouping on the /projects page
  tagline: string; // one-liner (collapsed card + featured card)
  description: string; // paragraph (expanded card)
  highlights: string[]; // 2-4 substance bullets — what was built, measured outcomes
  stack: string[];
  links: { github?: string; live?: string };
  images: string[]; // /projects/<slug>/*.png — empty ⇒ placeholder tiles
  featured: boolean; // true ⇒ shows in home FeaturedProjects
};

// Display labels for the filter buttons (the "All" pill is added in the UI).
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  personal: "Personal",
  hackathon: "Hackathon",
  other: "Other",
};

export const projects: Project[] = [
  {
    slug: "trial-ai",
    title: "Trial AI",
    category: "personal",
    tagline: "An AI Ethics Simulation Trainer.",
    description:
      "Placeholder — a paragraph about what this project is, the problem it solves, and why it was interesting to build.",
    highlights: [
      "Placeholder highlight — what you built and how",
      "Placeholder highlight — a measured outcome or hard problem solved",
    ],
    stack: ["OpenAI API", "Java", "JavaFX"],
    links: { github: "https://github.com/jpreston05/TrialAI" },
    images: [
      "/projects/trial-ai/start_page.webp",
      "/projects/trial-ai/intro.webp",
      "/projects/trial-ai/main_room.webp",
    ],
    featured: true,
  },
  {
    slug: "skool-swaps",
    title: "Skool Swaps",
    category: "hackathon",
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
    tagline: "Made during the SESA x DEVS Beginners Hackathon 2025",
    description:
      "A study tool for students to practice concpets taught in 'Software Engineering Theory' (SOFTENG 282) at the University of Auckland. The app features multiple-choice questions, notes on each topic, and a leaderboard to encourage friendly competition among students.",
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
    featured: true,
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
    images: [],
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
    images: [],
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
