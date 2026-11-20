import Image from "next/image";
import Link from "next/link";
import { CATEGORIAS, CONTACTO, GARANTIA_MESES, HORARIO, REDES, SITE } from "@/config/site";
import { lineaHorario, linkWhatsApp } from "@/lib/format";
import { EnlaceConversion } from "./EnlaceConversion";
import { EnlaceWhatsApp } from "./EnlaceWhatsApp";
import { CONVERSIONES } from "@/lib/gtag";
import { ICONOS_RED, IconoReloj, IconoUbicacion, IconoWhatsApp } from "./iconos";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-borde bg-fondo">
      {/* La firma de cierre de todos los afiches: logo y lugar a la
          izquierda, el WhatsApp con el número grande a la derecha. El número
          va dentro de EnlaceWhatsApp, así que la conversión se mide igual. */}
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-col gap-5 rounded-3xl border border-borde bg-superficie p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-borde2 bg-fondo">
              <Image src="/logo.png" alt="" width={40} height={38} className="h-9 w-auto" />
            </span>
            <div>
              <p className="text-xl font-bold tracking-tight">
                panda<span className="text-marca">store</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-suave">
                <IconoUbicacion className="h-4 w-4 shrink-0" />
                {/* "Colectivo Dreamy · Managua", como en los afiches. */}
                {CONTACTO.direccion.split(",")[0]} · Managua
              </p>
            </div>
          </div>
          <EnlaceWhatsApp
            href={linkWhatsApp(CONTACTO.whatsapp)}
            className="group flex items-center gap-3 rounded-2xl"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-marca text-white">
              <IconoWhatsApp className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm text-suave">Escribinos por WhatsApp</span>
              <span className="block text-3xl font-extrabold tracking-tight tabular-nums text-texto transition group-hover:text-acento">
                {CONTACTO.whatsappVisible.replace(/^\+505\s*/, "")}
              </span>
            </span>
          </EnlaceWhatsApp>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm leading-relaxed text-suave">
            {SITE.tagline}. Pagá en cuotas, garantía de {GARANTIA_MESES} meses y
            entrega inmediata.
          </p>

          {/* Áreas táctiles de 44px sin agrandar los íconos: el ::after absoluto
              se mide desde el padding box, y el borde de 1px le resta 2px a los
              36 de la caja (quedan 34). Por eso -5px y no -4px: 34 + 2×5 = 44.
              Con el gap-2 (8px) las zonas de dos íconos vecinos se tocan justo,
              sin pisarse. */}
          <div className="mt-4 flex gap-2">
            {REDES.map((red) => {
              const Icono = ICONOS_RED[red.icono];
              return (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE.nombre} en ${red.nombre}`}
                  title={red.nombre}
                  className="relative grid h-9 w-9 place-items-center rounded-xl border border-borde bg-superficie text-suave transition after:absolute after:-inset-[5px] after:content-[''] hover:bg-marca hover:text-white"
                >
                  <Icono className="h-4 w-4" />
                </a>
              );
            })}
            <EnlaceWhatsApp
              href={linkWhatsApp(CONTACTO.whatsapp)}
              aria-label={`Escribir a ${SITE.nombre} por WhatsApp`}
              title="WhatsApp"
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-borde bg-superficie text-suave transition after:absolute after:-inset-[5px] after:content-[''] hover:bg-marca hover:text-white"
            >
              <IconoWhatsApp className="h-4 w-4" />
            </EnlaceWhatsApp>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-texto">Categorías</h2>
          <ul className="mt-3 space-y-2">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalogo?cat=${c.slug}`}
                  className="text-sm text-suave transition hover:text-acento"
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-texto">Contacto</h2>
          <ul className="mt-3 space-y-3 text-sm text-suave">
            <li>
              <EnlaceWhatsApp
                href={linkWhatsApp(CONTACTO.whatsapp)}
                className="flex items-center gap-2 transition hover:text-precio"
              >
                <IconoWhatsApp className="h-4 w-4 shrink-0" />
                {CONTACTO.whatsappVisible}
              </EnlaceWhatsApp>
            </li>
            <li>
              <a
                href={`mailto:${CONTACTO.email}`}
                className="transition hover:text-acento"
              >
                {CONTACTO.email}
              </a>
            </li>
            <li>
              <EnlaceConversion
                href={`tel:+${CONTACTO.whatsapp}`}
                gtag={CONVERSIONES.llamada}
                className="transition hover:text-acento"
              >
                Llamar: {CONTACTO.whatsappVisible}
              </EnlaceConversion>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-texto">Dónde estamos</h2>
          <a
            href={CONTACTO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex gap-2 text-sm leading-relaxed text-suave transition hover:text-acento"
          >
            <IconoUbicacion className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {CONTACTO.direccion}
              <br />
              {CONTACTO.ciudad}
            </span>
          </a>
          {/* Visible en todas las páginas, como el horario que lee Google
              en el JSON-LD de la tienda (lib/seo.ts). */}
          <p className="mt-3 flex gap-2 text-sm leading-relaxed text-suave">
            <IconoReloj className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {HORARIO.map((franja) => (
                <span key={franja.dias} className="block">
                  {lineaHorario(franja)}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-borde/70 px-4 py-6">
        <p className="mx-auto max-w-6xl text-xs text-tenue">
          © {new Date().getFullYear()} {SITE.nombre}. Precios sujetos a cambio sin
          previo aviso. Las imágenes son de carácter ilustrativo.
        </p>
      </div>
    </footer>
  );
}
