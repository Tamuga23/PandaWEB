import Link from "next/link";
import { ErrorDatos } from "@/components/ErrorDatos";
import { ProductCard } from "@/components/ProductCard";
import {
  IconoCamion,
  IconoCheck,
  IconoEscudo,
  IconoFlecha,
  IconoTarjeta,
  IconoUbicacion,
  IconoWhatsApp,
} from "@/components/iconos";
import {
  CATEGORIAS,
  CONTACTO,
  COORDENADAS,
  FINANCIAMIENTO,
  GARANTIA_MESES,
  REDES,
  SITE,
} from "@/config/site";
import { contarPorCategoria, destacados, getCatalogo } from "@/lib/catalog";
import { esCategoriaSinInteres, type ConfigFinanciamiento } from "@/lib/financiamiento";
import { linkWhatsApp } from "@/lib/format";

export const revalidate = 900;

export default async function Home() {
  let datos;
  try {
    datos = await getCatalogo();
  } catch (e) {
    return <ErrorDatos error={e} />;
  }

  const { productos, tasa, configFinanciamiento } = datos;
  const conteo = contarPorCategoria(productos);
  const catsConProductos = CATEGORIAS.filter((c) => (conteo[c.slug] ?? 0) > 0);
  const top = destacados(productos, 8);

  return (
    <>
      <Hero config={configFinanciamiento} />
      <Ventajas config={configFinanciamiento} />
      {catsConProductos.length > 0 && (
        <Categorias
          categorias={catsConProductos.map((c) => ({ ...c, total: conteo[c.slug] }))}
        />
      )}
      {top.length > 0 && <Destacados productos={top} tasa={tasa} />}
      <Financiamiento config={configFinanciamiento} />
      <Ubicacion />
      <NegocioJsonLd />
    </>
  );
}

/**
 * Datos del negocio para Google. Con las coordenadas exactas, las búsquedas
 * locales tipo "proyectores Managua" pueden mostrar la tienda con su ubicación.
 */
function NegocioJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE.nombre,
    description: SITE.descripcion,
    telephone: CONTACTO.whatsappVisible,
    email: CONTACTO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACTO.direccion,
      addressLocality: "Managua",
      addressCountry: "NI",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COORDENADAS.lat,
      longitude: COORDENADAS.lng,
    },
    hasMap: CONTACTO.mapsUrl,
    // sameAs le dice a Google que estos perfiles son del mismo negocio, así
    // suma la reputación de las redes a la ficha de la tienda.
    sameAs: REDES.map((r) => r.url),
    currenciesAccepted: "NIO",
    areaServed: "Managua, Nicaragua",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

// ---------------------------------------------------------------------------

