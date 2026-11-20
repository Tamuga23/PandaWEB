import type { ReactNode } from "react";

export type Variante = "verde" | "azul";

/**
 * Variante del escenario de un producto. En las piezas de redes los afiches
 * alternan brillo verde y azul para que dos seguidos no se vean iguales; no
 * sale de la categoría ni del color del producto. Acá se elige por el id, así
 * cada producto tiene siempre la misma y el catálogo se reparte entre las dos.
 */
export function varianteDe(id: string): Variante {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) % 2 === 0 ? "verde" : "azul";
}

// El dial de los afiches: un círculo fino con 60 marcas (una más larga cada
// cinco), como un velocímetro, y un tramo encendido en el color de la
// variante. Una sola <path> para las marcas: se pinta una vez.
const R = 48;
const punto = (grados: number, r: number) => {
  const a = (grados * Math.PI) / 180;
  return `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
};
const MARCAS = Array.from({ length: 60 }, (_, i) => {
  const grados = i * 6;
  return `M${punto(grados, i % 5 === 0 ? 43 : 45.5)}L${punto(grados, R)}`;
}).join("");
// En SVG los grados crecen en sentido horario desde las 3: 135° es abajo a la
// izquierda (el tramo corto de los afiches verdes) y 200-270° arriba a la
// izquierda (el arco largo de los azules).
const arco = (desde: number, hasta: number) =>
  `M${punto(desde, R)}A${R} ${R} 0 ${hasta - desde > 180 ? 1 : 0} 1 ${punto(hasta, R)}`;
const ARCOS: Record<Variante, string> = { verde: arco(120, 168), azul: arco(196, 262) };

/**
 * Escenario de producto: el brillo, la trama y el dial de los afiches detrás
 * del producto protagonista. Todo es decorativo (aria-hidden) y no suma
 * imágenes ni precargas. Solo va en la vitrina del hero y en la galería de la
 * ficha (DESIGN.md, "Escenario de producto"); nunca detrás de texto ni en
 * cada tarjeta del catálogo.
 *
 * El dial se sale de la caja a propósito, como en los afiches: un ancestro
 * tiene que recortarlo con overflow-x-clip para que no haya scroll lateral.
 */
export function Escenario({
  variante = "verde",
  dial = true,
  dialAncho = "w-[118%]",
  className = "",
  children,
}: {
  variante?: Variante;
  /** "escritorio": sin dial en el celular, donde el contenido es una tira
      con scroll (la vitrina) y el círculo quedaría cortado a lo ancho. */
  dial?: boolean | "escritorio";
  /** Ancho del dial respecto del contenido. La foto de la ficha usa uno más
      ceñido para que el trazo no llegue a la columna de texto. */
  dialAncho?: "w-[118%]" | "w-[112%]";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`escenario ${variante === "azul" ? "escenario-azul" : ""} ${className}`}>
      {dial && (
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square ${dialAncho} max-w-none -translate-x-1/2 -translate-y-1/2 ${dial === "escritorio" ? "hidden lg:block" : ""}`}
        >
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--dial-marca)" strokeWidth="0.22" />
          <path d={MARCAS} fill="none" stroke="var(--dial-marca)" strokeWidth="0.32" />
          <path
            d={ARCOS[variante]}
            fill="none"
            stroke={variante === "azul" ? "var(--marca-texto-fin)" : "var(--marca-texto-inicio)"}
            strokeWidth="0.55"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </div>
  );
}
