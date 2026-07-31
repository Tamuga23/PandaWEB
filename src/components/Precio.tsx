import { FINANCIAMIENTO } from "@/config/site";
import { calcularCuotas, cordobas, cuotaMinima, porcentajeDescuento } from "@/lib/format";
import type { Producto } from "@/lib/types";

/**
 * Bloque de precio de la ficha de producto.
 *
 * Nunca muestra el precio de efectivo: ese descuento es la carta del asesor
 * para cerrar la venta por WhatsApp, y ni siquiera llega al navegador (se
 * descarta en lib/normalize.ts).
 */
export function PrecioFicha({
  producto,
  tasa,
}: {
  producto: Producto;
  tasa: number;
}) {
  const { lista, actual } = producto.precio;
  const desc = porcentajeDescuento(lista, actual);
  const cuotas = calcularCuotas(actual, tasa);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-4xl font-bold tracking-tight text-precio">
          {cordobas(actual, tasa)}
        </span>
        {lista != null && (
          <span className="text-lg text-tenue line-through">
            {cordobas(lista, tasa)}
          </span>
        )}
        {desc != null && (
          <span className="rounded-lg bg-marca px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">
            −{desc}% Oferta
          </span>
        )}
      </div>

      {cuotas.length > 0 && (
        <div className="mt-5 rounded-2xl border border-precio/20 bg-precio/5 p-4">
          <p className="text-sm font-semibold text-precio">
            Financiamiento {FINANCIAMIENTO.banco} · 0% interés
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {cuotas.map((c) => (
              <div
                key={c.meses}
                className="rounded-xl border border-borde bg-superficie px-3 py-3 text-center"
              >
                <p className="text-xs font-medium text-suave">{c.meses} cuotas de</p>
                <p className="mt-0.5 text-xl font-bold text-texto">
                  C${c.montoNio.toLocaleString("es-NI")}
                </p>
                <p className="text-xs text-tenue">al mes</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-tenue">
            Sin prima. Sujeto a aprobación de {FINANCIAMIENTO.banco}.
          </p>
        </div>
      )}
    </div>
  );
}

/** Versión compacta para la tarjeta del catálogo. */
export function PrecioTarjeta({
  producto,
  tasa,
}: {
  producto: Producto;
  tasa: number;
}) {
  const { lista, actual } = producto.precio;
  const cuota = cuotaMinima(actual, tasa);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-lg font-bold text-precio">{cordobas(actual, tasa)}</span>
        {lista != null && (
          <span className="text-xs text-tenue line-through">
            {cordobas(lista, tasa)}
          </span>
        )}
      </div>
      {cuota && (
        <p className="mt-0.5 text-xs text-suave">
          desde{" "}
          <span className="font-semibold text-texto">
            C${cuota.montoNio.toLocaleString("es-NI")}
          </span>{" "}
          / mes · 0%
        </p>
      )}
    </div>
  );
}