function Hero({ config }: { config: ConfigFinanciamiento }) {
  const plazoMaximo = Math.max(...config.plazos);

  return (
    <section className="relative overflow-hidden border-b border-borde">
      {/* Resplandor cyan de fondo: da profundidad sin costar una imagen. */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-acento/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-borde2 bg-superficie/60 px-4 py-1.5 text-xs font-medium text-texto">
          <span className="h-1.5 w-1.5 rounded-full bg-precio" aria-hidden="true" />
          Entrega inmediata en Managua
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          Tecnología para tu casa
          <br />
          <span className="text-acento">y tu negocio</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-suave">
          Proyectores, cámaras de seguridad, smartwatches y más. Pagá hasta en{" "}
          {plazoMaximo} cuotas y llevate {GARANTIA_MESES} meses de garantía.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 rounded-full bg-marca px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Ver catálogo
            <IconoFlecha className="h-4 w-4" />
          </Link>
          <a
            href={linkWhatsApp(CONTACTO.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-borde2 bg-superficie px-6 py-3.5 text-sm font-semibold text-texto transition hover:border-precio hover:text-precio"
          >
            <IconoWhatsApp className="h-4 w-4" />
            Hablar con un asesor
          </a>
        </div>
      </div>
    </section>
  );
}

function Ventajas({ config }: { config: ConfigFinanciamiento }) {
  const plazoMaximo = Math.max(...config.plazos);
  const items = [
    {
      Icono: IconoTarjeta,
      titulo: `Financiamiento ${FINANCIAMIENTO.banco}`,
      texto: `Llevalo hasta en ${plazoMaximo} cuotas mensuales`,
    },
    {
      Icono: IconoEscudo,
      titulo: `Garantía ${GARANTIA_MESES} meses`,
      texto: "Con factura y respaldo real",
    },
    {
      Icono: IconoCamion,
      titulo: "Entrega inmediata",
      texto: "Delivery en Managua",
    },
    {
      Icono: IconoWhatsApp,
      titulo: "Atención personal",
      texto: "Te asesoramos antes de comprar",
    },
  ];

  return (
    <section className="border-b border-borde bg-superficie/40">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icono, titulo, texto }) => (
          <div key={titulo} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-acento/10 text-acento">
              <Icono className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-texto">{titulo}</p>
              <p className="mt-0.5 text-sm text-suave">{texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categorias({
  categorias,
}: {
  categorias: { slug: string; nombre: string; descripcion: string; total: number }[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Qué estás buscando
      </h2>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?cat=${c.slug}`}
            className="group rounded-2xl border border-borde bg-superficie p-5 transition hover:border-acento/50 hover:bg-superficie2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-texto transition group-hover:text-acento">
                  {c.nombre}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-suave">
                  {c.descripcion}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-superficie2 px-2.5 py-1 text-xs font-medium text-suave">
                {c.total}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Destacados({
  productos,
  tasa,
}: {
  productos: Awaited<ReturnType<typeof getCatalogo>>["productos"];
  tasa: number;
}) {
  return (
    <section className="border-y border-borde bg-superficie/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Lo más pedido
          </h2>
          <Link
            href="/catalogo"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-acento transition hover:opacity-75"
          >
            Ver todo
            <IconoFlecha className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {productos.map((p, i) => (
            <ProductCard key={p.id} producto={p} tasa={tasa} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Financiamiento({ config }: { config: ConfigFinanciamiento }) {
  const plazos = [...config.plazos].sort((a, b) => a - b);
  const minUsd = config.minUsd;
  // Las categorías que de verdad van a 0%. La copy las nombra en vez de
  // prometer "sin intereses" en todo, que ya sería falso.
  const categoriasCero = CATEGORIAS.filter((c) =>
    esCategoriaSinInteres(config, c.slug),
  ).map((c) => c.nombre.toLowerCase());

  const pasos = [
    "Elegís el producto que querés",
    "Nos escribís por WhatsApp",
    `Te ayudamos con el trámite en ${FINANCIAMIENTO.banco}`,
    "Te lo entregamos con factura y garantía",
  ];

  return (
    <section id="financiamiento" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <div className="grid gap-10 rounded-3xl border border-precio/20 bg-precio/5 p-8 lg:grid-cols-2 lg:p-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-precio">
            Financiamiento {FINANCIAMIENTO.banco}
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Llevalo hoy y pagalo en cuotas
          </h2>
          <p className="mt-4 leading-relaxed text-texto">
            Pagalo en {plazos.join(" o ")} cuotas mensuales, sin prima y sin cargos
            escondidos.{" "}
            {categoriasCero.length > 0 && (
              <>
                En <b>{categoriasCero.join(" y ")}</b> las cuotas son a{" "}
                <b className="text-precio">0% de interés</b>.
              </>
            )}
          </p>
          <p className="mt-3 text-sm text-tenue">
            Aplica a productos desde US${minUsd}. Cada producto muestra su cuota
            exacta en la ficha; los que van a 0% llevan el sello.{" "}
            Sujeto a aprobación de {FINANCIAMIENTO.banco}.
          </p>
          <a
            href={linkWhatsApp(CONTACTO.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-marca px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <IconoWhatsApp className="h-4 w-4" />
            Consultar mi caso
          </a>
        </div>

        <ol className="space-y-4">
          {pasos.map((paso, i) => (
            <li key={paso} className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-precio/15 text-xs font-bold text-precio">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-texto">
                {paso}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Ubicacion() {
  const incluye = [
    "Factura y garantía por escrito",
    "Prueba del equipo antes de llevártelo",
    "Delivery dentro de Managua",
  ];

  return (
    <section id="ubicacion" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Visitanos
          </h2>
          <p className="mt-4 flex items-start gap-2 leading-relaxed text-texto">
            <IconoUbicacion className="mt-1 h-5 w-5 shrink-0 text-acento" />
            <span>
              {CONTACTO.direccion}
              <br />
              {CONTACTO.ciudad}
            </span>
          </p>

          <ul className="mt-6 space-y-2.5">
            {incluye.map((t) => (
              <li key={t} className="flex gap-2.5 text-sm text-texto">
                <IconoCheck className="mt-0.5 h-4 w-4 shrink-0 text-acento" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            {/* Abre la navegación paso a paso, no la ficha del local: si alguien
                toca "Cómo llegar" es porque va en camino. */}
            <a
              href={CONTACTO.comoLlegarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-borde2 px-5 py-3 text-sm font-semibold text-texto transition hover:border-acento hover:text-acento"
            >
              Cómo llegar
            </a>
            <a
              href={linkWhatsApp(CONTACTO.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-marca px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <IconoWhatsApp className="h-4 w-4" />
              {CONTACTO.whatsappVisible}
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-borde bg-superficie">
          {/* Mapa embebido sin clave de API. Centrado en las coordenadas
              exactas del local, no en el punto de referencia. `loading="lazy"`
              evita que pese en la carga inicial de la portada. */}
          <iframe
            title={`Ubicación de ${SITE.nombre}`}
            src={CONTACTO.mapaEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[320px] w-full"
          />
        </div>
      </div>
    </section>
  );
}
