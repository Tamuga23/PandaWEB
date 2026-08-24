import "server-only";

import { cache } from "react";
import { USD_TO_NIO_FALLBACK } from "@/config/site";
import { listCollection } from "./firestore-rest";
import { normalizarProducto } from "./normalize";
import type { CatalogoData, Producto } from "./types";

// Cada cuánto se vuelve a consultar Firestore (segundos).
// El espejo se actualiza una vez al día por el backfill, así que 15 minutos es
// de sobra y mantiene bajísimo el consumo de lecturas.
const REVALIDATE = 900;

/**
 * Tasa USD→NIO vigente, para que la web use el mismo número que el POS.
 *
 * La colección `company` tiene un documento por usuario, con el uid como id
 * (no existe un `shared_store` fijo). Así que se consulta la colección y se
 * toma el primer documento que traiga una tasa válida.
 *
 * Si algo falla, se usa el respaldo: una tasa desactualizada es mejor que una
 * página caída, y de todos modos el precio final se confirma por WhatsApp.
 */
async function getTasa(): Promise<number> {
  try {
    const docs = await listCollection("company", { revalidate: REVALIDATE, limit: 10 });
    for (const d of docs) {
      const tasa = d.defaultExchangeRate;
      if (typeof tasa === "number" && tasa > 0) return tasa;
    }
  } catch {
    // Sin permisos o sin red: seguimos con el respaldo.
  }
  return USD_TO_NIO_FALLBACK;
}

/** Disponibles primero, y dentro de cada grupo los de mayor precio arriba. */
function ordenarPorDefecto(a: Producto, b: Producto): number {
  const disp = (b.disponible ? 1 : 0) - (a.disponible ? 1 : 0);
  if (disp !== 0) return disp;
  return (b.precio.actual ?? 0) - (a.precio.actual ?? 0);
}

/**
 * `cache` de React deduplica la llamada dentro de un mismo render: la portada
 * pide el catálogo una vez aunque lo consulten varios componentes.
 */
export const getCatalogo = cache(async (): Promise<CatalogoData> => {
  const [docs, tasa] = await Promise.all([
    listCollection("catalogo_publico", { revalidate: REVALIDATE }),
    getTasa(),
  ]);

  const productos = docs
    .map(normalizarProducto)
    .filter((p): p is Producto => p !== null)
    .sort(ordenarPorDefecto);

  return { productos, tasa, leidoEn: Date.now() };
});

export async function getProducto(
  id: string,
): Promise<{ producto: Producto; tasa: number; relacionados: Producto[] } | null> {
  const { productos, tasa } = await getCatalogo();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return null;

  // Relacionados: misma categoría, disponibles primero, máximo 4.
  const relacionados = productos
    .filter((p) => p.id !== producto.id && p.categorySlug === producto.categorySlug)
    .slice(0, 4);

  return { producto, tasa, relacionados };
}

/** Categorías que realmente tienen productos, con su conteo. */
export function contarPorCategoria(productos: Producto[]): Record<string, number> {
  const conteo: Record<string, number> = {};
  for (const p of productos) {
    if (!p.categorySlug) continue;
    conteo[p.categorySlug] = (conteo[p.categorySlug] ?? 0) + 1;
  }
  return conteo;
}

/**
 * Destacados de la portada: con foto y disponibles, porque un grid de portada
 * con placeholders vacíos espanta. Si no alcanzan, se completa con disponibles
 * sin foto — nunca con agotados, porque "Lo más pedido" no puede vender algo
 * que no hay.
 */
export function destacados(productos: Producto[], n = 6): Producto[] {
  const disponibles = productos.filter((p) => p.disponible);
  const conFoto = disponibles.filter((p) => p.media.heroImage);
  if (conFoto.length >= n) return conFoto.slice(0, n);
  const sinFoto = disponibles.filter((p) => !p.media.heroImage);
  return [...conFoto, ...sinFoto].slice(0, n);
}
