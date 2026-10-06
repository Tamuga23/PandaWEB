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
  /**
   * Foto grande de la ficha: si no hay foto (o falla), el marcador suma la
   * leyenda "Sin foto". En una lista el nombre ya está en la tarjeta; en la
   * ficha, un bloque grande con solo un ícono se lee como una foto que
   * todavía está cargando.
   */
  leyenda?: boolean;
}

/**
 * Foto de producto sobre su bandeja, tolerante a fallos.
 *
 * La bandeja (`bandeja-foto` + `velo-foto`, globals.css) la pone este
 * componente en los 6 lugares que muestran fotos: cada lugar solo decide el
 * marco y el radio. Las fotos del POS son de estudio con fondo blanco, así que
 * la bandeja es de ese mismo blanco (nunca asoma el recuadro de la imagen) con
 * el velo del tema encima.
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
  leyenda = false,
}: Props) {
  const [fallo, setFallo] = useState(false);
  const tieneSrc = src != null && src !== "";
  const conFoto = tieneSrc && !fallo;

  // El fondo, en orden:
  // - escena: la superficie con el velo, aunque falle (una miniatura de
  //   escena caída no se vuelve un cuadrado blanco);
  // - foto de estudio: la bandeja blanca con el velo;
  // - sin foto en el POS, agotado, o la foto grande de la ficha: superficie2,
  //   el nivel más bajo. Sin foto no hay blanco de estudio que fundir, y una
  //   bandeja clara vacía (en el comparador, o de 348px en la ficha) volvía a
  //   ser el bloque más brillante de la pantalla sin decir nada;
  // - solo una foto que falló en una lista (Imgur caído) conserva la
  //   bandeja, para no abrir un hueco oscuro entre sus vecinos.
  const fondo = escena
    ? "bg-superficie velo-foto"
    : conFoto
      ? "bandeja-foto velo-foto"
      : !tieneSrc || apagada || leyenda
        ? "bg-superficie2"
        : "bandeja-foto velo-foto";

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
        // Sin texto en las listas: el nombre ya está en la tarjeta. La ficha
        // (`leyenda`) suma "Sin foto", igual que la banda de una ficha sin
        // fotos (ver Galeria).
        <span
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-tenue"
        >
          <IconoCategoria slug={categoria} grosor={1.25} className="h-2/5 w-2/5 max-h-16 max-w-16" />
          {leyenda && (
            <span className="text-label font-semibold uppercase tracking-wide text-texto">
              Sin foto
            </span>
          )}
        </span>
      )}
      {/* El agotado se apaga entero (bandeja y foto) y no solo la foto: con
          la foto al 70% sobre una bandeja clara, los agotados brillaban casi
          como los disponibles. Sin foto no hace falta: superficie2 ya es el
          nivel más bajo, y la capa encima dejaba el ícono debajo de 3:1. Las
          pastillas Agotado/Oferta son hermanas de este componente, así que
          conservan su contraste. */}
      {apagada && conFoto && (
        <span aria-hidden="true" className="absolute inset-0 bg-superficie/30" />
      )}
    </span>
  );
}
