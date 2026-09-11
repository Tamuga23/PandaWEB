import type { MetadataRoute } from "next";
import { CATEGORIAS, SITE } from "@/config/site";
import { contarPorCategoria, getCatalogo } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/catalogo`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const { productos } = await getCatalogo();
    const conteo = contarPorCategoria(productos);
    // Solo las categorías que de verdad tienen productos: son las páginas de
    // destino de los grupos de anuncios y las candidatas orgánicas, con el
    // mismo criterio que ya usa la home para no publicar categorías vacías.
    const categorias = CATEGORIAS.filter((c) => (conteo[c.slug] ?? 0) > 0);

    return [
      ...base,
      ...categorias.map((c) => ({
        url: `${SITE.url}/catalogo?cat=${c.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
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
