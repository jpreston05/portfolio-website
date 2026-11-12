"use client";

import { ArrowLink } from "@/components/ArrowLink";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionCard } from "@/components/SectionCard";
import { featuredProjects } from "@/lib/projects";

/* Home-page preview of /projects — anything tagged `featured: true` in
   lib/projects.ts, as the same ProjectCard the /projects grid uses. Two
   columns where there's room, so keep the featured count even (two is the
   intended number). */

export const FeaturedProjects = () => (
  <SectionCard id="featured" title="Featured projects">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {featuredProjects.map((p) => (
        <ProjectCard key={p.slug} project={p} tone="surface2" heading="h3" />
      ))}
    </div>

    <div className="mt-5 flex justify-end">
      <ArrowLink href="/projects">All projects</ArrowLink>
    </div>
  </SectionCard>
);
