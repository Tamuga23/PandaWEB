"use client";

import type { ReactNode } from "react";
import { conversion } from "@/lib/gtag";

interface Props {
  href: string;
  /** Etiqueta de `CONVERSIONES` a disparar en el clic (`CONVERSIONES.llamada`, `.comoLlegar`). */
  gtag: string | undefined;
  target?: string;
  rel?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}

/**
 * Wrapper genérico para las conversiones secundarias que son un simple link
 * (llamada, cómo llegar). `EnlaceWhatsApp` queda aparte porque además carga
 * el valor de la consulta y, más adelante, la referencia de atribución.
 */
export function EnlaceConversion({ href, gtag, children, ...rest }: Props) {
  return (
    <a href={href} onClick={() => conversion(gtag)} {...rest}>
      {children}
    </a>
  );
}
