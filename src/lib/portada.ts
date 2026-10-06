import type { Producto } from "./types";

/**
 * Productos de la vitrina del hero: uno por categoría primero, para que lo
 * primero que se ve muestre todo lo que vende la tienda. Por precio, los
 * cuatro primeros serían casi todos proyectores. Si no hay tantas categorías,
 * se completa en el orden recibido.
 *
 * Solo entran productos con foto: en el hero, un "Sin foto" es lo primero que
 * ve alguien que llega desde un anuncio. Recibe la salida de `destacados()`
 * (disponibles, ya ordenados).
 */
export function elegirHero(candidatos: Producto[], n = 4): Producto[] {
  const conFoto = candidatos.filter((p) => p.media.heroImage);
  const elegidos: Producto[] = [];
  const categorias = new Set<string | undefined>();

  for (const p of conFoto) {
    if (elegidos.length === n) break;
    if (categorias.has(p.categorySlug)) continue;
    categorias.add(p.categorySlug);
    elegidos.push(p);
  }
  for (const p of conFoto) {
    if (elegidos.length === n) break;
    if (!elegidos.includes(p)) elegidos.push(p);
  }
  return elegidos;
}

/**
 * Foto que representa cada categoría en "Qué estás buscando".
 *
 * Se prefiere un producto que NO esté en `excluir` (los del hero, justo
 * arriba): si no, las dos primeras secciones repiten las mismas fotos. Dentro
 * de eso, disponibles antes que agotados. Si la única foto de la categoría es
 * de un excluido o de un agotado, se usa igual: acá la foto ilustra la
 * categoría, no vende ese producto puntual.
 */
export function fotoPorCategoria(
  productos: Producto[],
  excluir: ReadonlySet<string> = new Set(),
): Record<string, string> {
  const rango = (p: Producto) => (excluir.has(p.id) ? 2 : 0) + (p.disponible ? 0 : 1);
  // sort es estable: dentro del mismo rango se respeta el orden recibido
  // (disponibles primero, mayor precio arriba).
  const ordenados = productos
    .filter((p) => p.categorySlug && p.media.heroImage)
    .sort((a, b) => rango(a) - rango(b));

  const fotos: Record<string, string> = {};
  for (const p of ordenados) {
    const slug = p.categorySlug!;
    if (!(slug in fotos)) fotos[slug] = p.media.heroImage!;
  }
  return fotos;
}
