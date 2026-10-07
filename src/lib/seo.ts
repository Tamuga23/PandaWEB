// ---------------------------------------------------------------------------
// SEO: títulos, descripciones y datos estructurados (JSON-LD).
//
// Todo lo que lee Google sale de acá, con funciones puras: así las pruebas
// pueden revisar que el 0% de interés solo se anuncie donde de verdad existe,
// que la marca sea la del fabricante y que ningún dato del POS rompa el HTML.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { CATEGORIAS, CONTACTO, COORDENADAS, FINANCIAMIENTO, REDES, SITE } from "@/config/site";
import { filasDeSpecs } from "./categorySpecs";
import {
  esCategoriaSinInteres,
  type ConfigFinanciamiento,
  type PlanCuotas,
} from "./financiamiento";
import { beneficioDesdeSpecs, cordobas, cordobasNumero } from "./format";
import type { Media, Producto } from "./types";

/** Lo que Google muestra antes de cortar con "…" (aprox., en escritorio). */
const MAX_TITULO = 60;
const MAX_DESCRIPCION = 160;

const SUFIJO_TITULO = ` | ${SITE.nombre}`;

/** La corta entra cuando la larga obligaría a recortar el texto del producto. */
const ENTREGA = "Delivery en Managua y envíos a todo Nicaragua.";
const ENTREGA_CORTA = "Envíos a todo Nicaragua.";

/**
 * Título de la portada y de cualquier página sin título propio. Lo que se
 * busca va primero; la tienda, al final, igual que en el resto de páginas.
 */
export const TITULO_SITIO = `Proyectores, dashcams y smartwatches en Managua${SUFIJO_TITULO}`;

/** Identificador de la tienda en el JSON-LD: las ofertas la citan como vendedor. */
export const ID_TIENDA = `${SITE.url}/#tienda`;

/**
 * Campos de Open Graph comunes a todas las páginas. Next mezcla la metadata
 * de forma superficial: una página que define su propio `openGraph` pierde
 * los del layout, así que cada una lo arma a partir de esta base.
 */
export const OPEN_GRAPH_BASE = {
  type: "website",
  locale: "es_NI",
  siteName: SITE.nombre,
} as const satisfies Metadata["openGraph"];

/**
 * Marcas del catálogo, reconocidas por el nombre del producto: el POS no
 * guarda la marca aparte. Si no aparece ninguna, el JSON-LD omite `brand` en
 * vez de inventarla (antes decía "Panda Store", que es la tienda, no el
 * fabricante).
 */
const MARCAS: { marca: string; patron: RegExp }[] = [
  { marca: "Magcubic", patron: /\bmag ?cubic\b/i },
  { marca: "70mai", patron: /\b70 ?mai\b/i },
  { marca: "Amazfit", patron: /\bamazfit\b/i },
  // Redmi es una línea de Xiaomi.
  { marca: "Xiaomi", patron: /\b(xiaomi|redmi)\b/i },
  // Sin "Alexa": "compatible con Alexa" aparece en productos de otras marcas.
  { marca: "Amazon", patron: /\b(amazon|fire tv|echo (dot|show|pop|spot))\b/i },
  { marca: "Anker", patron: /\b(anker|soundcore)\b/i },
  { marca: "TP-Link", patron: /\btp-?link\b/i },
];

export function marcaDe(nombre: string): string | undefined {
  return MARCAS.find(({ patron }) => patron.test(nombre))?.marca;
}

