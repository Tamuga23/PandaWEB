import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnlaceWhatsApp } from "@/components/EnlaceWhatsApp";
import { ErrorDatos } from "@/components/ErrorDatos";
import { EventoVerFicha } from "@/components/EventoVerFicha";
import { Galeria } from "@/components/Galeria";
import { PrecioFicha } from "@/components/Precio";
import { ProductCard } from "@/components/ProductCard";
import { TablaSpecs } from "@/components/Specs";
import { BotonComparar } from "@/components/comparar/BotonComparar";
import { IconoCheck, IconoWhatsApp } from "@/components/iconos";
import {
  CATEGORIAS,
  CONTACTO,
  GARANTIA_MESES,
  NOTA_PRECIO,
  SITE,
} from "@/config/site";
import { getCatalogo, getProducto } from "@/lib/catalog";
import { filasDeSpecs } from "@/lib/categorySpecs";
import { cordobas, cordobasNumero, linkWhatsApp } from "@/lib/format";

// Regenera la página cada 15 minutos con los datos frescos del espejo.
export const revalidate = 900;

const NOMBRE_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.slug, c.nombre]));

/**
 * Pre-genera las fichas en el build. Si Firestore no responde, devolvemos una
 * lista vacía: las páginas se generarán bajo demanda en vez de tumbar el build.
 */
