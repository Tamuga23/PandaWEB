import { FINANCIAMIENTO } from "@/config/site";
import { planMasBajo, todosSinInteres } from "@/lib/financiamiento";
import { cordobas } from "@/lib/format";
import type { Producto } from "@/lib/types";

/**
 * Bloque de precio de la ficha de producto.
 *
 * Nunca muestra el precio de efectivo: ese descuento es la carta del asesor
 * para cerrar la venta por WhatsApp, y ni siquiera llega al navegador (se
 * descarta en lib/normalize.ts).
 *
 * Las cuotas vienen YA CALCULADAS en `producto.planes` (ver lib/catalog.ts).
 * Acá no se hace ninguna cuenta: el recargo por categoría, el mínimo y el
 * redondeo ya se resolvieron con el mismo módulo que usa la tablet.
 *
 * El 0% ya no es parejo: el badge se muestra solo en los productos que de verdad
 * no llevan recargo en ningún plazo.
 */
export function PrecioFicha({
  producto,
  tasa,
}: {
  producto: Producto;
  tasa: number;
}) {
  const { lista, actual } = producto.precio;
  const planes = producto.planes;
  const sinInteres = todosSinInteres(planes);
  const { disponible } = producto;

  return (
    <div>
      {/* El badge de "Oferta" vive sobre la imagen de la Galería, no acá —
          es la Regla de DESIGN.md ("siempre sobre imagen, nunca en línea de
          texto"), y ya es donde vive en la tarjeta del catálogo. */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`font-bold tracking-tight ${
            disponible ? "text-4xl text-precio" : "text-2xl text-tenue"
          }`}
        >
          {cordobas(actual, tasa)}
        </span>
        {lista != null && (
          <span className="text-lg text-tenue line-through">
            <span className="sr-only">Antes: </span>
            {cordobas(lista, tasa)}
          </span>
        )}
      </div>

      {/* Las cuotas no aplican a algo que no se puede comprar ahora mismo:
          mostrar un pago mensual concreto sería anunciar una compra que no
          existe. Vuelven a aparecer solo cuando el producto vuelve a tener
          stock. */}
      {disponible && planes.length > 0 && (
        <div className="mt-5 rounded-2xl border border-precio/20 bg-precio/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-precio">
              Pagalo en cuotas con {FINANCIAMIENTO.banco}
            </p>
            {sinInteres && (
              <span className="rounded-full bg-precio/15 px-2 py-0.5 text-micro font-black uppercase tracking-wider text-precio">
                0% interés
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {planes.map((p) => (
              <div
                key={p.meses}
                className="rounded-xl border border-borde bg-superficie px-3 py-3 text-center"
              >
                <p className="text-xs font-medium text-suave">{p.meses} cuotas de</p>
                <p className="mt-0.5 text-xl font-bold text-texto">
                  C${p.cuotaNio.toLocaleString("es-NI")}
                </p>
                <p className="text-xs text-tenue">al mes</p>
                {/* El recargo ya está calculado (financiamiento.ts): mostrarlo
                    es la diferencia entre que el cliente lo descubra acá o se
                    lo tenga que explicar el asesor por WhatsApp. */}
                {p.recargoPct > 0 && (
                  <p className="mt-1 text-xs text-tenue">
                    Total C${p.totalNio.toLocaleString("es-NI")} · +C$
                    {p.sobrePrecioNio.toLocaleString("es-NI")} vs. contado
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-tenue">
            Sin prima. Pagalo en cuotas con tu tarjeta de crédito{" "}
            {FINANCIAMIENTO.banco}, directo en la tienda.
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
  const { disponible } = producto;
  // Mismo criterio que PrecioFicha: un agotado no anuncia una cuota mensual
  // de una compra que hoy no se puede hacer.
  const cuota = disponible ? planMasBajo(producto.planes) : null;
  const sinInteres = todosSinInteres(producto.planes);

  return (
    // En móvil la tarjeta mide ~124px por dentro: la cuota con el sello 0%
    // ocupa dos renglones y sin él uno. El alto mínimo reserva siempre los
    // dos, así los precios de una misma fila quedan a la misma altura. Vale
    // también para los agotados (no muestran cuota): en "También te puede
    // servir" comparten fila con los disponibles.
    <div className="max-sm:min-h-[3.875rem]">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className={`text-lg font-bold ${disponible ? "text-precio" : "text-tenue"}`}>
          {cordobas(actual, tasa)}
        </span>
        {lista != null && (
          <span className="text-xs text-tenue line-through">
            <span className="sr-only">Antes: </span>
            {cordobas(lista, tasa)}
          </span>
        )}
      </div>
      {cuota && (
        <p className="mt-0.5 text-xs text-suave">
          desde{" "}
          <span className="font-semibold text-texto">
            C${cuota.cuotaNio.toLocaleString("es-NI")}
          </span>{" "}
          / mes
          {/* Sello, no texto suelto: cuando no entra en el renglón baja
              entero como píldora en vez de quedar "· 0%" colgando solo. */}
          {sinInteres && (
            <>
              {" "}
              <span className="whitespace-nowrap rounded-full bg-precio/15 px-1.5 py-0.5 text-micro font-black uppercase tracking-wider text-precio">
                0%<span className="sr-only"> de interés</span>
              </span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
