import { CONTACTO } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";
import { IconoWhatsApp } from "./iconos";

/**
 * Pantalla de fallo al leer Firestore.
 *
 * El detalle técnico solo se muestra en desarrollo: al cliente no le sirve y
 * revelaría nombres de colecciones y códigos de error.
 */
export function ErrorDatos({ error }: { error: unknown }) {
  const detalle = error instanceof Error ? error.message : String(error);
  const esDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h2 className="text-xl font-semibold text-texto">
        No pudimos cargar el catálogo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-suave">
        Es un problema nuestro, no tuyo. Mientras lo resolvemos, escribinos y te
        atendemos al momento.
      </p>

      <a
        href={linkWhatsApp(CONTACTO.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-marca px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <IconoWhatsApp className="h-4 w-4" />
        Escribir por WhatsApp
      </a>

      {esDev && (
        <pre className="mt-8 overflow-x-auto rounded-xl border border-agotado/30 bg-agotado/5 p-4 text-left text-xs text-agotado">
          {detalle}
        </pre>
      )}
    </div>
  );
}
