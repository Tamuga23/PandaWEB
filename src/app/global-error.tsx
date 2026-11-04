"use client";

import { Inter } from "next/font/google";
import { useEffect } from "react";
import { CONTACTO, SITE } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Último recurso: falló el propio layout raíz, así que esta pantalla lo
 * reemplaza entera (header, footer, tema y Google Ads incluidos). Por eso
 * trae su propio <html>, la fuente y los estilos, va siempre en oscuro (el
 * tema por defecto) y usa un enlace simple a WhatsApp: el que mide la
 * conversión depende de Google Ads, que se carga en el layout que falló.
 */
export default function ErrorGlobal({
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
    <html lang="es-NI" className={`dark ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col items-center justify-center bg-fondo px-4 text-center font-sans text-texto">
        <title>{`Algo salió mal | ${SITE.nombre}`}</title>
        <p className="text-lg font-bold tracking-tight">
          panda<span className="text-marca">store</span>
        </p>
        <h1 className="mt-8 text-xl font-semibold">Algo salió mal</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-suave">
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
          <a
            href={linkWhatsApp(CONTACTO.whatsapp)}
            className="btn-primary inline-flex items-center px-5 py-3 text-sm"
          >
            Escribir por WhatsApp
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-tenue">Código del error: {error.digest}</p>
        )}
      </body>
    </html>
  );
}
