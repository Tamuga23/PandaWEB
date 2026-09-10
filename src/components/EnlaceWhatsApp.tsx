"use client";

import { useEffect, useState, type ReactNode } from "react";
import { agregarRef } from "@/lib/atribucion";
import { CONVERSIONES, conversion } from "@/lib/gtag";

interface Props {
  /** URL ya armada por `linkWhatsApp()` en el servidor. */
  href: string;
  /** Valor estimado de la consulta, en córdobas. Sin definir hasta que Carlos lo confirme. */
  valor?: number;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}

/**
 * Único punto de entrada para los CTA de WhatsApp del sitio: dispara la
 * conversión de Google Ads al hacer clic. Reemplaza los `<a href={linkWhatsApp(...)}>`
 * armados a mano para que ninguno quede sin medir.
 */
export function EnlaceWhatsApp({ href, valor, children, ...rest }: Props) {
  // El gclid vive en el navegador, así que la ref solo se puede agregar
  // después de hidratar. Empezar con `href` evita el mismatch de hidratación.
  const [url, setUrl] = useState(href);
  useEffect(() => {
    // Sincroniza con localStorage (gclid guardado), que no existe en el
    // servidor: no es un valor derivable durante el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(agregarRef(href));
  }, [href]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        conversion(CONVERSIONES.whatsapp, { value: valor, currency: "NIO" })
      }
      {...rest}
    >
      {children}
    </a>
  );
}
