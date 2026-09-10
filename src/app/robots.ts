import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Mientras la web no sea pública, se bloquea la indexación completa.
 *
 * Al lanzar hay que cambiar DOS cosas a la vez:
 *   1. `disallow` por `allow` acá.
 *   2. `robots.index` a `true` en src/app/layout.tsx.
 * Si se cambia solo una, Google recibe señales contradictorias.
 */
const EN_CONSTRUCCION = false;

export default function robots(): MetadataRoute.Robots {
  if (EN_CONSTRUCCION) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
