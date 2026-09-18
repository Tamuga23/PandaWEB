"use client";

import type { Producto } from "@/lib/types";
import { useComparar } from "./CompararProvider";

/**
 * Botón de comparar. Sirve tanto en la tarjeta del catálogo como en la ficha.
 *
 * En la tarjeta va dentro de un <Link>, así que hay que frenar la propagación:
 * sin eso, tocar comparar navegaría al producto.
 */
export function BotonComparar({
  producto,
  tasa,
  variante = "icono",
}: {
  producto: Producto;
  tasa: number;
  variante?: "icono" | "completo";
}) {
  const { alternar, estaSeleccionado } = useComparar();
  const activo = estaSeleccionado(producto.id);

  const alHacerClic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alternar(producto, tasa);
  };

  if (variante === "completo") {
    return (
      <button
        type="button"
        onClick={alHacerClic}
        aria-pressed={activo}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
          activo
            ? "border-acento/40 bg-acento/10 text-acento"
            : "border-borde2 text-texto hover:border-acento hover:text-acento"
        }`}
      >
        <IconoComparar className="h-4 w-4" />
        {activo ? "Quitar de comparación" : "Comparar"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={alHacerClic}
      aria-pressed={activo}
      aria-label={activo ? `Quitar ${producto.name} de comparación` : `Comparar ${producto.name}`}
      title={activo ? "Quitar de comparación" : "Comparar"}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
        activo
          ? "border-acento/40 bg-acento/15 text-acento"
          : "border-borde bg-superficie2 text-tenue hover:border-borde2 hover:text-texto"
      }`}
    >
      <IconoComparar className="h-3.5 w-3.5 shrink-0" />
      {/* Etiqueta visible, no solo aria-label: un ícono de flechas cruzadas no
          se autoexplica en una tienda sin carrito, sin modelo mental previo
          de "comparar". `aria-label` sigue llevando el nombre del producto,
          que este texto corto no necesita repetir. */}
      {activo ? "Quitar" : "Comparar"}
    </button>
  );
}

export function IconoComparar({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 3l4 4-4 4" />
      <path d="M20 7H4" />
      <path d="M8 21l-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}
