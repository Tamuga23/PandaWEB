"use client";

import { useEffect } from "react";
import { capturarClick } from "@/lib/atribucion";

/** Guarda el gclid/gbraid/wbraid de la URL de entrada, si viene de un anuncio. */
export function CapturaAtribucion() {
  useEffect(() => {
    capturarClick();
  }, []);
  return null;
}
