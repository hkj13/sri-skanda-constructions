import type { MetadataRoute } from "next";
import { packages } from "@content/packages";
import { projects } from "@content/projects";
import { services } from "@content/services";
import { site } from "@content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("/", 1),
    page("/services", 0.9),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    page("/estimate", 0.8),
    page("/contact", 0.8),
    page("/process", 0.6),
    page("/about", 0.5),
    ...(projects.length ? [page("/projects", 0.7)] : []),
    ...(packages.length ? [page("/packages", 0.6)] : []),
  ];
}
