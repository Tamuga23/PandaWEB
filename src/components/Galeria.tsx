"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";
import type { Media } from "@/lib/types";
import { IconoCategoria } from "./IconoCategoria";
import { IconoPlay } from "./iconos";
import { ProductImage } from "./ProductImage";

/**
 * Galería de la ficha: foto grande + miniaturas.
 *
 * Si el producto tiene video de YouTube, entra como una diapositiva más en vez
 * de ocupar una sección aparte — el cliente espera encontrarlo junto a las fotos.
 * Las etiquetas de la galería ("A oscuras", "Con luz") vienen del POS y son
 * información de venta: se muestran sobre la foto.
 */
export function Galeria({
  media,
  nombre,
  descuentoPct,
  categoria,
}: {
  media: Media;
  nombre: string;
  /** Porcentaje de descuento, si el producto tiene precio de lista. */
  descuentoPct?: number | null;
  /** Slug de la categoría: sin fotos, la banda muestra su ícono. */
  categoria?: string;
}) {
  const fotos = media.gallery ?? [];
  const videoId = youTubeId(media.videoUrl);
  const total = fotos.length + (videoId ? 1 : 0);

  const [indice, setIndice] = useState(0);
  const esVideo = videoId != null && indice === fotos.length;
  // Sin fotos ni video, la galería es una banda baja: 3:1 en el celular, para
  // que estado, nombre y precio entren en la primera pantalla (antes era un
  // 4:3 y el bloque más grande de la pantalla sin decir nada), y 2:1 en lg,
  // donde la columna derecha marca la altura.
  const sinMedia = total === 0;
  const foto = fotos[indice];

  return (
    <div>
      {/* p-1: el mismo marco de 4px que la tarjeta del catálogo, con la
          bandeja rounded-xl adentro (16 − 4 = 12, concéntricas). */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-borde bg-superficie p-1 ${
          sinMedia ? "aspect-[3/1] lg:aspect-[2/1]" : "aspect-square"
        }`}
      >
        {/* Mismo patrón que la tarjeta del catálogo (ProductCard): el badge
            de oferta va sobre la imagen, no compitiendo con el precio en
            texto — y así el cliente ve la misma señal en el mismo lugar en
            ambas pantallas. Fuera del condicional de video para que siga
            visible aunque esté viendo la diapositiva de YouTube. */}
        {descuentoPct != null && (
          <span className="absolute right-3 top-3 z-10 rounded-lg bg-marca px-2.5 py-1 text-micro font-black uppercase tracking-wider text-white shadow-md">
            −{descuentoPct}% Oferta
          </span>
        )}
        {sinMedia ? (
          // Sin foto no hay blanco de estudio que fundir: va sobre la
          // superficie, con el ícono de la categoría. La leyenda solo existe
          // acá: con poca señal, una banda gris con un ícono puede leerse
          // como una foto que todavía está cargando. text-texto y no
          // text-suave: en claro, suave sobre superficie2 no llega a AA.
          <span
            aria-hidden="true"
            className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-superficie2 text-tenue"
          >
            <IconoCategoria slug={categoria} grosor={1.25} className="h-11 w-11 lg:h-14 lg:w-14" />
            <span className="text-label font-semibold uppercase tracking-wide text-texto">
              Sin foto
            </span>
          </span>
        ) : esVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Video de ${nombre}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            {/* key por URL: ProductImage guarda en su estado si la foto
                falló, y al cambiar de miniatura la misma instancia seguía
                con el marcador aunque la foto nueva cargara bien. Las fotos
                con etiqueta del POS ("Con Luz", "A Oscuras", "Funciones"…)
                son de escena: van sobre la superficie, no sobre blanco. */}
            <ProductImage
              key={foto?.url}
              src={foto?.url}
              alt={`${nombre}${foto?.label ? ` — ${foto.label}` : ""}`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              bandeja="rounded-xl"
              categoria={categoria}
              escena={!!foto?.label}
            />
            {foto?.label && (
              <span className="absolute bottom-4 left-4 rounded-full bg-fondo/85 px-3 py-1.5 text-xs font-medium text-texto ring-1 ring-borde2">
                {foto.label}
              </span>
            )}
          </>
        )}
      </div>

      {total > 1 && (
        // Grupo de botones con aria-current, no tablist: la foto grande no es
        // un panel con contenido propio, y el patrón de pestañas promete
        // flechas, tabpanel y roving tabindex que acá no existían.
        // -mx-1 p-1: el overflow-x-auto recorta en vertical y sin ese aire el
        // anillo de foco de las miniaturas se cortaba (mt-2 + p-1 = el mt-3
        // de antes).
        <div
          className="-mx-1 mt-2 flex gap-2 overflow-x-auto p-1 scrollbar-none"
          role="group"
          aria-label={`Imágenes de ${nombre}`}
        >
          {fotos.map((f, i) => (
            <button
              key={f.url + i}
              type="button"
              aria-current={indice === i && !esVideo ? "true" : undefined}
              aria-label={`Foto ${i + 1}${f.label ? `: ${f.label}` : ""}`}
              onClick={() => setIndice(i)}
              // Sin padding: la bandeja llena el botón (que ya recorta con su
              // radio). Con marco además del borde quedaba caja dentro de caja.
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                indice === i && !esVideo
                  ? "border-acento"
                  : "border-borde hover:border-borde2"
              }`}
            >
              <ProductImage
                src={f.url}
                alt=""
                sizes="64px"
                categoria={categoria}
                escena={!!f.label}
              />
            </button>
          ))}

          {videoId && (
            <button
              type="button"
              aria-current={esVideo ? "true" : undefined}
              aria-label="Ver video"
              onClick={() => setIndice(fotos.length)}
              className={`relative grid aspect-square h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-superficie transition ${
                esVideo ? "border-acento" : "border-borde hover:border-borde2"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              {/* SVG, no el carácter ▶: en iOS ese glifo puede pintarse como
                  emoji y su grosor depende de la fuente. */}
              <span className="relative grid h-7 w-7 place-items-center rounded-full bg-fondo/80 text-acento">
                <IconoPlay className="h-3.5 w-3.5 translate-x-px" />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