/** Los nombres del POS a veces traen espacios dobles ("HY320PRO  400 ANSI"). */
function limpiar(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

/**
 * Recorta en el último espacio antes del límite, sin dejar una coma o un
 * signo colgando antes de los puntos suspensivos.
 */
function recortar(texto: string, max: number): string {
  const limpio = limpiar(texto);
  if (limpio.length <= max) return /[.!?…]$/.test(limpio) ? limpio : `${limpio}.`;
  const corte = limpio.slice(0, max - 1);
  const ultimoEspacio = corte.lastIndexOf(" ");
  const base = ultimoEspacio > 0 ? corte.slice(0, ultimoEspacio) : corte;
  return `${base.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

function primeraOracion(texto: string | undefined): string | undefined {
  if (!texto) return undefined;
  const fin = texto.search(/[.!?](\s|$)/);
  return fin === -1 ? texto : texto.slice(0, fin + 1);
}

/**
 * Título de la ficha. Suma "en Nicaragua" (lo que se busca junto al modelo)
 * solo si entra completo con el sufijo de la tienda: un título largo se
 * corta justo en el modelo, que es lo que más importa.
 */
export function tituloProducto(producto: Pick<Producto, "name">): string {
  const nombre = limpiar(producto.name);
  const conLugar = `${nombre} en Nicaragua`;
  return conLugar.length + SUFIJO_TITULO.length <= MAX_TITULO ? conLugar : nombre;
}

/**
 * Precio y cuotas para la descripción. El "0% de interés" sale de los planes
 * ya calculados con las reglas del POS, nunca de la categoría a ojo: solo los
 * plazos que de verdad van sin recargo cuentan para el "hasta N cuotas".
 */
function textoPrecioYCuotas(producto: Pick<Producto, "precio" | "planes">, tasa: number): string {
  const precio = producto.precio.actual != null ? cordobas(producto.precio.actual, tasa) : null;
  const sinInteres = producto.planes.filter((p: PlanCuotas) => p.sinInteres);
  const banco = FINANCIAMIENTO.banco;

  if (sinInteres.length > 0) {
    const meses = Math.max(...sinInteres.map((p) => p.meses));
    const cuotas = `hasta ${meses} cuotas al 0% de interés con ${banco}.`;
    return precio ? `${precio} o ${cuotas}` : `Pagalo en ${cuotas}`;
  }
  if (producto.planes.length > 0) {
    return precio ? `${precio} o en cuotas con ${banco}.` : `Pagalo en cuotas con ${banco}.`;
  }
  return precio ? `${precio}.` : "";
}

/**
 * Meta descripción de la ficha: primero lo propio del producto, después
 * precio, cuotas y entrega. Lo propio es, en orden: el beneficio que carga el
 * POS, la primera oración de la descripción, el mismo resumen de specs que
 * muestra la ficha cuando no hay beneficio, y recién al final el nombre (que
 * ya está en el título). Si no entra todo, se acorta la entrega y después se
 * recorta lo propio, nunca la oferta.
 */
export function descripcionProducto(producto: Producto, tasa: number): string {
  const propio = recortar(
    producto.beneficio ??
      primeraOracion(producto.description) ??
      beneficioDesdeSpecs(filasDeSpecs(producto.categorySlug, producto.specs)) ??
      `${producto.name} en ${SITE.nombre}, Managua.`,
    MAX_DESCRIPCION,
  );
  const precioYCuotas = textoPrecioYCuotas(producto, tasa);
  const cola = (entrega: string) => [precioYCuotas, entrega].filter(Boolean).join(" ");

  for (const entrega of [ENTREGA, ENTREGA_CORTA]) {
    const completa = `${propio} ${cola(entrega)}`;
    if (completa.length <= MAX_DESCRIPCION) return completa;
  }
  const corta = cola(ENTREGA_CORTA);
  return `${recortar(propio, MAX_DESCRIPCION - corta.length - 1)} ${corta}`;
}

/**
 * Descripción de la portada. Los proyectores se anuncian al 0% solo si la
 * configuración vigente del POS los tiene así: un texto fijo seguiría
 * prometiéndolo aunque cambie la regla.
 */
export function descripcionPortada(config: ConfigFinanciamiento): string {
  const cuotas = esCategoriaSinInteres(config, "proyector")
    ? `Proyectores en cuotas al 0% de interés con ${FINANCIAMIENTO.banco}`
    : `Pagá en cuotas con ${FINANCIAMIENTO.banco}`;
  return `Proyectores Magcubic, dashcams 70mai y smartwatches en Managua, Nicaragua. ${cuotas} y envíos a todo el país.`;
}

/**
 * Descripción de una categoría del catálogo (`/catalogo?cat=…`). Sin la
 * configuración del POS (Firestore caído) no promete 0%: es el lado seguro.
 */
export function descripcionCategoria(
  categoria: { slug: string; descripcion: string },
  config: ConfigFinanciamiento | null,
): string {
  const cuotas =
    config && esCategoriaSinInteres(config, categoria.slug)
      ? `Cuotas al 0% de interés con ${FINANCIAMIENTO.banco}`
      : `Cuotas con ${FINANCIAMIENTO.banco}`;
  return `${categoria.descripcion}. ${cuotas}, delivery en Managua y envíos a todo Nicaragua.`;
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

/**
 * Serializa para un <script type="application/ld+json">. Los textos vienen
 * del POS: un "</script>" en una descripción cerraría la etiqueta e
 * inyectaría HTML. Con `<` escapado el JSON sigue siendo el mismo para Google.
 */
export function serializarJsonLd(datos: object): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}

/** Tienda y sitio, en un solo grafo. Va en el layout, o sea en todas las páginas. */
export function tiendaJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // ElectronicsStore es un LocalBusiness: habilita la ficha local con
        // dirección y mapa en búsquedas tipo "proyectores Managua".
        "@type": "ElectronicsStore",
        "@id": ID_TIENDA,
        name: SITE.nombre,
        description: SITE.descripcion,
        url: SITE.url,
        logo: `${SITE.url}/icon.png`,
        image: `${SITE.url}/opengraph-image`,
        telephone: `+${CONTACTO.whatsapp}`,
        email: CONTACTO.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: CONTACTO.direccion,
          addressLocality: "Managua",
          addressRegion: "Managua",
          addressCountry: "NI",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: COORDENADAS.lat,
          longitude: COORDENADAS.lng,
        },
        hasMap: CONTACTO.mapsUrl,
        // sameAs le dice a Google que estos perfiles son del mismo negocio,
        // así suma la reputación de las redes a la ficha de la tienda.
        sameAs: REDES.map((r) => r.url),
        currenciesAccepted: "NIO",
        // Delivery en Managua y envíos a los departamentos.
        areaServed: [
          { "@type": "City", name: "Managua" },
          { "@type": "Country", name: "Nicaragua" },
        ],
      },
      {
        // Con WebSite, Google puede mostrar "Panda Store" como nombre del
        // sitio en los resultados en vez del dominio.
        "@type": "WebSite",
        "@id": `${SITE.url}/#sitio`,
        name: SITE.nombre,
        url: SITE.url,
        inLanguage: "es-NI",
        publisher: { "@id": ID_TIENDA },
      },
    ],
  };
}

