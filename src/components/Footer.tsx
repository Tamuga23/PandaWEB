import Image from "next/image";
import Link from "next/link";
import { CATEGORIAS, CONTACTO, GARANTIA_MESES, REDES, SITE } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";
import { EnlaceConversion } from "./EnlaceConversion";
import { EnlaceWhatsApp } from "./EnlaceWhatsApp";
import { CONVERSIONES } from "@/lib/gtag";
import { ICONOS_RED, IconoUbicacion, IconoWhatsApp } from "./iconos";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-borde bg-fondo">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt=""
              width={34}
              height={32}
              className="h-8 w-auto shrink-0"
            />
            <span className="font-bold">
              panda<span className="text-marca">store</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-suave">
            {SITE.tagline}. Pagá en cuotas, garantía de {GARANTIA_MESES} meses y
            entrega inmediata.
          </p>

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
                  className="grid h-9 w-9 place-items-center rounded-xl border border-borde bg-superficie text-suave transition hover:bg-marca hover:text-white"
                >
                  <Icono className="h-4 w-4" />
                </a>
              );
            })}
            <EnlaceWhatsApp
              href={linkWhatsApp(CONTACTO.whatsapp)}
              aria-label={`Escribir a ${SITE.nombre} por WhatsApp`}
              title="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-xl border border-borde bg-superficie text-suave transition hover:bg-marca hover:text-white"
            >
              <IconoWhatsApp className="h-4 w-4" />
            </EnlaceWhatsApp>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-texto">Categorías</h3>
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
          <h3 className="text-sm font-semibold text-texto">Contacto</h3>
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
          <h3 className="text-sm font-semibold text-texto">Dónde estamos</h3>
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
