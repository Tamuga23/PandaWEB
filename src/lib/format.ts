import { FINANCIAMIENTO } from "@/config/site";

/** Precio en córdobas, redondeado a la decena para que se lea limpio. */
export function cordobas(usd: number | undefined, tasa: number): string {
  if (usd == null) return "Consultar";
  const nio = Math.round((usd * tasa) / 10) * 10;
  return "C$" + nio.toLocaleString("es-NI");
}

/** Igual que `cordobas` pero sin redondear a la decena (para cuotas). */
export function cordobasExacto(usd: number | undefined, tasa: number): string {
  if (usd == null) return "Consultar";
  return "C$" + Math.round(usd * tasa).toLocaleString("es-NI");
}

export interface Cuota {
  meses: number;
  montoNio: number;
}

/**
 * Cuotas Banpro. Misma regla que PandaLink: solo a partir del monto mínimo,
 * 0% de interés, sin prima, división simple del precio vigente.
 */
export function calcularCuotas(usd: number | undefined, tasa: number): Cuota[] {
  if (usd == null || usd < FINANCIAMIENTO.minUsd) return [];
  return FINANCIAMIENTO.plazos.map((meses) => ({
    meses,
    montoNio: Math.round((usd * tasa) / meses),
  }));
}

/** La cuota más baja disponible, para el gancho "desde C$X/mes" en la tarjeta. */
export function cuotaMinima(usd: number | undefined, tasa: number): Cuota | null {
  const cuotas = calcularCuotas(usd, tasa);
  if (cuotas.length === 0) return null;
  return cuotas.reduce((min, c) => (c.montoNio < min.montoNio ? c : min));
}

/** Porcentaje de descuento respecto al precio de lista. */
export function porcentajeDescuento(
  lista: number | undefined,
  actual: number | undefined,
): number | null {
  if (lista == null || actual == null || lista <= actual) return null;
  return Math.round(((lista - actual) / lista) * 100);
}

/** Extrae el ID de un video de YouTube de cualquier formato de URL. */
export function youTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

/** Enlace de WhatsApp con el producto ya identificado en el mensaje. */
export function linkWhatsApp(
  numero: string,
  producto?: { name: string; sku?: string },
): string {
  const texto = producto
    ? `Hola 👋 Me interesa el ${producto.name}${producto.sku ? ` (SKU ${producto.sku})` : ""} que vi en la web. ¿Está disponible?`
    : "Hola 👋 Vi su catálogo en la web y quiero más información.";
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
