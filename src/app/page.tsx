import type { Metadata } from "next";
import Link from "next/link";
import { EnlaceConversion } from "@/components/EnlaceConversion";
import { EnlaceWhatsApp } from "@/components/EnlaceWhatsApp";
import { ErrorDatos } from "@/components/ErrorDatos";
import { IconoCategoria, colorDeMarca } from "@/components/IconoCategoria";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { itemsPropuestaValor } from "@/components/PropuestaValor";
import {
  IconoCheck,
  IconoFlecha,
  IconoReloj,
  IconoUbicacion,
  IconoWhatsApp,
} from "@/components/iconos";
import {
  CATEGORIAS,
  CONTACTO,
  ENVIOS,
  FINANCIAMIENTO,
  GARANTIA_COBERTURA,
  GARANTIA_MESES,
  HORARIO,
  SITE,
} from "@/config/site";
import { contarPorCategoria, destacados, getCatalogo } from "@/lib/catalog";
import { esCategoriaSinInteres, type ConfigFinanciamiento } from "@/lib/financiamiento";
import { cordobas, lineaHorario, linkWhatsApp } from "@/lib/format";
import { CONVERSIONES } from "@/lib/gtag";
import { elegirHero } from "@/lib/portada";
import { TITULO_SITIO, descripcionPortada } from "@/lib/seo";
import type { Producto } from "@/lib/types";

export const revalidate = 900;

/**
 * Sin `openGraph` propio: Next mezcla la metadata de forma superficial y la
 * portada perdería la imagen de app/opengraph-image.tsx, que cuelga del
 * layout. Comparte el título y la descripción general del sitio.
 */
export async function generateMetadata(): Promise<Metadata> {
  let descripcion: string = SITE.descripcion;
  try {
    // La misma lectura en caché que usa la página: no suma lecturas.
    const { configFinanciamiento } = await getCatalogo();
    descripcion = descripcionPortada(configFinanciamiento);
  } catch {
    // Sin catálogo queda la descripción general, que no promete 0%.
  }

  return {
    // absolute: TITULO_SITIO ya trae "| Panda Store".
    title: { absolute: TITULO_SITIO },
    description: descripcion,
    alternates: { canonical: "/" },
  };
}

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
  const top = destacados(productos, 12);
  // Lo que ya salió en la vitrina del hero no se repite en "Lo más pedido",
  // dos secciones más abajo.
  const vitrina = elegirHero(top, 4);
  const idsVitrina = new Set(vitrina.map((p) => p.id));
  const masPedidos = top.filter((p) => !idsVitrina.has(p.id)).slice(0, 8);

  return (
    <>
      <Hero config={configFinanciamiento} vitrina={vitrina} tasa={tasa} />
      <Ventajas config={configFinanciamiento} />
      {catsConProductos.length > 0 && (
        <Categorias
          categorias={catsConProductos.map((c) => ({ ...c, total: conteo[c.slug] }))}
        />
      )}
      {masPedidos.length > 0 && <Destacados productos={masPedidos} tasa={tasa} />}
      <Financiamiento config={configFinanciamiento} />
      <Ubicacion />
      {/* Los datos del negocio para Google (ElectronicsStore) están en el
          layout, en todas las páginas: ver tiendaJsonLd en lib/seo.ts. */}
    </>
  );
}

// ---------------------------------------------------------------------------

function Hero({
  config,
  vitrina,
  tasa,
}: {
  config: ConfigFinanciamiento;
  vitrina: Producto[];
  tasa: number;
}) {
  const plazoMaximo = Math.max(...config.plazos);

  // Antes era texto centrado sobre un resplandor cyan, sin ningún producto:
  // en el celular la primera foto aparecía recién después de dos pantallas.
  // Ahora la profundidad la dan los productos reales, no un degradado.
  return (
    <section className="border-b border-borde">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-borde2 bg-superficie/60 px-4 py-1.5 text-xs font-medium text-texto">
            <span className="h-1.5 w-1.5 rounded-full bg-precio" aria-hidden="true" />
            Entrega inmediata en Managua
          </span>

          {/* Sin <br>: con el salto forzado, "Tecnología para tu casa" no
              entraba en una línea (ni en el celular ni en la columna del
              hero) y "casa" quedaba sola. text-balance reparte el título en
              dos líneas parejas. */}
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
            Tecnología para tu casa{" "}
            <span className="text-acento">y tu negocio</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-suave">
            Proyectores Magcubic, dashcams 70mai, smartwatches y más. Pagá hasta en{" "}
            {plazoMaximo} cuotas y llevate {GARANTIA_MESES} meses de garantía.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm"
            >
              Ver catálogo
              <IconoFlecha className="h-4 w-4" />
            </Link>
            <EnlaceWhatsApp
              href={linkWhatsApp(CONTACTO.whatsapp)}
              className="inline-flex items-center gap-2 rounded-full border border-borde2 bg-superficie px-6 py-3.5 text-sm font-semibold text-texto transition hover:border-precio hover:text-precio"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Hablar con un asesor
            </EnlaceWhatsApp>
          </div>
        </div>

        {vitrina.length > 0 && <Vitrina productos={vitrina} tasa={tasa} />}
      </div>
    </section>
  );
}

