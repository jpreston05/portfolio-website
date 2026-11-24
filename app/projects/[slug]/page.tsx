import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectPage } from "@/components/ProjectPage";
import { projects } from "@/lib/projects";

/* /projects/<slug> — a page per project that has a `story` in lib/projects.
   Prebuilt at build time; any other slug 404s. */

type Params = { params: Promise<{ slug: string }> };

const withStory = projects.filter((p) => p.story);

export const dynamicParams = false;

export function generateStaticParams() {
  return withStory.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = withStory.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} | Jack Preston`, description: project.tagline };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!withStory.some((p) => p.slug === slug)) notFound();
  return <ProjectPage slug={slug} />;
}
