/* Single source of truth for projects. The home page's FeaturedProjects and
   the /projects page both read from here — tag a project `featured: true` and
   it appears on the home page; no duplicated copy anywhere.
   NOTE: all three entries are placeholders — swap in real projects. */

export type Project = {
  slug: string;
  title: string;
  tagline: string; // one-liner (collapsed card + featured card)
  description: string; // paragraph (expanded card)
  highlights: string[]; // 2-4 substance bullets — what was built, measured outcomes
  stack: string[];
  links: { github?: string; live?: string };
  images: string[]; // /projects/<slug>/*.png — empty ⇒ placeholder tiles
  featured: boolean; // true ⇒ shows in home FeaturedProjects
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    tagline: "A brief description of Project One.",
    description:
      "Placeholder — a paragraph about what this project is, the problem it solves, and why it was interesting to build.",
    highlights: [
      "Placeholder highlight — what you built and how",
      "Placeholder highlight — a measured outcome or hard problem solved",
    ],
    stack: ["React", "TypeScript", "Node"],
    links: { github: "https://github.com/jpreston05" },
    images: [],
    featured: true,
  },
  {
    slug: "project-two",
    title: "Project Two",
    tagline: "A brief description of Project Two.",
    description:
      "Placeholder — a paragraph about what this project is, the problem it solves, and why it was interesting to build.",
    highlights: [
      "Placeholder highlight — what you built and how",
      "Placeholder highlight — a measured outcome or hard problem solved",
    ],
    stack: ["Python", "FastAPI", "Postgres"],
    links: { github: "https://github.com/jpreston05" },
    images: [],
    featured: true,
  },
  {
    slug: "project-three",
    title: "Project Three",
    tagline: "A brief description of Project Three.",
    description:
      "Placeholder — a paragraph about what this project is, the problem it solves, and why it was interesting to build.",
    highlights: [
      "Placeholder highlight — what you built and how",
      "Placeholder highlight — a measured outcome or hard problem solved",
    ],
    stack: ["C++", "CMake"],
    links: { github: "https://github.com/jpreston05" },
    images: [],
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
