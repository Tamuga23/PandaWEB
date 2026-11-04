"use client";

import { useEffect } from "react";
import { EnlaceWhatsApp } from "@/components/EnlaceWhatsApp";
import { IconoWhatsApp } from "@/components/iconos";
import { CONTACTO } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";

/**
 * Pantalla para un error inesperado al mostrar una página (un bug, no una
 * caída de Firestore: esa la atrapa cada página con ErrorDatos). Sin esto,
 * el cliente veía la pantalla genérica de Next, en inglés y sin salida.
 * El header y el footer siguen: solo se reemplaza el contenido.
 *
 * El código (`digest`) es el mismo que aparece en los logs de Vercel: si el
 * cliente lo manda por WhatsApp, se encuentra el error exacto. No revela
 * nada: Next nunca manda el mensaje real del servidor al navegador.
 */
export default function ErrorPagina({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-texto">Algo salió mal</h1>
      <p className="mt-2 text-sm leading-relaxed text-suave">
        Es un problema nuestro, no tuyo. Probá de nuevo o escribinos y te
        atendemos al momento.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-full border border-borde2 px-5 py-3 text-sm font-semibold text-texto transition hover:border-acento hover:text-acento"
        >
          Probar de nuevo
        </button>
        <EnlaceWhatsApp
          href={linkWhatsApp(CONTACTO.whatsapp)}
          className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
        >
          <IconoWhatsApp className="h-4 w-4" />
          Escribir por WhatsApp
        </EnlaceWhatsApp>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-tenue">Código del error: {error.digest}</p>
      )}
    </div>
  );
}