/**
 * URLs de foto publicables: la principal primero y sin repetidas. Los data
 * URI (base64 heredado del POS) quedan afuera, Google no los indexa.
 */
export function imagenesPublicas(media: Media): string[] {
  const urls = [media.heroImage, ...(media.gallery ?? []).map((f) => f.url)];
  return [...new Set(urls.filter((u): u is string => !!u && /^https?:\/\//.test(u)))];
}

const NOMBRE_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.slug, c.nombre]));

/**
 * Producto con su oferta: habilita el resultado con precio y disponibilidad.
 * El precio es el mismo número en córdobas que muestra la ficha (Google
 * descarta la oferta si no coincide con lo visible).
 *
 * @param resumen texto de respaldo si el POS no cargó descripción ni beneficio
 */
export function productoJsonLd(producto: Producto, tasa: number, resumen?: string) {
  const url = `${SITE.url}/producto/${producto.id}`;
  const imagenes = imagenesPublicas(producto.media);
  const marca = marcaDe(producto.name);
  const descripcion = producto.description ?? producto.beneficio ?? resumen;
  const categoria = producto.categorySlug ? NOMBRE_CATEGORIA[producto.categorySlug] : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#producto`,
    name: limpiar(producto.name),
    url,
    ...(descripcion && { description: limpiar(descripcion) }),
    ...(imagenes.length > 0 && { image: imagenes }),
    ...(producto.sku && { sku: producto.sku }),
    ...(marca && { brand: { "@type": "Brand", name: marca } }),
    ...(categoria && { category: categoria }),
    ...(producto.precio.actual != null && {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "NIO",
        price: cordobasNumero(producto.precio.actual, tasa),
        availability: producto.disponible
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", "@id": ID_TIENDA, name: SITE.nombre },
      },
    }),
  };
}

/** Migas de la ficha, las mismas que muestra la página arriba del producto. */
export function migasJsonLd(producto: Pick<Producto, "id" | "name" | "categorySlug">) {
  const categoria = producto.categorySlug ? NOMBRE_CATEGORIA[producto.categorySlug] : undefined;
  const migas = [
    { name: "Catálogo", item: `${SITE.url}/catalogo` },
    ...(categoria
      ? [{ name: categoria, item: `${SITE.url}/catalogo?cat=${producto.categorySlug}` }]
      : []),
    { name: limpiar(producto.name), item: `${SITE.url}/producto/${producto.id}` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, ...m })),
  };
}
