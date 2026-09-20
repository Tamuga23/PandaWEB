"use client";

import type { ReactNode } from "react";
import { useComparar } from "./CompararProvider";

/**
 * Envuelve el header, el contenido de la página y el footer para poder
 * sacarlos del árbol de accesibilidad mientras el modal de comparación
 * está abierto.
 *
 * El trap de foco de ModalComparar solo cubre eventos de teclado (Tab
 * sintético) — un lector de pantalla móvil (VoiceOver, TalkBack) navega
 * por swipe sobre el árbol de accesibilidad, no con Tab. Sin `inert`, el
 * fondo sigue completamente presente y alcanzable aunque el diálogo diga
 * `aria-modal="true"`. `aria-hidden` queda como respaldo para el caso
 * (raro) de que el navegador o la tecnología asistiva no soporten `inert`.
 */
export function FondoDePagina({ children }: { children: ReactNode }) {
  const { abierto } = useComparar();

  return (
    <div className="flex flex-1 flex-col" inert={abierto} aria-hidden={abierto || undefined}>
      {children}
    </div>
  );
}
