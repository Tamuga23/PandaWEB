"use client";

import { useTema } from "./TemaProvider";

export function BotonTema() {
  const { tema, alternar, listo } = useTema();

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tema === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={tema === "dark" ? "Tema claro" : "Tema oscuro"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-borde bg-superficie text-suave transition hover:border-borde2 hover:text-texto"
    >
      {/* Hasta hidratar no sabemos el tema real: reservamos el espacio con un
          ícono invisible para que el encabezado no salte. */}
      <span className={listo ? "" : "opacity-0"}>
        {tema === "dark" ? <IconoSol /> : <IconoLuna />}
      </span>
    </button>
  );
}

function IconoSol() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8Z" />
    </svg>
  );
}
