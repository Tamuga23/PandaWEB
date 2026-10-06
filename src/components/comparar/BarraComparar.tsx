"use client";

import { ProductImage } from "@/components/ProductImage";
import { MAX_COMPARAR, useComparar } from "./CompararProvider";
import { IconoCerrar } from "@/components/iconos";
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
    // role="region": se puede saltar a la barra por landmarks; está al final
    // del DOM (después del footer) aunque se vea fija abajo.
    <div
      role="region"
      aria-label="Comparador"
      className="barra-comparar fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:bottom-6 lg:px-0"
    >
      {/* flex-wrap: en móvil miniaturas + texto + Limpiar + Comparar no
          entran en una fila (con 3 productos Comparar se salía de la pantalla
          y el texto quedaba en 0px de ancho, encimado sobre Limpiar). Los
          botones bajan juntos a una segunda fila; desde ~470px (1-2
          productos) o ~525px (3) es una sola. */}
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-2xl border border-borde2 bg-superficie p-3 shadow-flotante">
        <div className="flex gap-2">
          {seleccion.map((p) => (
            <div key={p.id} className="relative h-12 w-12 shrink-0">
              {/* La bandeja de ProductImage llena la caja (rounded-xl, como
                  las miniaturas de la galería). Antes este div no estaba
                  posicionado y la foto se ubicaba contra el de afuera, por
                  encima del borde y del radio. */}
              <div className="h-full w-full overflow-hidden rounded-xl border border-borde">
                <ProductImage
                  src={p.media.heroImage}
                  alt={p.name}
                  sizes="48px"
                  categoria={p.categorySlug}
                />
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
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-superficie2 text-suave ring-1 ring-borde2 transition after:absolute after:-inset-3 after:content-[''] hover:text-texto"
              >
                <IconoCerrar className="h-3 w-3" />
              </button>
            </div>
          ))}
          {faltaUno && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-dashed border-borde2 text-tenue">
              <IconoComparar className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* aria-live: al pasar de 1 a 2 productos se anuncia "2 de 3".
            min-w más chico por debajo de 360px: a 320, con 3 productos, las
            miniaturas (160) + gap (12) + 7rem (112) no entraban en los 270px
            de ancho útil, el texto bajaba solo y los botones pasaban a una
            tercera fila. Con 5.5rem (88) entra en la primera ("3 de 3 /
            seleccionados" en dos renglones). Desde 360 queda en 7rem: con
            5.5rem en todos los anchos, con 1 producto, entre ~444 y ~465px
            la barra se juntaba en una sola fila con el texto apretado en
            tres renglones. */}
        <p
          aria-live="polite"
          className="min-w-[5.5rem] flex-1 text-xs leading-snug text-suave min-[360px]:min-w-[7rem]"
        >
          {faltaUno
            ? "Elegí otro producto para comparar"
            : `${seleccion.length} de ${MAX_COMPARAR} seleccionados`}
        </p>

        {/* -inset-1.5 (no -inset-3 como el resto del comparador): estos dos
            botones están pegados uno al otro con solo 12px de gap — el
            -3 completo de cada lado se hubiera solapado con el vecino
            (Limpiar es destructivo, Comparar no; una zona de toque
            ambigua entre ambos sería peor que el problema que arregla). */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={limpiar}
            className="relative shrink-0 rounded-lg px-2 py-2 text-xs font-medium text-tenue transition after:absolute after:-inset-1.5 after:content-[''] hover:text-texto"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={abrir}
            disabled={faltaUno}
            className="btn-primary relative shrink-0 px-5 py-2.5 text-sm after:absolute after:-inset-1.5 after:content-[''] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Comparar
          </button>
        </div>
      </div>
    </div>
  );
}
