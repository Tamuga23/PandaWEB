"use client";

import { useEffect } from "react";
import { CONVERSIONES, conversion } from "@/lib/gtag";

/** Dispara la conversión secundaria "ver ficha" al montar la página de producto. */
export function EventoVerFicha({ sku }: { sku?: string }) {
  useEffect(() => {
    conversion(CONVERSIONES.verFicha, { transaction_id: sku });
  }, [sku]);
  return null;
}
