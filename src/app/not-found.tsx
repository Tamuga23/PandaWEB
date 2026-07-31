import Link from "next/link";
import { IconoWhatsApp } from "@/components/iconos";
import { CONTACTO } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-6xl font-black text-borde2">404</p>
      <h1 className="mt-4 text-2xl font-bold">Esta página no existe</h1>
      <p className="mt-2 text-suave">
        Puede que el producto ya no esté publicado o que el enlace esté
        incompleto.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/catalogo"
          className="rounded-full bg-marca px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Ver el catálogo
        </Link>
        <a
          href={linkWhatsApp(CONTACTO.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-borde2 px-5 py-3 text-sm font-semibold text-texto transition hover:border-acento hover:text-acento"
        >
          <IconoWhatsApp className="h-4 w-4" />
          Preguntar por WhatsApp
        </a>
      </div>
    </div>
  );
}
