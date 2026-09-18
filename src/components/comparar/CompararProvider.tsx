"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Producto } from "@/lib/types";

/** Tres caben en pantalla de escritorio sin que la tabla se vuelva ilegible. */
export const MAX_COMPARAR = 3;

interface Ctx {
  seleccion: Producto[];
  tasa: number;
  alternar: (producto: Producto, tasa: number) => void;
  quitar: (id: string) => void;
  limpiar: () => void;
  estaSeleccionado: (id: string) => boolean;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  /** Último producto que salió de la comparación al agregar un 4to. Se limpia solo. */
  descartado: Producto | null;
  descartarAviso: () => void;
}

/**
 * Pura, para poder probarla sin montar el provider: decide la próxima
 * selección al tocar un producto, y qué queda descartado si corresponde.
 */
export function proximaSeleccion(
  previa: Producto[],
  producto: Producto,
  max: number = MAX_COMPARAR,
): { seleccion: Producto[]; descartado: Producto | null } {
  if (previa.some((p) => p.id === producto.id)) {
    return { seleccion: previa.filter((p) => p.id !== producto.id), descartado: null };
  }
  // Al llegar al tope, entra el nuevo y sale el más viejo. Bloquear la
  // selección obligaría al cliente a deseleccionar antes de seguir.
  if (previa.length >= max) {
    return { seleccion: [...previa.slice(1), producto], descartado: previa[0] };
  }
  return { seleccion: [...previa, producto], descartado: null };
}

const CompararCtx = createContext<Ctx | null>(null);

export function useComparar(): Ctx {
  const ctx = useContext(CompararCtx);
  if (!ctx) {
    throw new Error("useComparar necesita estar dentro de <CompararProvider>");
  }
  return ctx;
}

/**
 * Selección de productos para comparar.
 *
 * Vive en memoria a propósito: comparar es una decisión del momento, no algo
 * que tenga sentido recordar entre visitas. Se pierde al recargar y está bien.
 */
export function CompararProvider({ children }: { children: React.ReactNode }) {
  const [seleccion, setSeleccion] = useState<Producto[]>([]);
  const [tasa, setTasa] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [descartado, setDescartado] = useState<Producto | null>(null);

  const alternar = useCallback((producto: Producto, tasaActual: number) => {
    setTasa(tasaActual);
    setSeleccion((previa) => {
      const { seleccion: siguiente, descartado: salio } = proximaSeleccion(previa, producto);
      // El aviso es lo que evita que el descarte sea una pérdida de datos
      // silenciosa — sin esto, el cliente solo se enteraba al abrir el modal.
      if (salio) setDescartado(salio);
      return siguiente;
    });
  }, []);

  const quitar = useCallback((id: string) => {
    setSeleccion((previa) => {
      const restante = previa.filter((p) => p.id !== id);
      if (restante.length < 2) setAbierto(false);
      return restante;
    });
  }, []);

  const limpiar = useCallback(() => {
    setSeleccion([]);
    setAbierto(false);
  }, []);

  const descartarAviso = useCallback(() => setDescartado(null), []);

  const valor = useMemo<Ctx>(
    () => ({
      seleccion,
      tasa,
      alternar,
      quitar,
      limpiar,
      estaSeleccionado: (id) => seleccion.some((p) => p.id === id),
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
      descartado,
      descartarAviso,
    }),
    [seleccion, tasa, alternar, quitar, limpiar, abierto, descartado, descartarAviso],
  );

  return <CompararCtx.Provider value={valor}>{children}</CompararCtx.Provider>;
}
