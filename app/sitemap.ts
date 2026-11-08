import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const PATHS = ["/", "/about", "/products", "/technical", "/news", "/customers", "/contactUs"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((p) => ({
    url: `${SITE.url}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
