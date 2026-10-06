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
