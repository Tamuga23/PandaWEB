import "server-only";

import { cache } from "react";
import { USD_TO_NIO_FALLBACK } from "@/config/site";
import {
  CONFIG_FINANCIAMIENTO_DEFAULT,
  calcularPlanes,
  normalizarConfig,
  type ConfigFinanciamiento,
} from "./financiamiento";
import { getDocument, listCollection } from "./firestore-rest";
import { normalizarProducto } from "./normalize";
import type { CatalogoData, Producto } from "./types";

// Cada cuánto se vuelve a consultar Firestore (segundos).
// El espejo se actualiza una vez al día por el backfill, así que 15 minutos es
// de sobra y mantiene bajísimo el consumo de lecturas.
const REVALIDATE = 900;

/**
 * Tasa USD→NIO vigente, para que la web use el mismo número que el POS.
 *
 * `company` tiene un único documento fijo, `shared_store`, con la config del
 * negocio. Las reglas de Firestore ya no permiten listar la colección
 * `company` sin el claim `admin` (solo el `get` de ese doc puntual es
 * público), así que se lee directo por su path.
 *
 * Si algo falla, se usa el respaldo: una tasa desactualizada es mejor que una
 * página caída, y de todos modos el precio final se confirma por WhatsApp.
 */
async function getTasa(): Promise<number> {
  try {
    const doc = await getDocument("company/shared_store", { revalidate: REVALIDATE });
    const tasa = doc?.defaultExchangeRate;
    if (typeof tasa === "number" && tasa > 0) return tasa;
  } catch {
    // Sin permisos o sin red: seguimos con el respaldo.
  }
  return USD_TO_NIO_FALLBACK;
}

/**
 * Reglas de financiamiento vigentes (doc `config/financiamiento`, editable desde
 * Configuración del POS).
 *
 * Si falla, se usa el default del módulo compartido. OJO con el sentido del
 * respaldo: el default trae proyectores en 0% y el resto con recargo, o sea la
 * política vigente. Nunca hay que ponerle 0% a todo como respaldo, porque una
 * caída de Firestore anunciaría 0% en productos que sí lo cobran.
 */
async function getConfigFinanciamiento(): Promise<ConfigFinanciamiento> {
  try {
    const docs = await listCollection("config", { revalidate: REVALIDATE, limit: 5 });
    for (const d of docs) {
      // `listCollection` no devuelve el id del doc, así que se identifica por
      // forma: el de financiamiento es el único con `recargoPorDefecto`.
      if (d && typeof d === "object" && "recargoPorDefecto" in d) {
        return normalizarConfig(d);
      }
    }
  } catch {
    // Sin permisos o sin red: seguimos con el respaldo.
  }
  return CONFIG_FINANCIAMIENTO_DEFAULT;
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
  const [docs, tasa, configFinanciamiento] = await Promise.all([
    listCollection("catalogo_publico", { revalidate: REVALIDATE }),
    getTasa(),
    getConfigFinanciamiento(),
  ]);

  const productos = docs
    .map(normalizarProducto)
    .filter((p): p is Producto => p !== null)
    // Las cuotas se resuelven ACÁ, una sola vez, con la tasa y las reglas ya en
    // mano, y viajan dentro del producto. Ningún componente vuelve a calcularlas:
    // así la tarjeta, la ficha y el comparador no pueden mostrar números
    // distintos para el mismo producto.
    .map((p) => ({
      ...p,
      planes: calcularPlanes(p.precio.actual, tasa, {
        config: configFinanciamiento,
        categoria: p.categorySlug,
        override: p.financiamientoOverride,
      }),
    }))
    .sort(ordenarPorDefecto);

  return { productos, tasa, configFinanciamiento, leidoEn: Date.now() };
});

export async function getProducto(
  id: string,
): Promise<{
  producto: Producto;
  tasa: number;
  configFinanciamiento: ConfigFinanciamiento;
  relacionados: Producto[];
} | null> {
  const { productos, tasa, configFinanciamiento } = await getCatalogo();
  const producto = productos.find((p) => p.id === id);
  if (!producto) return null;

  // Relacionados: misma categoría, disponibles primero, máximo 4.
  const relacionados = productos
    .filter((p) => p.id !== producto.id && p.categorySlug === producto.categorySlug)
    .slice(0, 4);

  return { producto, tasa, configFinanciamiento, relacionados };
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