/**
 * Vitrina del hero. En el celular es una tira que se desliza justo debajo de
 * los botones, así lo primero que se ve ya son productos con precio; en
 * escritorio, un mosaico al lado del texto (el primero ancho arriba, dos
 * abajo; el cuarto solo existe en la tira).
 *
 * Es el mismo marcado en los dos tamaños y solo cambia el layout: con dos
 * versiones ocultas por CSS, el celular descargaría también las fotos del
 * mosaico.
 */
function Vitrina({ productos, tasa }: { productos: Producto[]; tasa: number }) {
  return (
    // -my-2 py-2: overflow-x-auto recorta también en vertical, y sin ese aire
    // el anillo de foco de las tarjetas quedaba cortado arriba y abajo.
    <ul
      aria-label="Algunos de nuestros productos"
      className="-mx-4 -my-2 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 py-2 scrollbar-none lg:mx-0 lg:my-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:py-0"
    >
      {productos.map((p, i) => (
        <li
          key={p.id}
          className={`w-40 shrink-0 snap-start lg:w-auto ${i === 0 ? "lg:col-span-2" : ""} ${i > 2 ? "lg:hidden" : ""}`}
        >
          {/* Precarga solo la primera, la ancha del mosaico (el LCP en
              escritorio); las otras dos visibles se piden sin esperar. La
              cuarta solo existe en la tira del celular, fuera de pantalla. */}
          <TarjetaVitrina
            producto={p}
            tasa={tasa}
            ancha={i === 0}
            carga={i === 0 ? "lcp" : i < 3 ? "inmediata" : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

function TarjetaVitrina({
  producto,
  tasa,
  ancha,
  carga,
}: {
  producto: Producto;
  tasa: number;
  ancha: boolean;
  carga?: "lcp" | "inmediata";
}) {
  return (
    // Mismo patrón de hover sin temblor que ProductCard (ver DESIGN.md).
    <Link href={`/producto/${producto.id}`} className="group block h-full rounded-2xl">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition duration-200 group-hover:border-acento/50 group-hover:shadow-elevada motion-safe:group-hover:-translate-y-0.5">
        {/* La misma pieza que la tarjeta del catálogo: marco de 4px y la
            bandeja de foto que pone ProductImage (ver ProductCard). */}
        <div
          className={`relative p-1 ${ancha ? "aspect-square lg:aspect-[2/1]" : "aspect-square"}`}
        >
          <ProductImage
            src={producto.media.heroImage}
            alt={producto.name}
            carga={carga}
            sizes={ancha ? "(min-width: 1024px) 540px, 160px" : "(min-width: 1024px) 260px, 160px"}
            bandeja="rounded-xl"
            categoria={producto.categorySlug}
            className="transition duration-300 motion-safe:group-hover:scale-105"
          />
        </div>
        <div className="px-3 py-2.5">
          <p className="line-clamp-1 text-sm font-semibold text-texto transition group-hover:text-acento">
            {producto.name}
          </p>
          <p className="text-sm font-bold text-precio">
            {cordobas(producto.precio.actual, tasa)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function Ventajas({ config }: { config: ConfigFinanciamiento }) {
  const plazoMaximo = Math.max(...config.plazos);
  const items = itemsPropuestaValor(plazoMaximo);

  return (
    <section className="border-b border-borde bg-superficie/40">
      {/* Dos columnas también en el celular: apiladas de a una ocupaban una
          pantalla entera entre el hero y las categorías. */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:gap-6 sm:py-10 lg:grid-cols-4">
        {items.map(({ Icono, titulo, texto }) => (
          <div key={titulo} className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
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
      {/* Dos columnas desde el celular: eran tarjetas de solo texto, una por
          fila, y ocupaban más de una pantalla. */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {categorias.map((c, i) => {
          // Cada tarjeta toma su tramo del degradado de marca según su
          // posición: recorriendo la grilla se ve el degradado entero.
          const desde = colorDeMarca(i / categorias.length);
          const hasta = colorDeMarca((i + 1) / categorias.length);
          const medio = colorDeMarca((i + 0.5) / categorias.length);
          return (
            // Mismo patrón que ProductCard: el Link detecta el hover y no se
            // mueve; la tarjeta de adentro es la que sube (sin temblor en el
            // borde de abajo).
            <Link
              key={c.slug}
              href={`/catalogo?cat=${c.slug}`}
              className="group block rounded-2xl"
            >
              {/* Sin cambio de fondo en hover: pasaba a superficie2, el mismo
                  color de la pastilla del conteo, que desaparecía. */}
              <div className="flex h-full flex-col rounded-2xl border border-borde bg-superficie p-4 transition duration-200 group-hover:border-acento/50 group-hover:shadow-elevada motion-safe:group-hover:-translate-y-0.5 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  {/* El fondo es el mismo color del ícono al 12%: el mismo
                      recurso que las ventajas (bg-acento/10), con el tono de
                      su tramo. */}
                  <span
                    className="grid h-12 w-12 place-items-center rounded-2xl transition duration-200 motion-safe:group-hover:scale-105 sm:h-14 sm:w-14"
                    style={{ backgroundColor: `color-mix(in srgb, ${medio} 12%, transparent)` }}
                  >
                    <IconoCategoria
                      slug={c.slug}
                      desde={desde}
                      hasta={hasta}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    />
                  </span>
                  <span className="shrink-0 rounded-full bg-superficie2 px-2.5 py-0.5 text-xs font-medium text-suave">
                    {c.total}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-texto transition group-hover:text-acento sm:text-base">
                  {c.nombre}
                </h3>
                <p className="mt-1 hidden text-sm leading-relaxed text-suave sm:block">
                  {c.descripcion}
                </p>
              </div>
            </Link>
          );
        })}
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
          {/* Sin `carga`: esta sección quedó debajo del hero y de las
              categorías, y la foto que se precarga es la de la vitrina. */}
          {productos.map((p) => (
            <ProductCard key={p.id} producto={p} tasa={tasa} />
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
    `Venís a la tienda con tu tarjeta ${FINANCIAMIENTO.banco}`,
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
            Necesitás tarjeta de crédito {FINANCIAMIENTO.banco} — se aplica
            directo en el POS de la tienda, sin trámites.
          </p>
          <EnlaceWhatsApp
            href={linkWhatsApp(CONTACTO.whatsapp)}
            className="btn-primary mt-7 inline-flex items-center gap-2 px-5 py-3 text-sm"
          >
            <IconoWhatsApp className="h-4 w-4" />
            Consultar mi caso
          </EnlaceWhatsApp>
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
    `Garantía de ${GARANTIA_MESES} meses por escrito en la factura, ${GARANTIA_COBERTURA}`,
    "Prueba del equipo antes de llevártelo",
    ENVIOS.managua,
    ENVIOS.departamentos,
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
          <p className="mt-3 flex items-start gap-2 leading-relaxed text-texto">
            <IconoReloj className="mt-1 h-5 w-5 shrink-0 text-acento" />
            <span>
              {HORARIO.map((franja) => (
                <span key={franja.dias} className="block">
                  {lineaHorario(franja)}
                </span>
              ))}
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
            <EnlaceConversion
              href={CONTACTO.comoLlegarUrl}
              gtag={CONVERSIONES.comoLlegar}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-borde2 px-5 py-3 text-sm font-semibold text-texto transition hover:border-acento hover:text-acento"
            >
              Cómo llegar
            </EnlaceConversion>
            <EnlaceWhatsApp
              href={linkWhatsApp(CONTACTO.whatsapp)}
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
            >
              <IconoWhatsApp className="h-4 w-4" />
              {CONTACTO.whatsappVisible}
            </EnlaceWhatsApp>
            <EnlaceConversion
              href={`tel:+${CONTACTO.whatsapp}`}
              gtag={CONVERSIONES.llamada}
              className="rounded-full border border-borde2 px-5 py-3 text-sm font-semibold text-texto transition hover:border-acento hover:text-acento"
            >
              Llamar
            </EnlaceConversion>
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
