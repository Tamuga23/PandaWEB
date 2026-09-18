"use client";

import { useEffect } from "react";
import { useComparar } from "./CompararProvider";

const DURACION_MS = 4000;

/**
 * Aviso breve cuando el comparador descarta el producto más viejo al agregar
 * un 4to. Sin esto, el cliente solo se enteraba al abrir el modal y notar que
 * le faltaba su primera selección — una pérdida de datos silenciosa.
 */
export function ToastComparar() {
  const { descartado, descartarAviso } = useComparar();

  useEffect(() => {
    if (!descartado) return;
    const id = setTimeout(descartarAviso, DURACION_MS);
    return () => clearTimeout(id);
  }, [descartado, descartarAviso]);

  if (!descartado) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
    >
      <div className="flex items-center gap-3 rounded-full border border-borde2 bg-superficie px-4 py-2.5 text-sm text-texto shadow-2xl">
        <span>
          Se quitó <span className="font-semibold">{descartado.name}</span> de la
          comparación — máximo 3 a la vez.
        </span>
        <button
          type="button"
          onClick={descartarAviso}
          aria-label="Cerrar aviso"
          className="shrink-0 text-tenue transition hover:text-texto"
        >
          ×
        </button>
      </div>
    </div>
  );
}