export async function generateStaticParams() {
  try {
    const { productos } = await getCatalogo();
    return productos.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const datos = await getProducto(id);
    if (!datos) return { title: "Producto no encontrado" };

    const { producto, tasa } = datos;
    const descripcion =
      producto.beneficio ??
      producto.description ??
      `${producto.name} disponible en ${SITE.nombre}. ${cordobas(producto.precio.actual, tasa)}, con opción de pago en cuotas.`;

    return {
      title: producto.name,
      description: descripcion,
      openGraph: {
        title: producto.name,
        description: descripcion,
        type: "website",
        // La vista previa con foto es lo que hace que compartir el enlace por
        // WhatsApp funcione como herramienta de venta.
        images: producto.media.heroImage ? [producto.media.heroImage] : undefined,
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let datos;
  try {
    datos = await getProducto(id);
  } catch (e) {
    return <ErrorDatos error={e} />;
  }
  if (!datos) notFound();

  const { producto, tasa, relacionados } = datos;
  const wa = linkWhatsApp(CONTACTO.whatsapp, producto);
  const categoria = producto.categorySlug
    ? (NOMBRE_CATEGORIA[producto.categorySlug] ?? producto.categorySlug)
    : null;
  // Filas realmente visibles de la ficha técnica (ordenadas y etiquetadas según
  // la categoría). Se calculan acá para decidir si la sección existe.
  const filasSpecs = filasDeSpecs(producto.categorySlug, producto.specs);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 lg:pb-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-tenue">
        <Link href="/catalogo" className="transition hover:text-acento">
          Catálogo
        </Link>
        {categoria && (
          <>
            <span aria-hidden="true">/</span>
            <Link
              href={`/catalogo?cat=${producto.categorySlug}`}
              className="transition hover:text-acento"
            >
              {categoria}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Galeria media={producto.media} nombre={producto.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Disponibilidad disponible={producto.disponible} />
            {producto.campania && (
              <span className="rounded-full bg-promo/15 px-3 py-1 text-xs font-semibold text-promo">
                {producto.campania}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {producto.name}
          </h1>

          {producto.sku && (
            <p className="mt-1.5 text-xs text-tenue">Código {producto.sku}</p>
          )}

          {producto.beneficio && (
            <p className="mt-4 text-lg leading-relaxed text-texto">
              {producto.beneficio}
            </p>
          )}

          <div className="mt-7">
            <PrecioFicha producto={producto} tasa={tasa} />
          </div>

          {/* CTA de escritorio. En móvil se usa la barra fija de abajo. */}
          <div className="mt-7 hidden gap-3 lg:flex">
            <CtaWhatsApp href={wa} disponible={producto.disponible} />
            <BotonComparar producto={producto} tasa={tasa} variante="completo" />
          </div>

          {/* En móvil el CTA vive en la barra fija, así que el comparar va acá. */}
          <div className="mt-7 lg:hidden">
            <BotonComparar producto={producto} tasa={tasa} variante="completo" />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-tenue">
            {NOTA_PRECIO} Incluye factura y garantía de {GARANTIA_MESES} meses.
          </p>

          {producto.bullets.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-suave">
                Por qué te sirve
              </h2>
              <ul className="mt-3 space-y-2.5">
                {producto.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-texto">
                    <IconoCheck className="mt-0.5 h-4 w-4 shrink-0 text-acento" />
                    <span>
                      {b.etiqueta && (
                        <span className="mr-1.5 font-semibold uppercase tracking-wide text-suave">
                          {b.etiqueta}:
                        </span>
                      )}
                      {b.texto}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {producto.description && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-suave">
                Descripción
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-texto">
                {producto.description}
              </p>
            </section>
          )}

          {/* `specs` puede existir pero no dejar ninguna fila visible (todo
              vacío, o booleanos en false). Se pregunta por las filas reales
              para no mostrar un título sobre una tabla en blanco. */}
          {filasSpecs.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-suave">
                Especificaciones
              </h2>
              <div className="mt-3">
                <TablaSpecs specs={producto.specs ?? {}} categorySlug={producto.categorySlug} />
              </div>
            </section>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold tracking-tight">
            También te puede servir
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} tasa={tasa} />
            ))}
          </div>
        </section>
      )}

      {/* Barra fija en móvil: el botón de compra nunca queda fuera de pantalla. */}
      <div className="barra-producto fixed inset-x-0 bottom-0 z-30 border-t border-borde bg-fondo/95 p-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-tenue">{producto.name}</p>
            <p className="text-lg font-bold text-precio">
              {cordobas(producto.precio.actual, tasa)}
            </p>
          </div>
          <CtaWhatsApp href={wa} disponible={producto.disponible} compacto />
        </div>
      </div>

      <ProductoJsonLd
        nombre={producto.name}
        descripcion={producto.beneficio ?? producto.description}
        imagen={producto.media.heroImage}
        sku={producto.sku}
        url={`${SITE.url}/producto/${id}`}
        precioNio={
          producto.precio.actual != null
            ? cordobasNumero(producto.precio.actual, tasa)
            : undefined
        }
        disponible={producto.disponible}
      />
      <EventoVerFicha sku={producto.sku} />
    </div>
  );
}

function Disponibilidad({ disponible }: { disponible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        disponible
          ? "bg-marca/10 text-precio"
          : "bg-agotado/10 text-agotado"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${disponible ? "bg-precio" : "bg-agotado"}`}
        aria-hidden="true"
      />
      {disponible ? "Disponible" : "Agotado"}
    </span>
  );
}

function CtaWhatsApp({
  href,
  disponible,
  compacto = false,
}: {
  href: string;
  disponible: boolean;
  compacto?: boolean;
}) {
  return (
    <EnlaceWhatsApp
      href={href}
      className={`flex shrink-0 items-center justify-center gap-2 rounded-full bg-marca font-semibold text-white transition hover:opacity-90 ${
        compacto ? "px-5 py-3 text-sm" : "w-full px-6 py-4 text-base"
      }`}
    >
      <IconoWhatsApp className="h-5 w-5" />
      {disponible ? "Lo quiero" : "Avisarme cuando llegue"}
    </EnlaceWhatsApp>
  );
}

/**
 * Datos estructurados para Google: habilitan el resultado enriquecido con
 * precio y disponibilidad en la búsqueda.
 */
function ProductoJsonLd({
  nombre,
  descripcion,
  imagen,
  sku,
  url,
  precioNio,
  disponible,
}: {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  sku?: string;
  url: string;
  precioNio?: number;
  disponible: boolean;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nombre,
    url,
    ...(descripcion && { description: descripcion }),
    ...(imagen && !imagen.startsWith("data:") && { image: imagen }),
    ...(sku && { sku }),
    brand: { "@type": "Brand", name: SITE.nombre },
    ...(precioNio != null && {
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "NIO",
        price: precioNio,
        availability: disponible
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
