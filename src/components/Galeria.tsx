"use client";

import { useState } from "react";
import { youTubeId } from "@/lib/format";
import type { Media } from "@/lib/types";
import { ProductImage } from "./ProductImage";

/**
 * Galería de la ficha: foto grande + miniaturas.
 *
 * Si el producto tiene video de YouTube, entra como una diapositiva más en vez
 * de ocupar una sección aparte — el cliente espera encontrarlo junto a las fotos.
 * Las etiquetas de la galería ("A oscuras", "Con luz") vienen del POS y son
 * información de venta: se muestran sobre la foto.
 */
export function Galeria({ media, nombre }: { media: Media; nombre: string }) {
  const fotos = media.gallery ?? [];
  const videoId = youTubeId(media.videoUrl);
  const total = fotos.length + (videoId ? 1 : 0);

  const [indice, setIndice] = useState(0);
  const esVideo = videoId != null && indice === fotos.length;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-borde bg-superficie p-6">
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
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label={`Imágenes de ${nombre}`}
        >
          {fotos.map((f, i) => (
            <button
              key={f.url + i}
              type="button"
              role="tab"
              aria-selected={indice === i && !esVideo}
              aria-label={f.label ?? `Foto ${i + 1}`}
              onClick={() => setIndice(i)}
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-superficie p-1.5 transition ${
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
              role="tab"
              aria-selected={esVideo}
              aria-label="Ver video"
              onClick={() => setIndice(fotos.length)}
              className={`relative grid aspect-square h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border bg-superficie transition ${
                esVideo ? "border-acento" : "border-borde hover:border-borde2"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <span className="relative grid h-7 w-7 place-items-center rounded-full bg-fondo/80 text-[10px] text-acento">
                ▶
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
