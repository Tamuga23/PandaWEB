"use client";

import type { ReactNode } from "react";
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
  return (
    <a
      href={href}
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
