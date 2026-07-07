/* Single source of truth for the /timeline page. Mirrors lib/projects.ts: a
   typed array + a label map + a derived helper. Entries are reverse-chronological
   (newest first). `category` drives the tab filter; jobs live under "career" so
   they don't clutter the University / High School life phases. Tag a milestone
   `overview: true` and it shows in the default "Overview" tab (like a project's
   `featured`). `detail` is a short, human paragraph revealed on expand; omit it
   and the row renders static (no expand affordance). Keep the voice warm and
   first-person; this is a story, not a CV. */

export type TimelineCategory = "university" | "highschool" | "career";

export type Milestone = {
  slug: string;
  category: TimelineCategory;
  when: string; // friendly date label
  title: string;
  org?: string;
  blurb: string; // one-liner shown collapsed
  detail?: string; // a sentence or two revealed on expand; omit ⇒ not expandable
  overview?: boolean; // true ⇒ appears in the default "Overview" tab
};

export const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  university: "University",
  highschool: "High School",
  career: "Career",
};

export const milestones: Milestone[] = [
  // ── Career ────────────────────────────────────────────────────────────────
  {
    slug: "aeroqual",
    category: "career",
    when: "Summer 2025–26",
    title: "Cloud Intern",
    org: "Aeroqual",
    blurb: "My first real software job: a summer on a live cloud platform.",
    detail:
      "I spent the summer on Aeroqual's cloud team, getting my first taste of production engineering: modernising older C# code, making the build pipelines more reliable, and learning just how much care goes into software people actually depend on.",
    overview: true,
  },
  {
    slug: "waihi-beach-chemist",
    category: "career",
    when: "Summers, 2021–25",
    title: "Retail Assistant",
    org: "Waihi Beach Chemist",
    blurb: "The little pharmacy job back home I kept coming back to each summer.",
  },
  {
    slug: "wbop-council",
    category: "career",
    when: "Summer 2022–23",
    title: "Engineering Services Student",
    org: "Western Bay of Plenty District Council",
    blurb: "Bug testing the council's new SCADA system under their software engineer.",
    detail:
      "Working under the council's software engineer, I spent the summer bug testing their new SCADA system, tracking down issues before it went live. It was my first proper taste of software work, and a big part of what pulled me toward engineering.",
  },
  {
    slug: "wilson-road-fish-shop",
    category: "career",
    when: "2019–23",
    title: "First job",
    org: "Wilson Road Fish Shop",
    blurb: "Where it all started: my very first job, back in Waihi Beach.",
  },

  // ── University ──────────────────────────────────────────────────────────────
  {
    slug: "wdcc",
    category: "university",
    when: "2025 – now",
    title: "Industry Executive, WDCC",
    org: "Web Development & Consulting Club",
    blurb: "Connecting students with industry through talks and workshops.",
    detail:
      "I help put on the events that bridge students and industry, and even got up to present at our Web3 workshop, which I designed the deck for and thoroughly enjoyed running.",
  },
  {
    slug: "sesa",
    category: "university",
    when: "2025 – now",
    title: "Social Coordinator, SESA",
    org: "Software Engineering Students Association",
    blurb: "Running the social side of the software engineering cohort.",
    detail:
      "I plan the events that bring our year group together. The highlight so far was pulling off a Board Games Night that drew a great crowd.",
  },
  {
    slug: "conjoint",
    category: "university",
    when: "2025",
    title: "Picked up a commerce conjoint",
    org: "University of Auckland",
    blurb: "Added a BCom in Finance & Management alongside engineering.",
    detail:
      "In my second year I took on a conjoint, a BCom in Finance & Management next to my engineering degree, to pair building things with understanding the business around them.",
  },
  {
    slug: "anniversary-scholarship",
    category: "university",
    when: "2024",
    title: "140th Anniversary Scholarship",
    org: "University of Auckland",
    blurb: "A $5,000 scholarship from the university for academic performance.",
    overview: true,
  },
  {
    slug: "red-bull-trolley",
    category: "university",
    when: "2024–25",
    title: "Head of Design, “The Flopper”",
    org: "Red Bull Trolley Grand Prix",
    blurb: "I designed a giant drivable jandal for a national billy-cart race.",
    detail:
      "I led the design of “The Flopper”, a gravity racer shaped like a giant jandal. I wanted something unmistakably Kiwi that no one had brought to the competition before, and quick enough to actually hold its own on the track.",
  },
  {
    slug: "uoa-start",
    category: "university",
    when: "2024 – now",
    title: "Started Engineering at Auckland",
    org: "University of Auckland",
    blurb: "Began my engineering degree, the goal I'd had since high school.",
    detail:
      "I came in through Auckland's general first-year engineering before specialising into Software Engineering, the part I'd been most excited about all along.",
    overview: true,
  },

  // ── High School ─────────────────────────────────────────────────────────────
  {
    slug: "katikati-college",
    category: "highschool",
    when: "2023",
    title: "Finished at Katikati College",
    org: "Proxime Accessit · Prefect",
    blurb: "Left school as runner-up dux, a prefect, and hockey vice-captain.",
    detail:
      "I gave high school everything I had, finishing as Proxime Accessit (runner-up dux), a prefect, and vice-captain of the 1st XI hockey team.",
    overview: true,
  },
  {
    slug: "ncea",
    category: "highschool",
    when: "2021–23",
    title: "NCEA with Excellence",
    org: "Katikati College",
    blurb: "Excellence endorsements across all three years of NCEA.",
  },
  {
    slug: "discovered-programming",
    category: "highschool",
    when: "~2020",
    title: "Found programming",
    org: "Year 10",
    blurb: "Built my first website and, pretty much on the spot, knew this was it.",
    detail:
      "Around Year 10 I taught myself HTML and CSS and put together my first website. Somewhere between that and my first lines of Java, it clicked that software was what I wanted to do, and I haven't looked back since.",
    overview: true,
  },
];

export const overviewMilestones = milestones.filter((m) => m.overview);
