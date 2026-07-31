import Link from "next/link";
import { CATEGORIAS } from "@/config/site";
import { porcentajeDescuento } from "@/lib/format";
import type { Producto } from "@/lib/types";
import { PrecioTarjeta } from "./Precio";
import { ProductImage } from "./ProductImage";
import { BotonComparar } from "./comparar/BotonComparar";

const NOMBRE_CATEGORIA = Object.fromEntries(
  CATEGORIAS.map((c) => [c.slug, c.nombre]),
);

export function ProductCard({
  producto,
  tasa,
  priority = false,
}: {
  producto: Producto;
  tasa: number;
  priority?: boolean;
}) {
  // El badge de oferta se enciende con el dato real: existe precio de lista
  // mayor al vigente, o sea que hay un precioPromo cargado en el POS.
  const descuento = porcentajeDescuento(producto.precio.lista, producto.precio.actual);

  return (
    <Link
      href={`/producto/${producto.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition hover:border-acento/50"
    >
      <div className="relative aspect-square overflow-hidden bg-fondo/40 p-4">
        <ProductImage
          src={producto.media.heroImage}
          alt={producto.name}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition duration-300 group-hover:scale-105"
        />

        {descuento != null && (
          <span className="absolute right-3 top-3 rounded-lg bg-marca px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
            −{descuento}% Oferta
          </span>
        )}

        {!producto.disponible && (
          <span className="absolute left-3 top-3 rounded-full bg-fondo/90 px-2.5 py-1 text-[11px] font-semibold text-agotado ring-1 ring-agotado/30">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {producto.categorySlug && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-tenue">
            {NOMBRE_CATEGORIA[producto.categorySlug] ?? producto.categorySlug}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-texto transition group-hover:text-acento">
          {producto.name}
        </h3>
        {producto.beneficio && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-suave">
            {producto.beneficio}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <PrecioTarjeta producto={producto} tasa={tasa} />
          <BotonComparar producto={producto} tasa={tasa} />
        </div>
      </div>
    </Link>
  );
}
