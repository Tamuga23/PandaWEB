import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getCatalogo } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/catalogo`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const { productos } = await getCatalogo();
    return [
      ...base,
      ...productos.map((p) => ({
        url: `${SITE.url}/producto/${p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // Sin catálogo, al menos se publican las rutas fijas.
    return base;
  }
}
