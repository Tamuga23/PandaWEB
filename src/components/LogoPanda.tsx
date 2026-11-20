import Image from "next/image";

/**
 * El panda de la marca, sin baldosa.
 *
 * El dibujo original es blanco sobre negro, y lo negro del panda (orejas,
 * ojos, boca, brazo) es el mismo negro del fondo. Por eso va en dos capas del
 * mismo lienzo (297×256, de public/marca/):
 * - panda.png: solo lo blanco y sus grises. En oscuro va solo y lo negro lo
 *   pone la página, igual que en los afiches.
 * - panda-tinta.png: máscara de lo negro del panda más un contorno fino. En
 *   claro se pinta debajo con el color de texto (`.logo-panda` en
 *   globals.css); sin ella, el blanco se perdía contra el fondo claro.
 *
 * El tamaño lo da la altura en `className` (h-9, h-12…); el ancho sale de la
 * proporción. `sizes` es ese ancho en px: alto × 297 / 256.
 */
export function LogoPanda({
  className = "",
  sizes,
  carga = "eager",
}: {
  className?: string;
  sizes: string;
  /** "eager" arriba (header); "lazy" debajo del pliegue (footer). */
  carga?: "eager" | "lazy";
}) {
  return (
    <span
      aria-hidden="true"
      className={`logo-panda relative inline-block aspect-[297/256] shrink-0 ${className}`}
    >
      <Image
        src="/marca/panda.png"
        alt=""
        fill
        sizes={sizes}
        loading={carga}
        // eager + low (ver ProductImage): se pide al leer el HTML sin que
        // React lo precargue; la única precarga de la página es la del LCP.
        fetchPriority={carga === "eager" ? "low" : undefined}
      />
    </span>
  );
}
