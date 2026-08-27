import type { Specs } from "@/lib/types";
import {
  SPECS_POR_CATEGORIA,
  etiquetaDeSpec,
  filasDeSpecs,
  formatearSpec,
} from "@/lib/categorySpecs";

// Las etiquetas, el orden y el formato de cada spec salen de `lib/categorySpecs.ts`,
// el MISMO archivo que usa el POS para editarlas y PandaLink para mostrarlas. Así
// una spec nueva aparece en los tres lados con el mismo texto sin tocar tres
// archivos distintos. Lo que no esté definido se muestra igual, con el nombre del
// campo formateado: un campo nuevo del POS nunca desaparece sin aviso.

/**
 * Orden de presentación para el comparador, que mezcla productos de distintas
 * categorías: la unión de todas las fichas, en el orden en que están definidas.
 */
export const ORDEN_SPECS: string[] = (() => {
  const vistos = new Set<string>();
  const orden: string[] = [];
  for (const campos of Object.values(SPECS_POR_CATEGORIA)) {
    for (const c of campos) {
      if (!vistos.has(c.key)) {
        vistos.add(c.key);
        orden.push(c.key);
      }
    }
  }
  return orden;
})();

/** Valor formateado sin conocer la categoría (comparador). */
export function formatearValorSpec(clave: string, valor: unknown): string {
  return formatearSpec(undefined, clave, valor);
}

/** Etiqueta legible sin conocer la categoría (comparador). */
export function etiquetaSpec(clave: string): string {
  return etiquetaDeSpec(undefined, clave);
}

export function TablaSpecs({
  specs,
  categorySlug,
}: {
  specs: Specs;
  /** Ordena y etiqueta según la ficha de la categoría. Opcional. */
  categorySlug?: string;
}) {
  const filas = filasDeSpecs(categorySlug, specs);
  if (filas.length === 0) return null;

  return (
    <dl className="divide-y divide-borde overflow-hidden rounded-2xl border border-borde">
      {filas.map((f) => (
        <div key={f.key} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
          <dt className="text-suave">{f.label}</dt>
          <dd className="font-medium text-texto">{f.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
