import Image from "next/image";
import Link from "next/link";
import { CONTACTO, SITE } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";
import { EnlaceWhatsApp } from "./EnlaceWhatsApp";
import { BotonTema } from "./tema/BotonTema";
import { IconoWhatsApp } from "./iconos";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-fondo/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 py-1"
          aria-label={`${SITE.nombre} — inicio`}
        >
          {/* El ícono ya trae sus esquinas redondeadas y el borde degradado
              horneados, así que no lleva fondo ni recorte del lado del CSS.
              Es un PNG y no el SVG original: ese pesa 1.4 MB porque Canva le
              embebió mapas de bits, y a este tamaño se ve idéntico. */}
          <Image
            src="/logo.png"
            alt=""
            width={38}
            height={36}
            priority
            className="h-9 w-auto shrink-0"
          />
          <span className="text-lg font-bold tracking-tight">
            panda<span className="text-marca">store</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden items-center gap-1 sm:flex">
          <NavLink href="/catalogo">Catálogo</NavLink>
          <NavLink href="/#financiamiento">Financiamiento</NavLink>
          <NavLink href="/#ubicacion">Dónde estamos</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <BotonTema />
          <EnlaceWhatsApp
            href={linkWhatsApp(CONTACTO.whatsapp)}
            className="btn-primary relative flex items-center gap-2 px-4 py-2.5 text-sm after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-[''] max-[359px]:py-3"
          >
            <IconoWhatsApp className="h-4 w-4" />
            {/* Con menos de 359px (iPhone SE de 1.ª gen., Android chicos) el texto
                no entra junto al logo y desbordaba 25px el header: queda solo el
                ícono, y "Escribinos" sigue siendo el nombre accesible. Sin el
                texto, el alto sale del ícono de 16px y no de la línea de 20px:
                por eso py-3 ahí, para que la caja siga en 40px (pareja con el
                botón de tema) y el ::after llegue a 44. */}
            <span className="max-[359px]:sr-only">Escribinos</span>
          </EnlaceWhatsApp>
        </div>
      </div>

      {/* En móvil la navegación no cabe arriba: va en una fila propia. */}
      <nav aria-label="Principal" className="flex gap-1 overflow-x-auto border-t border-borde/70 px-4 py-2 scrollbar-none sm:hidden">
        <NavLink href="/catalogo">Catálogo</NavLink>
        <NavLink href="/#financiamiento">Financiamiento</NavLink>
        <NavLink href="/#ubicacion">Dónde estamos</NavLink>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative shrink-0 rounded-full px-3 py-2 text-sm font-medium text-suave transition after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] hover:bg-superficie2 hover:text-texto"
    >
      {children}
    </Link>
  );
}
