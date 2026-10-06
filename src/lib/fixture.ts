import { CONFIG_FINANCIAMIENTO_DEFAULT, calcularPlanes } from "./financiamiento";
import type { CatalogoData, Producto } from "./types";

/**
 * Datos de prueba locales: con `CATALOG_SOURCE=fixture`, `getCatalogo` sirve
 * `fixture-catalogo.json` en vez de leer Firestore.
 *
 * Por qué existe: dev local, producción y el POS comparten la misma cuota de
 * Firestore (plan Spark, 50k lecturas/día), y `next dev` no aprovecha la caché
 * de producción. El 4-oct-2026 una verificación visual con varios `next dev`
 * agotó la cuota y dejó caído el catálogo real hasta la medianoche. Con esto,
 * iterar sobre la UI no le cuesta ni una lectura a la tienda.
 *
 * El JSON es una copia del catálogo público que producción ya le manda al
 * navegador: sin `cost` ni `precio.efectivo` (lo verifica una prueba).
 */

export type FuenteCatalogo = "firestore" | "fixture";

export function fuenteCatalogo(
  env: Record<string, string | undefined> = process.env,
): FuenteCatalogo {
  if (env.CATALOG_SOURCE !== "fixture") return "firestore";
  // Precios de prueba en producción serían una promesa falsa. Mejor que el
  // build se caiga a que publique un precio o una cuota que no existen.
  if (env.VERCEL_ENV === "production") {
    throw new Error(
      "CATALOG_SOURCE=fixture no se puede usar en producción: publicaría precios de prueba.",
    );
  }
  return "fixture";
}

interface FixtureCatalogo {
  nota: string;
  tasa: number;
  /** Sin `planes`: las cuotas se recalculan al leer, con el código vigente. */
  productos: Omit<Producto, "planes">[];
}

export async function leerFixture(): Promise<CatalogoData> {
  // Import dinámico: el JSON queda en un chunk aparte que producción nunca carga.
  const modulo: { default: unknown } = await import("./fixture-catalogo.json");
  const fixture = modulo.default as FixtureCatalogo;
  // El default es la política vigente (proyectores en 0%, el resto con
  // recargo): el mismo respaldo que usa la web si Firestore no responde.
  const config = CONFIG_FINANCIAMIENTO_DEFAULT;

  const productos = fixture.productos.map((p) => ({
    ...p,
    planes: calcularPlanes(p.precio.actual, fixture.tasa, {
      config,
      categoria: p.categorySlug,
      override: p.financiamientoOverride,
    }),
  }));

  return { productos, tasa: fixture.tasa, configFinanciamiento: config, leidoEn: Date.now() };
}
