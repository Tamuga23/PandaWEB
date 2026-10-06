"use client";

import { useEffect } from "react";
import { IconoCerrar } from "@/components/iconos";
import { useComparar } from "./CompararProvider";

const DURACION_MS = 4000;

/**
 * Aviso breve cuando el comparador descarta el producto más viejo al agregar
 * un 4to. Sin esto, el cliente solo se enteraba al abrir el modal y notar que
 * le faltaba su primera selección — una pérdida de datos silenciosa.
 */
export function ToastComparar() {
  const { descartado, descartarAviso, abierto } = useComparar();

  useEffect(() => {
    if (!descartado) return;
    const id = setTimeout(descartarAviso, DURACION_MS);
    return () => clearTimeout(id);
  }, [descartado, descartarAviso]);

  // Con el modal abierto el aviso sobra (la comparación ya muestra el
  // resultado del descarte) y quedaba encima de las fotos del modal.
  const visible = descartado != null && !abierto;

  // La región viva existe siempre y solo cambia su contenido: si se monta
  // junto con el texto, los lectores de pantalla pueden no anunciarlo.
  return (
    <div
      role="status"
      className="toast-comparar pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3"
    >
      {visible && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-borde2 bg-superficie px-4 py-2.5 text-sm text-texto shadow-flotante">
          <span>
            Se quitó <span className="font-semibold">{descartado.name}</span> de la
            comparación — máximo 3 a la vez.
          </span>
          {/* Mismo patrón de área táctil que el resto del comparador
              (BarraComparar, ModalComparar): el ícono se queda chico, el
              área de toque real crece a 44px con un ::after invisible
              (16px + p-0.5 + -inset-3). */}
          <button
            type="button"
            onClick={descartarAviso}
            aria-label="Cerrar aviso"
            className="relative shrink-0 p-0.5 text-tenue transition after:absolute after:-inset-3 after:content-[''] hover:text-texto"
          >
            <IconoCerrar className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
