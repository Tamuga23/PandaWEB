"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EnlaceWhatsApp } from "@/components/EnlaceWhatsApp";
import { ProductImage } from "@/components/ProductImage";
import { ORDEN_SPECS, etiquetaSpec, formatearValorSpec } from "@/components/Specs";
import { IconoWhatsApp } from "@/components/iconos";
import { CATEGORIAS, CONTACTO } from "@/config/site";
import { planMasBajo, todosSinInteres } from "@/lib/financiamiento";
import { cordobas, linkWhatsApp, porcentajeDescuento } from "@/lib/format";
import type { Producto } from "@/lib/types";
import { useComparar } from "./CompararProvider";

const NOMBRE_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.slug, c.nombre]));

/**
 * Comparación con filas alineadas.
 *
 * El boceto mostraba dos tarjetas independientes una al lado de la otra, así
 * que las características no quedaban a la misma altura y había que buscarlas
 * con la vista. Acá cada fila es una especificación: brillo contra brillo.
 * Eso es lo que hace útil comparar dos proyectores.
 */
export function ModalComparar() {
  const { seleccion, tasa, abierto, cerrar, quitar } = useComparar();

  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", alPresionar);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto, cerrar]);

  if (!abierto || seleccion.length < 2) return null;

  // Unión de todas las specs presentes, en el orden de presentación habitual.
  // Se descartan las claves que no producen texto en NINGÚN producto (`extra`,
  // que es un mapa, o valores vacíos): una fila en blanco no aporta al comparar.
  const clavesSpec = Array.from(
    new Set(seleccion.flatMap((p) => Object.keys(p.specs ?? {}))),
  )
    .filter((clave) =>
      seleccion.some((p) => formatearValorSpec(clave, p.specs?.[clave]) !== ""),
    )
    .sort((a, b) => {
      const ia = ORDEN_SPECS.indexOf(a);
      const ib = ORDEN_SPECS.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

  // Una fila donde todos valen lo mismo no aporta nada al comparar; se marca
  // para atenuarla y que resalten las diferencias.
  const filaIgual = (obtener: (p: Producto) => string) => {
    const valores = seleccion.map(obtener);
    return valores.every((v) => v === valores[0]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Comparación de productos"
      onClick={cerrar}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-borde2 bg-superficie sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-borde px-5 py-4">
          <h2 className="text-lg font-bold">Comparación</h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar comparación"
            className="grid h-9 w-9 place-items-center rounded-full text-suave transition hover:bg-superficie2 hover:text-texto"
          >
            ✕
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {/* Columna de etiquetas: fija al hacer scroll horizontal. */}
                <th className="sticky left-0 top-0 z-20 w-28 bg-superficie sm:w-40" />
                {seleccion.map((p) => {
                  const desc = porcentajeDescuento(p.precio.lista, p.precio.actual);
                  return (
                    <th
                      key={p.id}
                      className="sticky top-0 z-10 min-w-[9rem] border-l border-borde bg-superficie p-3 align-top sm:min-w-[11rem]"
                    >
                      <div className="relative mx-auto aspect-square w-full max-w-[8rem] overflow-hidden rounded-xl bg-fondo p-2">
                        <ProductImage src={p.media.heroImage} alt={p.name} sizes="140px" />
                        {desc != null && (
                          <span className="absolute left-1 top-1 rounded-md bg-marca px-1.5 py-0.5 text-micro font-black text-white">
                            −{desc}%
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/producto/${p.id}`}
                        className="mt-2 line-clamp-2 block text-xs font-semibold leading-snug text-texto transition hover:text-acento"
                      >
                        {p.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => quitar(p.id)}
                        className="mt-1 text-label font-medium text-tenue transition hover:text-texto"
                      >
                        Quitar
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <Fila
                etiqueta="Precio"
                productos={seleccion}
                render={(p) => (
                  <span className="text-base font-bold text-precio">
                    {cordobas(p.precio.actual, tasa)}
                  </span>
                )}
              />
              <Fila
                etiqueta="Cuota desde"
                productos={seleccion}
                atenuar={filaIgual((p) => String(planMasBajo(p.planes)?.cuotaNio))}
                render={(p) => {
                  // Ya vienen calculadas en el producto: el comparador no puede
                  // mostrar una cuota distinta a la de la ficha.
                  const c = planMasBajo(p.planes);
                  return c ? (
                    <>
                      C${c.cuotaNio.toLocaleString("es-NI")}
                      <span className="text-tenue"> / {c.meses} meses</span>
                      {todosSinInteres(p.planes) && (
                        <span className="text-precio"> · 0%</span>
                      )}
                    </>
                  ) : (
                    <span className="text-tenue">Sin cuotas</span>
                  );
                }}
              />
              <Fila
                etiqueta="Disponibilidad"
                productos={seleccion}
                atenuar={filaIgual((p) => String(p.disponible))}
                render={(p) => (
                  <span className={p.disponible ? "text-precio" : "text-agotado"}>
                    {p.disponible ? "Disponible" : "Agotado"}
                  </span>
                )}
              />
              <Fila
                etiqueta="Categoría"
                productos={seleccion}
                atenuar={filaIgual((p) => p.categorySlug ?? "")}
                render={(p) =>
                  p.categorySlug
                    ? (NOMBRE_CATEGORIA[p.categorySlug] ?? p.categorySlug)
                    : "—"
                }
              />

              {clavesSpec.map((clave) => (
                <Fila
                  key={clave}
                  etiqueta={etiquetaSpec(clave)}
                  productos={seleccion}
                  atenuar={filaIgual((p) =>
                    p.specs?.[clave] !== undefined
                      ? formatearValorSpec(clave, p.specs[clave])
                      : "",
                  )}
                  render={(p) =>
                    p.specs?.[clave] !== undefined ? (
                      formatearValorSpec(clave, p.specs[clave])
                    ) : (
                      <span className="text-tenue">—</span>
                    )
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        <footer className="shrink-0 border-t border-borde p-4">
          <EnlaceWhatsApp
            href={linkWhatsApp(CONTACTO.whatsapp)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-marca px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <IconoWhatsApp className="h-5 w-5" />
            ¿Cuál me conviene? Preguntale a un asesor
          </EnlaceWhatsApp>
        </footer>
      </div>
    </div>
  );
}

function Fila({
  etiqueta,
  productos,
  render,
  atenuar = false,
}: {
  etiqueta: string;
  productos: Producto[];
  render: (p: Producto) => React.ReactNode;
  atenuar?: boolean;
}) {
  return (
    <tr className="border-t border-borde">
      <th
        scope="row"
        className={`sticky left-0 z-10 bg-superficie p-3 text-left align-top text-xs font-medium ${
          atenuar ? "text-tenue" : "text-suave"
        }`}
      >
        {etiqueta}
      </th>
      {productos.map((p) => (
        <td
          key={p.id}
          className={`border-l border-borde p-3 align-top ${
            atenuar ? "text-suave" : "text-texto"
          }`}
        >
          {render(p)}
        </td>
      ))}
    </tr>
  );
}
