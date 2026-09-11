import type { Metadata } from "next";
import { CatalogoCliente } from "@/components/CatalogoCliente";
import { ErrorDatos } from "@/components/ErrorDatos";
import { CATEGORIAS, NOTA_PRECIO } from "@/config/site";
import { getCatalogo } from "@/lib/catalog";

const METADATA_GENERAL: Metadata = {
  title: "Catálogo",
  description:
    "Proyectores, cámaras de seguridad, dashcams, smartwatches, parlantes y productos smart home. Con financiamiento Banpro en cuotas.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}): Promise<Metadata> {
  const { cat } = await searchParams;
  const categoria = CATEGORIAS.find((c) => c.slug === cat);
  if (!categoria) return METADATA_GENERAL;

  return {
    title: categoria.nombre,
    description: `${categoria.descripcion}. Con financiamiento Banpro en cuotas.`,
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
