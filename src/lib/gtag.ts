declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Etiquetas de conversión de Google Ads. Cada una es el `send_to` completo
 * (`AW-XXXXXXXXX/AbCdEf...`) que da Google Ads al crear la acción.
 * Vacías en desarrollo: `conversion()` simplemente no hace nada.
 */
export const CONVERSIONES = {
  whatsapp: process.env.NEXT_PUBLIC_CONV_WHATSAPP,
  llamada: process.env.NEXT_PUBLIC_CONV_LLAMADA,
  comoLlegar: process.env.NEXT_PUBLIC_CONV_COMO_LLEGAR,
  verFicha: process.env.NEXT_PUBLIC_CONV_VER_FICHA,
} as const;

export function conversion(
  sendTo: string | undefined,
  extra?: { value?: number; currency?: string; transaction_id?: string },
): void {
  if (!sendTo) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: sendTo, ...extra });
}
