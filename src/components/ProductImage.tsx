"use client";

import Image from "next/image";
import { useState } from "react";
import { IconoCategoria } from "./IconoCategoria";

interface Props {
  src?: string;
  alt: string;
  /** `true` para la foto principal de la ficha: carga con prioridad. */
  priority?: boolean;
  sizes?: string;
  /** Clases de la foto en sí (el zoom del hover, su transición). */
  className?: string;
  /** Clases de la bandeja: el radio que pide cada lugar ("rounded-xl"). */
  bandeja?: string;
  /** Slug de la categoría: sin foto, el marcador muestra su ícono. */
  categoria?: string;
  /** Agotado en una lista: se apaga la bandeja entera, no solo la foto. */
  apagada?: boolean;
  /**
   * Foto de escena (ambiente, infografía): no es de estudio con fondo blanco,
   * así que va sobre la superficie del sitio y no sobre la bandeja blanca, que
   * la dejaba con bandas gris claro a los costados.
   */
  escena?: boolean;
}

/**
 * Foto de producto sobre su bandeja, tolerante a fallos.
 *
 * La bandeja (`bandeja-foto`, globals.css) la pone este componente en los 6
 * lugares que muestran fotos: cada lugar solo decide el marco y el radio. Las
 * fotos del POS son de estudio con fondo blanco, así que la bandeja es de ese
 * mismo blanco (nunca asoma el recuadro de la imagen) con el velo del tema
 * encima.
 *
 * Hoy las fotos están alojadas en Imgur, que bloquea el hotlinking de forma
 * intermitente y borra subidas anónimas viejas. En vez de mostrar un ícono roto,
 * caemos en el ícono de la categoría del producto.
 *
 * Los data URI (base64 heredado del POS) no pasan por el optimizador de Next,
 * que solo trabaja con URLs remotas o locales.
 */
export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
  bandeja = "",
  categoria,
  apagada = false,
  escena = false,
}: Props) {
  const [fallo, setFallo] = useState(false);
  const conFoto = src != null && src !== "" && !fallo;

  // Sin foto no hay blanco de estudio que fundir. El agotado sin foto va sobre
  // la superficie del sitio, el nivel más bajo de la sección de agotados; el
  // disponible (Imgur caído) conserva la bandeja para no abrir un hueco oscuro
  // entre sus vecinos.
  const fondo = conFoto
    ? escena
      ? "bg-superficie"
      : "bandeja-foto"
    : apagada
      ? "bg-superficie2"
      : "bandeja-foto";

  return (
    // span y no div: en las miniaturas de la galería vive dentro de un <button>.
    <span className={`relative block h-full w-full overflow-hidden ${fondo} ${bandeja}`}>
      {conFoto ? (
        // El aire: next/image con `fill` es absolute inset-0 y no ve el
        // padding del padre (por eso el producto tocaba los bordes). El 5% se
        // mide contra la bandeja y alcanza para que la esquina redondeada
        // nunca recorte el producto.
        <span className="absolute inset-[5%]">
          {src.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              onError={() => setFallo(true)}
              className={`h-full w-full object-contain ${className}`}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              onError={() => setFallo(true)}
              className={`object-contain ${className}`}
            />
          )}
        </span>
      ) : (
        // Sin texto: el nombre ya está en la tarjeta, y "que falta la foto"
        // se entiende solo. La ficha suma la leyenda (ver Galeria).
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-tenue">
          <IconoCategoria slug={categoria} grosor={1.25} className="h-2/5 w-2/5 max-h-16 max-w-16" />
        </span>
      )}
      {/* El agotado se apaga entero (bandeja y foto) y no solo la foto: con
          la foto al 70% sobre una bandeja clara, los agotados brillaban casi
          como los disponibles. Las pastillas Agotado/Oferta son hermanas de
          este componente, así que conservan su contraste. */}
      {apagada && <span aria-hidden="true" className="absolute inset-0 bg-superficie/30" />}
    </span>
  );
}
