import { FINANCIAMIENTO, GARANTIA_MESES } from "@/config/site";
import { IconoCamion, IconoEscudo, IconoTarjeta, IconoWhatsApp } from "./iconos";

/**
 * Los cuatro props de valor del negocio, en un solo lugar para que la home y
 * la ficha de producto nunca digan cosas distintas. `plazoMaximo` viene del
 * financiamiento vigente en Firestore — nunca un número fijo, porque eso fue
 * justo lo que quedó desactualizado la última vez que este texto vivió
 * duplicado en dos archivos.
 */
export function itemsPropuestaValor(plazoMaximo: number) {
  return [
    {
      Icono: IconoTarjeta,
      titulo: `Financiamiento ${FINANCIAMIENTO.banco}`,
      texto: `Llevalo hasta en ${plazoMaximo} cuotas mensuales`,
    },
    {
      Icono: IconoEscudo,
      titulo: `Garantía ${GARANTIA_MESES} meses`,
      texto: "Con factura y respaldo real",
    },
    {
      Icono: IconoCamion,
      titulo: "Entrega inmediata",
      texto: "Delivery en Managua",
    },
    {
      Icono: IconoWhatsApp,
      titulo: "Atención personal",
      texto: "Te asesoramos antes de comprar",
    },
  ];
}

/**
 * Versión chica para la ficha de producto: solo el título, en una grilla
 * 2x2, justo donde se decide escribir por WhatsApp. Nada de subtexto — acá
 * el trabajo es reforzar confianza sin competir con el precio.
 */
export function PropuestaValorCompacta({ plazoMaximo }: { plazoMaximo: number }) {
  const items = itemsPropuestaValor(plazoMaximo);

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
