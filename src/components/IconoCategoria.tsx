// Íconos de categoría para "Qué estás buscando". Mismo estilo que iconos.tsx
// (grilla de 24, trazo redondeado), pero pintados con un tramo del degradado
// de marca en vez de currentColor: cada tarjeta toma el tramo que le toca
// según su posición, y la grilla completa recorre esmeralda → cian → azul.

/**
 * Un punto del degradado de marca, de 0 (esmeralda) a 1 (azul cielo), como
 * color CSS. Se arma con color-mix sobre los tokens de globals.css
 * (--marca-inicio/medio/fin) para no duplicar los valores acá.
 */
export function colorDeMarca(t: number): string {
  const x = Math.min(1, Math.max(0, t));
  if (x <= 0.5) {
    const p = Math.round((x / 0.5) * 100);
    return `color-mix(in srgb, var(--marca-medio) ${p}%, var(--marca-inicio))`;
  }
  const p = Math.round(((x - 0.5) / 0.5) * 100);
  return `color-mix(in srgb, var(--marca-fin) ${p}%, var(--marca-medio))`;
}

const TRAZOS: Record<string, React.ReactNode> = {
  proyector: (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M6 10.5h3M6 13.5h3M6 17v1.5M18 17v1.5" />
    </>
  ),
  camara: (
    <>
      <rect x="3" y="6" width="13" height="7" rx="2" />
      <path d="M16 7.5 20.5 6v7L16 11.5" />
      <path d="M8.5 13v3.5H4M4 14.5V20" />
      <circle cx="6.5" cy="9.5" r="0.6" />
    </>
  ),
  dashcam: (
    <>
      <path d="M10 8V5.5h4V8" />
      <rect x="3" y="8" width="18" height="10" rx="2.5" />
      <circle cx="15" cy="13" r="2.75" />
      <path d="M6.5 11.5h3" />
      <circle cx="7" cy="15" r="0.6" />
    </>
  ),
  smartwatch: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="m9 6 .6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3" />
      <path d="M12 9.5V12l1.5 1.5M20 10.5v3" />
    </>
  ),
  parlante: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <circle cx="12" cy="14.5" r="3.5" />
      <circle cx="12" cy="7" r="1.25" />
    </>
  ),
  smarthome: (
    <>
      <path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5" />
      <path d="M8.5 13.2a5 5 0 0 1 7 0M10.3 15.3a2.4 2.4 0 0 1 3.4 0" />
      <circle cx="12" cy="17.6" r="0.6" />
    </>
  ),
  smarttv: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M10.5 8.5v5l4-2.5Z" />
    </>
  ),
};

// Para un slug que todavía no tenga dibujo: una caja genérica, nunca un hueco.
const TRAZO_GENERICO = (
  <>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M4 10h16" />
  </>
);

export function IconoCategoria({
  slug,
  desde,
  hasta,
  grosor = 1.75,
  className = "h-6 w-6",
}: {
  slug?: string;
  /**
   * Colores CSS de los extremos del tramo (ver colorDeMarca). Sin ellos el
   * ícono es monocromo (currentColor): es la variante del marcador "sin
   * foto", que no es accionable y por eso no lleva el degradado de marca.
   */
  desde?: string;
  hasta?: string;
  grosor?: number;
  className?: string;
}) {
  const conDegradado = desde != null && hasta != null;
  const id = `degradado-categoria-${slug ?? "generico"}`;
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* Solo con degradado hay <defs>: el monocromo se repite en la grilla
          (doce agotados sin foto) y no puede dejar ids duplicados. */}
      {conDegradado && (
        <defs>
          {/* userSpaceOnUse: con el modo por defecto (objectBoundingBox), un
              trazo recto horizontal o vertical tiene caja de alto o ancho 0 y
              el degradado no se pinta. El stopColor del atributo es el
              respaldo si el navegador no entiende color-mix: cian de marca,
              en vez del negro por defecto (invisible sobre el tema oscuro). */}
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22">
            <stop offset="0" stopColor="#06b6d4" style={{ stopColor: desde }} />
            <stop offset="1" stopColor="#06b6d4" style={{ stopColor: hasta }} />
          </linearGradient>
        </defs>
      )}
      <g
        stroke={conDegradado ? `url(#${id})` : "currentColor"}
        fill="none"
        strokeWidth={grosor}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {(slug ? TRAZOS[slug] : undefined) ?? TRAZO_GENERICO}
      </g>
    </svg>
  );
}
