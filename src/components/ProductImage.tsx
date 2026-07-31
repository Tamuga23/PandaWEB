"use client";

import Image from "next/image";
import { useState } from "react";
import { IconoImagen } from "./iconos";

interface Props {
  src?: string;
  alt: string;
  /** `true` para la foto principal de la ficha: carga con prioridad. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Imagen de producto tolerante a fallos.
 *
 * Hoy las fotos están alojadas en Imgur, que bloquea el hotlinking de forma
 * intermitente y borra subidas anónimas viejas. En vez de mostrar un ícono roto,
 * caemos en un marcador de posición discreto.
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
}: Props) {
  const [fallo, setFallo] = useState(false);

  if (!src || fallo) return <Placeholder className={className} />;

  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setFallo(true)}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFallo(true)}
      className={`object-contain ${className}`}
    />
  );
}

function Placeholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-superficie2 text-tenue ${className}`}
      aria-hidden="true"
    >
      <IconoImagen className="h-8 w-8" />
      <span className="text-[10px] font-medium uppercase tracking-wide">Sin foto</span>
    </div>
  );
}
