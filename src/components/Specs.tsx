import type { Specs } from "@/lib/types";
import {
  SPECS_POR_CATEGORIA,
  etiquetaDeSpec,
  filasDeSpecs,
  formatearSpec,
} from "@/lib/categorySpecs";
import { IconoChevron } from "./iconos";

/**
 * Filas visibles de entrada, antes de tener que abrir "ver todas". Las
 * categorías densas (proyector, smartwatch) pasan de 10 filas incluso
 * después de sacar las que ya están en el resumen de beneficio — una tabla
 * plana así es el tipo de carga cognitiva que un colapso resuelve gratis.
 */
export const UMBRAL_COLAPSO_SPECS = 6;

/** Pura, para poder probar el punto de corte sin renderizar. */
export function dividirFilasSpecs<T>(
  filas: T[],
  umbral: number = UMBRAL_COLAPSO_SPECS,
): { visibles: T[]; resto: T[] } {
  return { visibles: filas.slice(0, umbral), resto: filas.slice(umbral) };
}

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
  omitirClaves,
}: {
  specs: Specs;
  /** Ordena y etiqueta según la ficha de la categoría. Opcional. */
  categorySlug?: string;
  /** Claves a no repetir — ya se mostraron en el resumen de beneficio, arriba. */
  omitirClaves?: string[];
}) {
  const filas = filasDeSpecs(categorySlug, specs).filter(
    (f) => !omitirClaves?.includes(f.key),
  );
  if (filas.length === 0) return null;

  const { visibles, resto } = dividirFilasSpecs(filas);

  return (
    <div className="overflow-hidden rounded-2xl border border-borde">
      <dl className="divide-y divide-borde">
        {visibles.map((f) => (
          <FilaSpec key={f.key} label={f.label} valor={f.valor} />
        ))}
      </dl>

      {resto.length > 0 && (
        <details className="group border-t border-borde">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-acento transition hover:bg-superficie2">
            Ver las {filas.length} especificaciones completas
            <IconoChevron className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <dl className="divide-y divide-borde border-t border-borde">
            {resto.map((f) => (
              <FilaSpec key={f.key} label={f.label} valor={f.valor} />
            ))}
          </dl>
        </details>
      )}
    </div>
  );
}

function FilaSpec({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
      <dt className="text-suave">{label}</dt>
      <dd className="font-medium text-texto">{valor}</dd>
    </div>
  );
}
