"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIAS, CONTACTO } from "@/config/site";
import { linkWhatsApp } from "@/lib/format";
import type { Producto } from "@/lib/types";
import { EnlaceWhatsApp } from "./EnlaceWhatsApp";
import { IconoBuscar, IconoWhatsApp } from "./iconos";
import { ProductCard } from "./ProductCard";

type Orden = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

/**
 * Filtros y grid del catálogo.
 *
 * Los productos llegan ya renderizados desde el servidor; este componente solo
 * filtra en memoria. El catálogo es chico, así que filtrar acá es instantáneo y
 * evita crear índices compuestos en Firestore (firestore.indexes.json está
 * vacío en el POS).
 */
export function CatalogoCliente({
  productos,
  tasa,
  categoriaInicial,
}: {
  productos: Producto[];
  tasa: number;
  categoriaInicial?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<string | null>(categoriaInicial ?? null);
  const [orden, setOrden] = useState<Orden>("relevancia");

  // El estado sigue siendo la fuente de verdad del render; la URL es un
  // espejo para que la vista filtrada se pueda compartir, guardar en
  // favoritos, y para que Google descubra las páginas de categoría.
  useEffect(() => {
    const url = categoria ? `${pathname}?cat=${categoria}` : pathname;
    router.replace(url, { scroll: false });
  }, [categoria, pathname, router]);

  // Solo se ofrecen las categorías que tienen productos: una pestaña vacía es
  // una promesa incumplida.
  const categoriasDisponibles = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const p of productos) {
      if (p.categorySlug) conteo.set(p.categorySlug, (conteo.get(p.categorySlug) ?? 0) + 1);
    }
    return CATEGORIAS.filter((c) => conteo.has(c.slug)).map((c) => ({
      ...c,
      total: conteo.get(c.slug)!,
    }));
  }, [productos]);

  // Los agotados se muestran aparte, al final: nunca mezclados con lo disponible.
  const { disponibles, agotados } = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    let out = productos;

    if (categoria) out = out.filter((p) => p.categorySlug === categoria);

    if (q) {
      out = out.filter((p) => {
        const heno = [p.name, p.sku, p.beneficio, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        // Todas las palabras deben aparecer: "proyector 4k" no trae todo lo 4k.
        return q.split(/\s+/).every((palabra) => heno.includes(palabra));
      });
    }

    const comparador = (a: Producto, b: Producto) => {
      switch (orden) {
        case "precio-asc":
          return (a.precio.actual ?? Infinity) - (b.precio.actual ?? Infinity);
        case "precio-desc":
          return (b.precio.actual ?? 0) - (a.precio.actual ?? 0);
        case "nombre":
          return a.name.localeCompare(b.name, "es");
        default:
          return 0; // ya viene ordenado del servidor
      }
    };

    const disponibles = out.filter((p) => p.disponible);
    const agotados = out.filter((p) => !p.disponible);
    if (orden !== "relevancia") {
      disponibles.sort(comparador);
      agotados.sort(comparador);
    }
    return { disponibles, agotados };
  }, [productos, busqueda, categoria, orden]);

  const total = disponibles.length + agotados.length;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <IconoBuscar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tenue" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o código…"
              aria-label="Buscar productos"
              className="w-full rounded-xl border border-borde bg-superficie py-3 pl-10 pr-4 text-sm text-texto placeholder:text-tenue focus:border-acento focus:outline-none"
            />
          </div>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            aria-label="Ordenar productos"
            className="rounded-xl border border-borde bg-superficie px-4 py-3 text-sm text-texto focus:border-acento focus:outline-none"
          >
            <option value="relevancia">Disponibles primero</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Nombre A–Z</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Pill activo={categoria === null} onClick={() => setCategoria(null)}>
            Todo ({productos.length})
          </Pill>
          {categoriasDisponibles.map((c) => (
            <Pill
              key={c.slug}
              activo={categoria === c.slug}
              onClick={() => setCategoria(categoria === c.slug ? null : c.slug)}
            >
              {c.nombre} ({c.total})
            </Pill>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-tenue">
        {total === 0
          ? "Ningún producto coincide"
          : `${total} ${total === 1 ? "producto" : "productos"}`}
      </p>

      {total === 0 ? (
        <SinResultados busqueda={busqueda} />
      ) : (
        <>
          {disponibles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {disponibles.map((p, i) => (
                <ProductCard key={p.id} producto={p} tasa={tasa} priority={i < 4} />
              ))}
            </div>
          )}

          {agotados.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-sm font-semibold text-tenue">
                Agotados ({agotados.length})
              </h2>
              <div className="grid grid-cols-2 gap-4 opacity-70 lg:grid-cols-3 xl:grid-cols-4">
                {agotados.map((p) => (
                  <ProductCard key={p.id} producto={p} tasa={tasa} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Pill({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm transition ${
        activo
          ? "bg-marca font-bold text-white shadow-md"
          : "border border-borde bg-superficie font-medium text-suave hover:border-borde2 hover:text-texto"
      }`}
    >
      {activo && (
        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

function SinResultados({ busqueda }: { busqueda: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-borde2 px-6 py-14 text-center">
      <p className="text-texto">
        {busqueda
          ? `No encontramos nada para “${busqueda}”.`
          : "No hay productos en esta categoría todavía."}
      </p>
      <p className="mt-1 text-sm text-suave">
        Puede que lo tengamos sin publicar. Preguntanos y te confirmamos.
      </p>
      <EnlaceWhatsApp
        href={linkWhatsApp(CONTACTO.whatsapp)}
        className="btn-primary mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm"
      >
        <IconoWhatsApp className="h-4 w-4" />
        Consultar por WhatsApp
      </EnlaceWhatsApp>
    </div>
  );
}
