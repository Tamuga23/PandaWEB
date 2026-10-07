import type { Metadata } from "next";
import { CatalogoCliente } from "@/components/CatalogoCliente";
import { ErrorDatos } from "@/components/ErrorDatos";
import { CATEGORIAS, NOTA_PRECIO } from "@/config/site";
import { getCatalogo } from "@/lib/catalog";
import type { ConfigFinanciamiento } from "@/lib/financiamiento";
import { descripcionCategoria } from "@/lib/seo";

const METADATA_GENERAL: Metadata = {
  title: "Catálogo de tecnología en Managua",
  description:
    "Proyectores Magcubic, dashcams 70mai, smartwatches Amazfit y Xiaomi, parlantes y smart home en Managua, Nicaragua. Cuotas con Banpro y envíos a todo el país.",
  alternates: { canonical: "/catalogo" },
};

/**
 * Cada categoría es la página de destino de búsquedas como "proyectores
 * Managua": título con el lugar y el 0% solo donde el POS lo tiene así.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}): Promise<Metadata> {
  const { cat } = await searchParams;
  const categoria = CATEGORIAS.find((c) => c.slug === cat);
  if (!categoria) return METADATA_GENERAL;

  let config: ConfigFinanciamiento | null = null;
  try {
    // La misma lectura en caché que usa la página: no suma lecturas.
    config = (await getCatalogo()).configFinanciamiento;
  } catch {
    // Sin configuración, la descripción no promete 0%.
  }

  return {
    title: `${categoria.nombre} en Managua`,
    description: descripcionCategoria(categoria, config),
    alternates: { canonical: `/catalogo?cat=${categoria.slug}` },
  };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;

  let datos;
  try {
    datos = await getCatalogo();
  } catch (e) {
    return <ErrorDatos error={e} />;
  }

  // Solo se acepta un slug que exista de verdad: así un enlace viejo o mal
  // escrito muestra todo el catálogo en vez de una página vacía.
  const categoriaInicial = CATEGORIAS.some((c) => c.slug === cat) ? cat : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo</h1>
        <p className="mt-2 max-w-2xl text-suave">
          Todo lo que tenemos, con precio en córdobas y la cuota mensual de cada
          producto.{" "}
          {NOTA_PRECIO}
        </p>
      </header>

      <CatalogoCliente
        productos={datos.productos}
        tasa={datos.tasa}
        categoriaInicial={categoriaInicial}
      />
    </div>
  );
}
