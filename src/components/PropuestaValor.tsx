import { FINANCIAMIENTO, GARANTIA_MESES } from "@/config/site";
import { IconoCamion, IconoEscudo, IconoTarjeta, IconoWhatsApp } from "./iconos";

/**
 * Los cuatro props de valor del negocio, en un solo lugar para que la home y
 * la ficha de producto nunca digan cosas distintas. `plazoMaximo` viene del
 * financiamiento vigente en Firestore — nunca un número fijo, porque eso fue
 * justo lo que quedó desactualizado la última vez que este texto vivió
 * duplicado en dos archivos.
 *
 * `disponible` (default true, para la home donde no hay un producto puntual)
 * saca los ítems que prometen algo que un producto agotado no puede cumplir
 * ahora mismo — financiamiento (cuotas de algo que no se puede comprar) y
 * entrega inmediata (no hay nada que entregar) — porque ambos contradicen
 * el propio CTA de "Avisarme cuando llegue". Mismo criterio que ya usa
 * `PrecioFicha` para ocultar su panel de cuotas.
 */
export function itemsPropuestaValor(plazoMaximo: number, disponible = true) {
  const items = [
    {
      id: "financiamiento",
      Icono: IconoTarjeta,
      titulo: `Financiamiento ${FINANCIAMIENTO.banco}`,
      texto: `Llevalo hasta en ${plazoMaximo} cuotas mensuales`,
    },
    {
      id: "garantia",
      Icono: IconoEscudo,
      titulo: `Garantía ${GARANTIA_MESES} meses`,
      texto: "Con factura y respaldo real",
    },
    {
      id: "entrega",
      Icono: IconoCamion,
      titulo: "Entrega inmediata",
      texto: "Delivery en Managua",
    },
    {
      id: "atencion",
      Icono: IconoWhatsApp,
      titulo: "Atención personal",
      texto: "Te asesoramos antes de comprar",
    },
  ];
  const idsSoloDisponible = ["financiamiento", "entrega"];
  return disponible
    ? items
    : items.filter((item) => !idsSoloDisponible.includes(item.id));
}

/**
 * Versión chica para la ficha de producto: solo el título, en una grilla
 * 2x2, justo donde se decide escribir por WhatsApp. Nada de subtexto — acá
 * el trabajo es reforzar confianza sin competir con el precio.
 */
export function PropuestaValorCompacta({
  plazoMaximo,
  disponible,
}: {
  plazoMaximo: number;
  disponible: boolean;
}) {
  const items = itemsPropuestaValor(plazoMaximo, disponible);

  return (
    <div className="mt-5 grid grid-cols-2 gap-2">
      {items.map(({ Icono, titulo }) => (
        <div
          key={titulo}
          className="flex items-center gap-2 rounded-xl border border-borde bg-superficie px-3 py-2.5"
        >
          <Icono className="h-4 w-4 shrink-0 text-acento" />
          <span className="text-xs font-medium text-suave">{titulo}</span>
        </div>
      ))}
    </div>
  );
}
