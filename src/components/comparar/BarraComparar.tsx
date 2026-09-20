"use client";

import { ProductImage } from "@/components/ProductImage";
import { MAX_COMPARAR, useComparar } from "./CompararProvider";
import { IconoComparar } from "./BotonComparar";

/**
 * Barra flotante con lo que el cliente lleva seleccionado.
 *
 * No abre el modal sola al llegar a dos productos: en el boceto lo hacía y es
 * molesto: interrumpe a alguien que todavía está mirando el catálogo. Acá
 * decide él cuándo comparar.
 */
export function BarraComparar() {
  const { seleccion, abierto, abrir, quitar, limpiar } = useComparar();

  if (seleccion.length === 0 || abierto) return null;

  const faltaUno = seleccion.length < 2;

  return (
    <div className="barra-comparar fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:bottom-6 lg:px-0">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-borde2 bg-superficie p-3 shadow-2xl">
        <div className="flex gap-2">
          {seleccion.map((p) => (
            <div key={p.id} className="relative h-12 w-12 shrink-0">
              <div className="h-full w-full overflow-hidden rounded-lg border border-borde bg-fondo p-1">
                <ProductImage src={p.media.heroImage} alt={p.name} sizes="48px" />
              </div>
              {/* El glifo visual se queda chico (mismo círculo de 20px de
                  siempre): lo que crece es el área de toque real, con un
                  ::after invisible que la lleva a 44px — el mínimo táctil
                  que pide PRODUCT.md, sin agrandar nada que se vea. Este
                  botón vive fuera del contenedor con overflow-hidden de
                  arriba a propósito, porque ese recorte también recortaría
                  el área de toque expandida. */}
              <button
                type="button"
                onClick={() => quitar(p.id)}
                aria-label={`Quitar ${p.name}`}
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-superficie2 text-xs text-suave ring-1 ring-borde2 transition after:absolute after:-inset-3 after:content-[''] hover:text-texto"
              >
                ×
              </button>
            </div>
          ))}
          {faltaUno && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-dashed border-borde2 text-tenue">
              <IconoComparar className="h-4 w-4" />
            </div>
          )}
        </div>

        <p className="min-w-0 flex-1 text-xs leading-snug text-suave">
          {faltaUno
            ? "Elegí otro producto para comparar"
            : `${seleccion.length} de ${MAX_COMPARAR} seleccionados`}
        </p>

        <button
          type="button"
          onClick={limpiar}
          className="shrink-0 rounded-lg px-2 py-2 text-xs font-medium text-tenue transition hover:text-texto"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={abrir}
          disabled={faltaUno}
          className="btn-primary shrink-0 px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Comparar
        </button>
      </div>
    </div>
  );
}
