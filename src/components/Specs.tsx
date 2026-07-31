import type { Specs } from "@/lib/types";

// Etiquetas legibles y orden de presentación. Lo que no esté acá se muestra al
// final con el nombre del campo formateado, así un campo nuevo en el POS
// aparece igual en vez de desaparecer sin aviso.
const ETIQUETAS: Record<string, string> = {
  ansi: "Brillo",
  lumens: "Brillo",
  resolucion: "Resolución",
  contraste: "Contraste",
  throwRatio: "Relación de proyección",
  distMinEnfoque: "Distancia mínima de enfoque",
  autofoco: "Autofoco",
  conectividad: "Conectividad",
  garantiaMeses: "Garantía",
  extra: "Otros detalles",
};

const ORDEN = [
  "ansi",
  "lumens",
  "resolucion",
  "contraste",
  "throwRatio",
  "distMinEnfoque",
  "autofoco",
  "conectividad",
  "garantiaMeses",
  "extra",
];

/** Orden de presentación de las especificaciones, para el comparador. */
export const ORDEN_SPECS = ORDEN;

export function formatearValorSpec(clave: string, valor: unknown): string {
  return formatearValor(clave, valor);
}

export function etiquetaSpec(clave: string): string {
  return formatearClave(clave);
}

function formatearValor(clave: string, valor: unknown): string {
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  if (Array.isArray(valor)) return valor.join(", ");
  if (clave === "ansi" || clave === "lumens") return `${valor} lúmenes ANSI`;
  if (clave === "garantiaMeses") return `${valor} meses`;
  if (clave === "distMinEnfoque" && typeof valor === "number") return `${valor} m`;
  return String(valor);
}

function formatearClave(clave: string): string {
  if (ETIQUETAS[clave]) return ETIQUETAS[clave];
  // camelCase → "Camel case"
  const conEspacios = clave.replace(/([A-Z])/g, " $1").toLowerCase();
  return conEspacios.charAt(0).toUpperCase() + conEspacios.slice(1);
}

export function TablaSpecs({ specs }: { specs: Specs }) {
  const claves = Object.keys(specs).sort((a, b) => {
    const ia = ORDEN.indexOf(a);
    const ib = ORDEN.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  // `ansi` y `lumens` son el mismo dato con dos nombres en el POS.
  const vistas = new Set<string>();

  return (
    <dl className="divide-y divide-borde overflow-hidden rounded-2xl border border-borde">
      {claves.map((k) => {
        const etiqueta = formatearClave(k);
        if (vistas.has(etiqueta)) return null;
        vistas.add(etiqueta);

        return (
          <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
            <dt className="text-suave">{etiqueta}</dt>
            <dd className="font-medium text-texto">
              {formatearValor(k, specs[k])}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
