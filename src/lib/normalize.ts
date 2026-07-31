// Normalizador de productos. Portado de PandaLink (src/hooks/usePandaData.ts)
// con dos diferencias importantes:
//
//   1. Los slugs se canonizan a ESPAÑOL (el POS es la fuente de verdad y guarda
//      "proyector"). PandaLink los pasa a inglés y deja "dashcam" sin mapear,
//      lo que rompe el filtro de esa categoría. Acá se cubren las seis.
//   2. Se DESCARTAN los campos privados: `cost` y `precio.efectivo` no
//      sobreviven a esta función, así que no pueden llegar al navegador ni
//      aunque un componente los pidiera.

import { CATEGORIAS } from "@/config/site";
import type { Bullet, FotoGaleria, Media, Producto, Specs } from "./types";

// Índice alias → slug canónico, construido una sola vez.
const SLUG_INDEX: Record<string, string> = (() => {
  const idx: Record<string, string> = {};
  for (const c of CATEGORIAS) {
    idx[c.slug.toLowerCase()] = c.slug;
    for (const a of c.alias) idx[a.toLowerCase()] = c.slug;
  }
  return idx;
})();

export function canonizarSlug(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const s = raw.trim().toLowerCase();
  if (!s) return undefined;
  return SLUG_INDEX[s] ?? s; // categoría desconocida: se respeta tal cual
}

const num = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
};

const str = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length > 0 ? s : undefined;
};

/** Una URL de imagen sirve si es http(s) o un data URI embebido. */
function urlImagenValida(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("data:image/")) return s;
  return undefined;
}

function normalizarMedia(raw: unknown, root: Record<string, unknown>): Media {
  const m = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  let hero = urlImagenValida(m.heroImage);

  // Docs viejos: media.fotos[] era el arreglo original.
  const fotos = Array.isArray(m.fotos)
    ? (m.fotos as unknown[]).map(urlImagenValida).filter(Boolean as unknown as (x: string | undefined) => x is string)
    : [];

  // El POS guarda la foto del inventario como base64 en la raíz. Normalmente no
  // viaja al espejo, pero si viaja la aprovechamos antes que quedarnos sin foto.
  if (!hero) hero = urlImagenValida(root.imageBase64);
  if (!hero && fotos.length > 0) hero = fotos[0];

  // Galería: el POS nuevo manda objetos {url,label}; los viejos, strings.
  const galleryRaw = Array.isArray(m.gallery) ? (m.gallery as unknown[]) : [];
  const gallery: FotoGaleria[] = galleryRaw
    .map((g): FotoGaleria | null => {
      if (typeof g === "string") {
        const u = urlImagenValida(g);
        return u ? { url: u } : null;
      }
      if (g && typeof g === "object") {
        const o = g as Record<string, unknown>;
        const u = urlImagenValida(o.url);
        return u ? { url: u, label: str(o.label) } : null;
      }
      return null;
    })
    .filter((g): g is FotoGaleria => g !== null);

  // Las fotos sueltas del esquema viejo se suman a la galería sin duplicar.
  for (const f of fotos) {
    if (!gallery.some((g) => g.url === f)) gallery.push({ url: f });
  }
  if (hero && !gallery.some((g) => g.url === hero)) {
    gallery.unshift({ url: hero });
  }

  return {
    heroImage: hero,
    gallery,
    videoUrl: str(m.videoUrl),
  };
}

function normalizarBullets(raw: unknown): Bullet[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .map((b) => (b && typeof b === "object" ? (b as Record<string, unknown>) : null))
    .filter((b): b is Record<string, unknown> => b !== null)
    .slice()
    .sort((a, b) => (num(a.order) ?? 99) - (num(b.order) ?? 99))
    .map((b) => ({ texto: str(b.texto) ?? str(b.text) ?? "", icon: str(b.icon) }))
    .filter((b) => b.texto.length > 0);
}

function normalizarSpecs(raw: Record<string, unknown>): Specs | undefined {
  const base =
    raw.specs && typeof raw.specs === "object"
      ? { ...(raw.specs as Record<string, unknown>) }
      : raw.specsProyector && typeof raw.specsProyector === "object"
        ? { ...(raw.specsProyector as Record<string, unknown>) }
        : {};

  // Specs sueltas en la raíz del documento (esquema viejo), sin pisar las que ya
  // existen dentro del objeto.
  const rootMap: Record<string, string> = {
    ansi: "ansi",
    lumens: "ansi",
    throwRatio: "throwRatio",
    distMinEnfoque: "distMinEnfoque",
    resolucion: "resolucion",
    autofoco: "autofoco",
  };
  for (const [src, dest] of Object.entries(rootMap)) {
    if (raw[src] !== undefined && base[dest] === undefined) base[dest] = raw[src];
  }

  // Quitar vacíos para no renderizar filas en blanco.
  for (const k of Object.keys(base)) {
    const v = base[k];
    if (v === undefined || v === null || v === "") delete base[k];
  }

  return Object.keys(base).length > 0 ? (base as Specs) : undefined;
}

/**
 * Convierte un documento crudo de `catalogo_publico` en un Producto público.
 * Devuelve null si el documento no es publicable (sin nombre, o marcado como
 * no publicar).
 */
export function normalizarProducto(raw: Record<string, unknown>): Producto | null {
  const id = str(raw.id);
  if (!id) return null;

  // Nombre: algunos docs viejos guardan el nombre en `description`.
  const name = str(raw.name) ?? str(raw.description);
  if (!name) return null;

  // Visibilidad: publicar === false lo saca del catálogo, pase lo que pase.
  if (raw.publicar === false) return null;
  if (raw.activo === false && raw.disponible === undefined) return null;

  // Disponibilidad. El espejo ya trae el booleano calculado (stock > 0 &&
  // publicar !== false); el resto son respaldos para docs con esquema viejo.
  let disponible: boolean;
  if (typeof raw.disponible === "boolean") disponible = raw.disponible;
  else if (typeof raw.activo === "boolean") disponible = raw.activo;
  else if (typeof raw.publicar === "boolean") disponible = raw.publicar;
  else {
    const stock = num(raw.stock);
    disponible = stock !== undefined ? stock > 0 : true;
  }

  // ---- Precio -------------------------------------------------------------
  // Dos esquemas posibles:
  //   1) Espejo del POS: { precio: { lista, promo, actual, efectivo, ... } }
  //   2) Campos sueltos: { price, precioPromo, ... }
  // `efectivo` y `cost` se ignoran deliberadamente y no se copian nunca.
  let lista: number | undefined;
  let actual: number | undefined;

  if (raw.precio && typeof raw.precio === "object") {
    const pr = raw.precio as Record<string, unknown>;
    lista = num(pr.lista) ?? num(pr.regular);
    actual = num(pr.actual) ?? num(pr.promo) ?? lista;
  } else {
    lista = num(raw.price);
    actual = num(raw.precioPromo) ?? lista;
  }

  // Si el "descuento" no descuenta nada, no mostramos precio tachado.
  if (lista !== undefined && actual !== undefined && lista <= actual) {
    lista = undefined;
  }

  return {
    id,
    sku: str(raw.sku),
    name,
    description: str(raw.description) !== name ? str(raw.description) : undefined,
    categorySlug: canonizarSlug(raw.categorySlug) ?? canonizarSlug(raw.category),
    disponible,
    precio: { lista, actual },
    beneficio: str(raw.beneficio),
    campania: str(raw.campania),
    bullets: normalizarBullets(raw.bullets),
    specs: normalizarSpecs(raw),
    media: normalizarMedia(raw.media, raw),
    updatedAt: num(raw.updatedAt),
  };
}
