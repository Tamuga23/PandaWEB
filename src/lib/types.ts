import type {
  ConfigFinanciamiento,
  FinanciamientoOverride,
  PlanCuotas,
} from "./financiamiento";

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
  /** Título corto opcional arriba del bullet (ej. "BATERÍA"). Lo carga el POS. */
  etiqueta?: string;
  icon?: string;
}

/**
 * Ficha técnica. Deliberadamente abierta: los campos que aplican a cada
 * categoría los define `lib/categorySpecs.ts` (el mismo archivo que usa el POS
 * para editarlos), así que agregar uno no obliga a tocar este tipo.
 * Se listan las claves conocidas solo para tener autocompletado.
 */
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
  resistenciaAgua?: string;
  duracionBateria?: string;
  almacenamiento?: string;
  tamanoPantalla?: string;
  /** Mapa clave→valor con specs sueltas. Se expande como filas propias. */
  extra?: Record<string, string | number | boolean>;
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
  /** Excepción de financiamiento del producto, tal como la cargó el POS. */
  financiamientoOverride?: FinanciamientoOverride;
  /**
   * Cuotas ya calculadas. Se resuelven UNA VEZ en la capa de datos
   * (`lib/catalog.ts`), donde se conocen la tasa y las reglas vigentes, y de ahí
   * viajan dentro del producto. Así ningún componente — ni los del cliente, como
   * el comparador — necesita las reglas, y no hay forma de que dos vistas
   * calculen distinto la misma cuota.
   */
  planes: PlanCuotas[];
  updatedAt?: number;
}

/** Datos de catálogo servidos a las páginas. */
export interface CatalogoData {
  productos: Producto[];
  /** Reglas de financiamiento vigentes. Las páginas las usan para la copy. */
  configFinanciamiento: ConfigFinanciamiento;
  /** Tasa USD→NIO vigente, leída de company/shared_store. */
  tasa: number;
  /** Momento de la lectura, para mostrar frescura si hiciera falta. */
  leidoEn: number;
}
