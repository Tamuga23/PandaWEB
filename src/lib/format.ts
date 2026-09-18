/** Precio en córdobas ya redondeado a la decena, como número. Fuente única del monto. */
export function cordobasNumero(usd: number, tasa: number): number {
  return Math.round((usd * tasa) / 10) * 10;
}

/** Precio en córdobas, redondeado a la decena para que se lea limpio. */
export function cordobas(usd: number | undefined, tasa: number): string {
  if (usd == null) return "Consultar";
  return "C$" + cordobasNumero(usd, tasa).toLocaleString("es-NI");
}

/** Igual que `cordobas` pero sin redondear a la decena (para cuotas). */
export function cordobasExacto(usd: number | undefined, tasa: number): string {
  if (usd == null) return "Consultar";
  return "C$" + Math.round(usd * tasa).toLocaleString("es-NI");
}

// Las cuotas ya NO se calculan acá. `calcularCuotas` y `cuotaMinima` dividían el
// precio entre los meses asumiendo 0% parejo, lo que hoy sería mentira en las
// categorías con recargo. Ahora se resuelven una sola vez en `lib/catalog.ts`
// con `lib/financiamiento.ts` y viajan en `producto.planes`; para leerlas usá
// `planMasBajo(producto.planes)` y `todosSinInteres(producto.planes)`.

/** Porcentaje de descuento respecto al precio de lista. */
export function porcentajeDescuento(
  lista: number | undefined,
  actual: number | undefined,
): number | null {
  if (lista == null || actual == null || lista <= actual) return null;
  return Math.round(((lista - actual) / lista) * 100);
}

/**
 * Resumen corto a partir de las specs, para cuando el POS no cargó `beneficio`
 * ni `description`. Sin esto, una ficha sin esos campos colapsa a: pill de
 * disponibilidad → nombre → precio → tabla de specs, indistinguible de
 * cualquier catálogo genérico. Usa las primeras filas YA formateadas por
 * `filasDeSpecs` (mismo orden y texto que la tabla de abajo) — no inventa
 * ningún dato, solo adelanta lo más relevante como una línea de una oración.
 */
export function beneficioDesdeSpecs(
  filas: { valor: string }[],
  max = 2,
): string | undefined {
  if (filas.length === 0) return undefined;
  return filas
    .slice(0, max)
    .map((f) => f.valor)
    .join(" · ");
}

/** Extrae el ID de un video de YouTube de cualquier formato de URL. */
export function youTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

/**
 * Enlace de WhatsApp con el producto ya identificado en el mensaje.
 *
 * Si el producto está agotado (`disponible: false`), el mensaje no pregunta
 * "¿Está disponible?" — la ficha ya le dijo que no lo está. Preguntarlo de
 * todos modos contradice lo que la propia página acaba de mostrar.
 */
export function linkWhatsApp(
  numero: string,
  producto?: { name: string; sku?: string; disponible?: boolean },
): string {
  // "Código", no "SKU": es como la propia ficha le llama al mismo dato
  // (`Código {producto.sku}`) — un cliente que lea el mensaje antes de
  // mandarlo no debería encontrarse con un término que no vio en la página.
  const skuTexto = producto?.sku ? ` (Código ${producto.sku})` : "";
  const texto = !producto
    ? "Hola 👋 Vi su catálogo en la web y quiero más información."
    : producto.disponible === false
      ? `Hola 👋 Avísenme cuando llegue el ${producto.name}${skuTexto} que vi en la web.`
      : `Hola 👋 Me interesa el ${producto.name}${skuTexto} que vi en la web. ¿Está disponible?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
