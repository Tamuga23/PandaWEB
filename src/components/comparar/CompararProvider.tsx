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

  const alternar = useCallback((producto: Producto, tasaActual: number) => {
    setTasa(tasaActual);
    setSeleccion((previa) => {
      if (previa.some((p) => p.id === producto.id)) {
        return previa.filter((p) => p.id !== producto.id);
      }
      // Al llegar al tope, entra el nuevo y sale el más viejo. Bloquear la
      // selección obligaría al cliente a deseleccionar antes de seguir.
      if (previa.length >= MAX_COMPARAR) {
        return [...previa.slice(1), producto];
      }
      return [...previa, producto];
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
    }),
    [seleccion, tasa, alternar, quitar, limpiar, abierto],
  );

  return <CompararCtx.Provider value={valor}>{children}</CompararCtx.Provider>;
}
