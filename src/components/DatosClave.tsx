import type { FilaSpec } from "@/lib/categorySpecs";
import type { Variante } from "./Escenario";

/** Cuántas filas de la ficha técnica suben a la grilla del afiche. */
export const MAX_DATOS_CLAVE = 4;

/**
 * Datos clave de la ficha: la grilla 2x2 de los afiches de redes ("4K
 * adelante · 1080p atrás", "Wi-Fi 6 hasta 25 MB/s"). Toma las primeras filas
 * de filasDeSpecs, que ya vienen ordenadas por lo que más vende en cada
 * categoría, así que no inventa ni elige datos: solo los presenta.
 *
 * Es un <dl>: la etiqueta (dt) va antes en el DOM y se muestra debajo de la
 * cifra con flex-col-reverse, como la bajada gris de los afiches.
 */
export function DatosClave({ filas, variante }: { filas: FilaSpec[]; variante: Variante }) {
  if (filas.length < 2) return null;
  const tono = variante === "azul" ? "text-[var(--marca-texto-fin)]" : "text-[var(--marca-texto-inicio)]";

  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5">
      {filas.map((f) => {
        const Icono = ICONO_DE[f.key] ?? IconoDato;
        const valor = f.key === "throwRatio" ? relacionProyeccion(f.valor) : f.valor;
        const cifra = partirCifra(valor);
        return (
          <div key={f.key} className="flex gap-3">
            <Icono className={`mt-1 h-6 w-6 shrink-0 ${tono}`} />
            {/* justify-end en column-reverse empuja todo hacia arriba: la
                cifra queda alineada con el ícono aunque la celda vecina sea
                más alta. */}
            <div className="flex min-w-0 flex-col-reverse justify-end">
              <dt className="mt-0.5 text-sm text-suave">{f.label}</dt>
              <dd className="font-bold leading-tight tracking-tight text-texto">
                {cifra ? (
                  <>
                    <span className="text-2xl">{cifra.numero}</span>
                    {cifra.unidad && (
                      <>
                        {" "}
                        <span className="text-base">{cifra.unidad}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-lg">{valor}</span>
                )}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}

/**
 * "1100 lúmenes ANSI" → 1100 grande + "lúmenes ANSI" chico, como en los
 * afiches. La cifra puede llevar hasta dos letras pegadas ("1080p Full HD",
 * "4K adelante") o ser una relación ("1.2:1"), y la unidad es opcional: un
 * "1080P" a secas también va grande, no en la letra de los textos. Los
 * valores del POS son texto libre: si no empieza con una cifra corta, se
 * muestra tal cual (nunca se parte a medias).
 */
function partirCifra(valor: string): { numero: string; unidad: string } | null {
  const m = valor.trim().match(/^(\d[\d.,]{0,6}(?::\d+)?[a-zA-Z"”″']{0,2})(?:\s+(.{1,24}))?$/);
  return m ? { numero: m[1], unidad: m[2] ?? "" } : null;
}

/**
 * La relación de proyección se escribe "1.2:1" (el placeholder del POS), pero
 * a veces llega solo el número: "1" a secas no dice nada en el afiche.
 */
function relacionProyeccion(valor: string): string {
  return /^\d+([.,]\d+)?$/.test(valor.trim()) ? `${valor.trim()}:1` : valor;
}

// ---------------------------------------------------------------------------
// Íconos de línea, mismo trazo que iconos.tsx (24px, stroke 2, puntas
// redondeadas). Uno por familia de dato; lo que no tiene uno propio usa el
// punto genérico.
// ---------------------------------------------------------------------------

type PropsIcono = { className?: string };

function Svg({ className, children }: PropsIcono & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const IconoBrillo = (p: PropsIcono) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
const IconoPantalla = (p: PropsIcono) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="m10 8.5 4 2-4 2z" />
    <path d="M8 21h8" />
  </Svg>
);
const IconoFoco = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
// El haz del proyector abriéndose hacia la pantalla: la relación de
// proyección es cuánta imagen da por metro de distancia.
const IconoProyeccion = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M3 9h4v6H3z" />
    <path d="M7 10l13-5v14L7 14" />
  </Svg>
);
const IconoChip = (p: PropsIcono) => (
  <Svg {...p}>
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </Svg>
);
const IconoWifi = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M2 8.8a15 15 0 0 1 20 0M5 12.6a10 10 0 0 1 14 0M8.5 16.3a5 5 0 0 1 7 0" />
    <path d="M12 20h.01" />
  </Svg>
);
const IconoBateria = (p: PropsIcono) => (
  <Svg {...p}>
    <rect x="2" y="7" width="17" height="10" rx="2" />
    <path d="M22 11v2M6 10.5v3M9.5 10.5v3" />
  </Svg>
);
const IconoGota = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M12 2.7S6 9.3 6 13.5a6 6 0 0 0 12 0C18 9.3 12 2.7 12 2.7z" />
  </Svg>
);
const IconoSonido = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M11 5 6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
  </Svg>
);
const IconoPin = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);
const IconoTelefono = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Svg>
);
const IconoCamara = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="m16 13 5.2 3.1a.5.5 0 0 0 .8-.4V8.3a.5.5 0 0 0-.8-.4L16 11" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
  </Svg>
);
const IconoActividad = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);
const IconoEscudo = (p: PropsIcono) => (
  <Svg {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);
const IconoDato = (p: PropsIcono) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </Svg>
);

/** Clave de categorySpecs → ícono. Las que faltan usan IconoDato. */
const ICONO_DE: Record<string, (p: PropsIcono) => React.ReactElement> = {
  ansi: IconoBrillo,
  luces: IconoBrillo,
  contraste: IconoBrillo,
  resolucion: IconoPantalla,
  pantalla: IconoPantalla,
  tamanoPantalla: IconoPantalla,
  tipoPantalla: IconoPantalla,
  tamano: IconoPantalla,
  autofoco: IconoFoco,
  distMinEnfoque: IconoFoco,
  throwRatio: IconoProyeccion,
  campoVision: IconoFoco,
  sistema: IconoChip,
  memoria: IconoChip,
  almacenamiento: IconoChip,
  app: IconoChip,
  controlApp: IconoChip,
  asistentes: IconoChip,
  rutinas: IconoChip,
  compatibilidad: IconoChip,
  conectividad: IconoWifi,
  emparejamiento: IconoWifi,
  duracionBateria: IconoBateria,
  carga: IconoBateria,
  alimentacion: IconoBateria,
  resistenciaAgua: IconoGota,
  audio: IconoSonido,
  audioDoble: IconoSonido,
  potencia: IconoSonido,
  microfono: IconoSonido,
  sirena: IconoSonido,
  gps: IconoPin,
  llamadas: IconoTelefono,
  manosLibres: IconoTelefono,
  camaras: IconoCamara,
  visionNocturna: IconoCamara,
  deteccionMovimiento: IconoCamara,
  modoEstacionamiento: IconoCamara,
  salud: IconoActividad,
  deportes: IconoActividad,
  garantiaMeses: IconoEscudo,
};
