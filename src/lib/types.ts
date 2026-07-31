// Tipos de PandaWEB. Derivan de PublicCatalogProduct (POS) pero son un
// SUBCONJUNTO deliberado: los campos privados no existen acá.
//
// Nunca agregar `cost` ni `precio.efectivo` a estos tipos.
//   - `cost`    → costo interno, jamás sale del POS.
//   - `efectivo`→ descuento por pago en efectivo; es la carta del asesor para
//                 cerrar por WhatsApp. Se descarta en la capa de datos.

export interface PrecioPublico {
  /** Precio de lista en USD. Solo se muestra tachado si hay promoción. */
  lista?: number;
  /** Precio vigente en USD. Es el que se muestra. */
  actual?: number;
}

export interface Bullet {
  texto: string;
  icon?: string;
}

export interface Specs {
  ansi?: number;
  lumens?: number;
  resolucion?: string;
  throwRatio?: number | string;
  distMinEnfoque?: number | string;
  autofoco?: boolean;
  contraste?: string;
  conectividad?: string[];
  garantiaMeses?: number;
  extra?: string;
  [key: string]: unknown;
}

export interface FotoGaleria {
  url: string;
  label?: string;
}

export interface Media {
  heroImage?: string;
  gallery?: FotoGaleria[];
  videoUrl?: string;
}

export interface Producto {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  /** Slug canónico de categoría, ya normalizado a español (ver config/site.ts). */
  categorySlug?: string;
  disponible: boolean;
  precio: PrecioPublico;
  beneficio?: string;
  campania?: string;
  bullets: Bullet[];
  specs?: Specs;
  media: Media;
  updatedAt?: number;
}

/** Datos de catálogo servidos a las páginas. */
export interface CatalogoData {
  productos: Producto[];
  /** Tasa USD→NIO vigente, leída de company/shared_store. */
  tasa: number;
  /** Momento de la lectura, para mostrar frescura si hiciera falta. */
  leidoEn: number;
}
