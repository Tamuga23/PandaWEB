// ---------------------------------------------------------------------------
// Configuración de negocio. UN SOLO LUGAR para tocar textos, números y contacto.
// Nada de esto debe duplicarse dentro de los componentes.
// ---------------------------------------------------------------------------

// Producción no puede caer a localhost en silencio: sin dominio real, el
// sitemap, el canonical y el Open Graph quedan rotos sin que nadie lo note.
const urlPorDefecto =
  process.env.VERCEL_ENV === "production"
    ? undefined
    : "http://localhost:3000";

export const SITE = {
  nombre: "Panda Store",
  tagline: "Tecnología para tu casa y tu negocio",
  descripcion:
    "Proyectores, cámaras de seguridad, smartwatches, parlantes y más. Pagá en cuotas con Banpro, garantía de 3 meses y entrega inmediata en Managua.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    urlPorDefecto ??
    (() => {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL es obligatoria en producción: sin ella el sitemap y los canonical publican localhost.",
      );
    })(),
} as const;

// Coordenadas exactas del local. Es la única fuente de verdad de la ubicación:
// de acá salen el mapa embebido y el enlace de cómo llegar.
//
// Buscar "Camino de Oriente" en Google deja el pin en el punto de referencia,
// que está a varias cuadras. Con coordenadas el cliente llega a la puerta.
export const COORDENADAS = {
  lat: 12.11145891858742,
  lng: -86.25457506139524,
} as const;

const COORD = `${COORDENADAS.lat},${COORDENADAS.lng}`;

export const CONTACTO = {
  // Número comercial tomado de la configuración del POS.
  whatsapp: "50583725528",
  whatsappVisible: "+505 8372 5528",
  email: "pandastorenic@gmail.com",
  direccion: "Colectivo Dreamy, Camino de Oriente, detrás de INISER",
  ciudad: "Managua, Nicaragua",

  /** Ficha del local en Google Maps. */
  mapsUrl: "https://maps.app.goo.gl/sFcsuUYdcPVAXezJA",
  /** Abre la navegación paso a paso hacia el local. */
  comoLlegarUrl: `https://www.google.com/maps/dir/?api=1&destination=${COORD}`,
  /** Mapa embebido, sin clave de API. `z=17` deja ver las calles alrededor. */
  mapaEmbedUrl: `https://www.google.com/maps?q=${COORD}&z=17&hl=es&output=embed`,
} as const;

// Redes sociales. Agregar una acá la hace aparecer sola en el footer y en los
// datos que lee Google (sameAs), sin tocar componentes.
export const REDES = [
  {
    nombre: "Instagram",
    url: "https://instagram.com/pandastoreni",
    icono: "instagram",
  },
  {
    nombre: "Facebook",
    url: "https://www.facebook.com/share/1bqnxo6A9x/",
    icono: "facebook",
  },
] as const;

// ---------------------------------------------------------------------------
// Precio y financiamiento
// ---------------------------------------------------------------------------

// Respaldo si Firestore no responde. La tasa real se lee de
// company/shared_store.defaultExchangeRate — ver lib/catalog.ts.
export const USD_TO_NIO_FALLBACK = 36.6243;

// OJO: el mínimo, los plazos y el interés YA NO se definen acá. Viven en
// Firestore (`config/financiamiento`, editable desde Configuración del POS) y
// los calcula `lib/financiamiento.ts`, el mismo módulo que usa PandaLink.
//
// El interés dejó de ser 0% parejo: los proyectores siguen en 0% pero otras
// categorías llevan recargo, así que NINGÚN texto puede prometer "sin
// intereses" de forma general. Los que sí lo tienen se resaltan producto por
// producto con el badge "0% interés".
//
// Acá queda solo el nombre del banco, que es fijo y se usa en la copy.
export const FINANCIAMIENTO = {
  banco: "Banpro",
} as const;

export const GARANTIA_MESES = 3;

// ---------------------------------------------------------------------------
// Categorías. El POS guarda slugs en español; algunos docs viejos vienen en
// inglés. Acá se define el nombre visible y los alias que se normalizan.
// ---------------------------------------------------------------------------

export interface CategoriaDef {
  slug: string;
  nombre: string;
  alias: string[];
  descripcion: string;
}

export const CATEGORIAS: CategoriaDef[] = [
  {
    slug: "proyector",
    nombre: "Proyectores",
    alias: ["projector", "proyectores"],
    descripcion: "Convertí cualquier pared en una pantalla grande",
  },
  {
    slug: "camara",
    nombre: "Cámaras de seguridad",
    alias: ["security-cam", "camaras", "cámara", "seguridad"],
    descripcion: "Vigilá tu casa o negocio desde el teléfono",
  },
  {
    slug: "dashcam",
    nombre: "Dashcams",
    alias: ["dash-cam", "dashcams"],
    descripcion: "Grabá todo lo que pasa en el camino",
  },
  {
    slug: "smartwatch",
    nombre: "Smartwatches",
    alias: ["smart-watch", "reloj", "relojes"],
    descripcion: "Salud, notificaciones y deporte en la muñeca",
  },
  {
    slug: "parlante",
    nombre: "Parlantes",
    alias: ["speaker", "parlantes", "bocina"],
    descripcion: "Sonido potente para fiesta o para trabajar",
  },
  {
    slug: "smarthome",
    nombre: "Smart home",
    alias: ["smart-home", "hogar", "domotica", "domótica"],
    descripcion: "Automatizá luces, enchufes y accesos",
  },
  {
    slug: "smarttv",
    nombre: "Smart TV y streaming",
    alias: ["smarttv-device", "smart-tv", "tv", "streaming", "tvbox"],
    descripcion: "Convertí tu tele en una smart TV",
  },
];

// ---------------------------------------------------------------------------
// Textos comerciales
// ---------------------------------------------------------------------------

export const PROPUESTA_VALOR = [
  { titulo: "Financiamiento Banpro", texto: "Llevalo hasta en 6 cuotas" },
  { titulo: `Garantía ${GARANTIA_MESES} meses`, texto: "Respaldo con factura" },
  { titulo: "Entrega inmediata", texto: "Delivery en Managua" },
  { titulo: "Atención personal", texto: "Te asesoramos por WhatsApp" },
];

// Nota que acompaña siempre al precio: el espejo del catálogo se sincroniza
// una vez al día, así que el precio final se confirma con el asesor.
export const NOTA_PRECIO =
  "Precio y disponibilidad se confirman por WhatsApp al momento de la compra.";
