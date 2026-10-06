"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";
import type { Media } from "@/lib/types";
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
}: {
  media: Media;
  nombre: string;
  /** Porcentaje de descuento, si el producto tiene precio de lista. */
  descuentoPct?: number | null;
}) {
  const fotos = media.gallery ?? [];
  const videoId = youTubeId(media.videoUrl);
  const total = fotos.length + (videoId ? 1 : 0);

  const [indice, setIndice] = useState(0);
  const esVideo = videoId != null && indice === fotos.length;
  // Sin fotos ni video, el p-6 solo le pegaba al placeholder (next/image con
  // `fill` lo ignora): quedaba una caja de esquinas duras dentro de otra
  // redondeada, y el cuadrado era el bloque más grande de la pantalla sin
  // decir nada. Sin padding, el placeholder llena el marco; 4:3 lo achica.
  const sinMedia = total === 0;

  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-2xl border border-borde bg-superficie ${
          sinMedia ? "aspect-[4/3]" : "aspect-square p-6"
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
        {esVideo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Video de ${nombre}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <>
            <ProductImage
              src={fotos[indice]?.url}
              alt={`${nombre}${fotos[indice]?.label ? ` — ${fotos[indice].label}` : ""}`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {fotos[indice]?.label && (
              <span className="absolute bottom-4 left-4 rounded-full bg-fondo/85 px-3 py-1.5 text-xs font-medium text-texto ring-1 ring-borde2">
                {fotos[indice].label}
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
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-superficie p-1.5 transition ${
                indice === i && !esVideo
                  ? "border-acento"
                  : "border-borde hover:border-borde2"
              }`}
            >
              <ProductImage src={f.url} alt="" sizes="64px" />
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
