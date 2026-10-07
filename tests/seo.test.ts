// Pruebas de lo que lee Google: títulos, descripciones y JSON-LD.
//
// Correr con:  npm test

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { leerFixture } from "../src/lib/fixture";
import {
  CONFIG_FINANCIAMIENTO_DEFAULT,
  calcularPlanes,
} from "../src/lib/financiamiento";
import { cordobasNumero, horaLegible, lineaHorario, mesesDeGarantia } from "../src/lib/format";
import {
  descripcionCategoria,
  descripcionPortada,
  descripcionProducto,
  imagenesPublicas,
  marcaDe,
  migasJsonLd,
  productoJsonLd,
  serializarJsonLd,
  tiendaJsonLd,
  tituloProducto,
} from "../src/lib/seo";
import type { Producto } from "../src/lib/types";

const TASA = 36.6243;

/** Producto mínimo con las cuotas calculadas por la regla vigente por defecto. */
function producto(datos: Partial<Producto> & Pick<Producto, "name">): Producto {
  const base: Producto = {
    id: "abc",
    disponible: true,
    precio: { actual: 300 },
    bullets: [],
    media: {},
    planes: [],
    ...datos,
  };
  return {
    ...base,
    planes: calcularPlanes(base.precio.actual, TASA, {
      config: CONFIG_FINANCIAMIENTO_DEFAULT,
      categoria: base.categorySlug,
    }),
  };
}

// ---------------------------------------------------------------------------
describe("marca del fabricante", () => {
  it("la reconoce en los nombres reales del catálogo", () => {
    assert.equal(marcaDe("MagCubic Proyector Portatil HY450MAX 1100 ANSI"), "Magcubic");
    assert.equal(marcaDe("70mai Dash Cam A810 LITE"), "70mai");
    assert.equal(marcaDe("Amazfit Active Max"), "Amazfit");
    assert.equal(marcaDe("Redmi Watch 5"), "Xiaomi");
    assert.equal(marcaDe("Xiaomi Mi Band 10"), "Xiaomi");
    assert.equal(marcaDe("Amazon Echo Dot Max"), "Amazon");
    assert.equal(marcaDe("Parlante ANKER SoundCore 2"), "Anker");
    assert.equal(marcaDe("TP-Link - Cámara de seguridad inalámbrica para exteriores, 1080P"), "TP-Link");
  });

  it("sin marca reconocible no inventa una (ni pone la de la tienda)", () => {
    assert.equal(marcaDe("TRIPODE PARA PROYECTOR"), undefined);
    assert.equal(marcaDe("Enchufe inteligente compatible con Alexa"), undefined);
  });

  it("todo el catálogo de prueba con marca conocida la tiene", async () => {
    const { productos } = await leerFixture();
    const sinMarca = productos.filter((p) => !marcaDe(p.name)).map((p) => p.name);
    // Los accesorios genéricos son los únicos que pueden quedar sin marca.
    assert.deepEqual(sinMarca, ["TRIPODE PARA PROYECTOR", "Manta Reflectiva 100 pulgadas"]);
  });
});

// ---------------------------------------------------------------------------
describe("título de la ficha", () => {
  it("suma 'en Nicaragua' si entra con el sufijo de la tienda", () => {
    assert.equal(tituloProducto({ name: "Amazfit Active Max" }), "Amazfit Active Max en Nicaragua");
  });

  it("un nombre largo va solo, para no cortar el modelo", () => {
    assert.equal(
      tituloProducto({ name: "MagCubic Proyector Portatil HY450MAX 1100 ANSI" }),
      "MagCubic Proyector Portatil HY450MAX 1100 ANSI",
    );
  });

  it("limpia los espacios dobles del POS", () => {
    assert.equal(
      tituloProducto({ name: "MagCubic Proyector Portatil HY320PRO  400 ANSI" }),
      "MagCubic Proyector Portatil HY320PRO 400 ANSI",
    );
  });
});

// ---------------------------------------------------------------------------
describe("meta descripción de la ficha", () => {
  it("un proyector anuncia el 0% de interés y el plazo real", () => {
    const d = descripcionProducto(
      producto({
        name: "MagCubic HY450MAX",
        categorySlug: "proyector",
        beneficio: "El más potente y brillante: imagen grande y nítida incluso con luz.",
      }),
      TASA,
    );
    assert.match(d, /^El más potente/);
    assert.match(d, /hasta 6 cuotas al 0% de interés con Banpro/);
    assert.ok(d.length <= 160, `${d.length} caracteres: ${d}`);
  });

  it("una categoría con recargo nunca promete 0%", () => {
    const d = descripcionProducto(
      producto({ name: "Amazfit Active Max", categorySlug: "smartwatch" }),
      TASA,
    );
    assert.doesNotMatch(d, /0%/);
    assert.match(d, /en cuotas con Banpro/);
  });

  it("debajo del mínimo para cuotas no habla de cuotas", () => {
    const d = descripcionProducto(
      producto({ name: "Xiaomi Mi Band 10", categorySlug: "smartwatch", precio: { actual: 40 } }),
      TASA,
    );
    assert.doesNotMatch(d, /cuotas/);
    assert.match(d, /C\$/);
    // Con lugar de sobra, va la entrega completa: el delivery local.
    assert.match(d, /Delivery en Managua y envíos a todo Nicaragua\.$/);
  });

  it("antes de recortar el beneficio, acorta la entrega", () => {
    const beneficio = "El más potente y brillante: imagen grande y nítida incluso con luz.";
    const d = descripcionProducto(
      producto({ name: "HY450MAX", categorySlug: "proyector", precio: { actual: 198.5 }, beneficio }),
      TASA,
    );
    assert.ok(d.startsWith(beneficio), d);
    assert.match(d, /Envíos a todo Nicaragua\.$/);
  });

  it("un beneficio larguísimo se recorta y la oferta queda entera", () => {
    const d = descripcionProducto(
      producto({ name: "Proyector", categorySlug: "proyector", beneficio: "palabra ".repeat(60) }),
      TASA,
    );
    assert.ok(d.length <= 160, `${d.length} caracteres`);
    assert.match(d, /… C\$/);
    assert.match(d, /0% de interés con Banpro\. Envíos a todo Nicaragua\.$/);
  });

  it("sin beneficio ni descripción usa el resumen de specs de la ficha", () => {
    const d = descripcionProducto(
      producto({
        name: "MagCubic Proyector Portatil HY450GT 1100 ANSI",
        categorySlug: "proyector",
        specs: { ansi: 1100, resolucion: "1080p Full HD" },
      }),
      TASA,
    );
    assert.doesNotMatch(d, /HY450GT/);
    assert.match(d, /1100/);
  });

  it("todas las fichas del catálogo de prueba entran en 160 caracteres", async () => {
    const { productos, tasa } = await leerFixture();
    for (const p of productos) {
      const d = descripcionProducto(p, tasa);
      assert.ok(d.length <= 160, `${p.name}: ${d.length} caracteres`);
    }
  });
});

describe("descripción de la portada", () => {
  it("con la regla vigente, los proyectores van al 0%", () => {
    assert.match(descripcionPortada(CONFIG_FINANCIAMIENTO_DEFAULT), /0% de interés/);
  });

  it("si el POS les pone recargo, deja de prometerlo", () => {
    const config = {
      ...CONFIG_FINANCIAMIENTO_DEFAULT,
      porCategoria: { proyector: { recargo: { "3": 3, "6": 6 } } },
    };
    assert.doesNotMatch(descripcionPortada(config), /0%/);
  });
});

describe("descripción de una categoría", () => {
  const proyectores = { slug: "proyector", descripcion: "Convertí cualquier pared en una pantalla grande" };
  const smartwatches = { slug: "smartwatch", descripcion: "Salud, notificaciones y deporte en la muñeca" };

  it("0% solo en la categoría que el POS deja sin recargo", () => {
    assert.match(descripcionCategoria(proyectores, CONFIG_FINANCIAMIENTO_DEFAULT), /0% de interés/);
    assert.doesNotMatch(descripcionCategoria(smartwatches, CONFIG_FINANCIAMIENTO_DEFAULT), /0%/);
  });

  it("sin la configuración del POS no promete 0%", () => {
    assert.doesNotMatch(descripcionCategoria(proyectores, null), /0%/);
    assert.match(descripcionCategoria(proyectores, null), /Managua/);
  });
});

// ---------------------------------------------------------------------------
describe("JSON-LD", () => {
  it("un </script> del POS no puede cerrar la etiqueta", () => {
    const datos = { description: "Oferta </script><script>alert(1)</script>" };
    const texto = serializarJsonLd(datos);
    assert.doesNotMatch(texto, /<\/script/i);
    assert.deepEqual(JSON.parse(texto), datos);
  });

  it("producto: marca real, precio igual al de la ficha y disponibilidad", () => {
    const p = producto({
      name: "MagCubic Proyector Portatil HY450MAX 1100 ANSI",
      categorySlug: "proyector",
      sku: "HY450MAX",
      media: { heroImage: "https://i.imgur.com/a.jpg" },
    });
    const json = productoJsonLd(p, TASA);
    assert.deepEqual(json.brand, { "@type": "Brand", name: "Magcubic" });
    assert.equal(json.category, "Proyectores");
    assert.equal(json.offers?.priceCurrency, "NIO");
    assert.equal(json.offers?.price, cordobasNumero(300, TASA));
    assert.equal(json.offers?.availability, "https://schema.org/InStock");

    const agotado = productoJsonLd({ ...p, disponible: false }, TASA);
    assert.equal(agotado.offers?.availability, "https://schema.org/OutOfStock");
  });

  it("oferta: garantía de 3 meses por desperfecto, sin envío ni devoluciones inventados", () => {
    const { offers } = productoJsonLd(producto({ name: "Amazfit Bip 6", categorySlug: "smartwatch" }), TASA);
    assert.deepEqual(offers?.warranty.durationOfWarranty, {
      "@type": "QuantitativeValue",
      value: 3,
      unitCode: "MON",
    });
    assert.match(offers?.warranty.description ?? "", /desperfectos de fábrica.*reemplazo o reembolso.*factura/);
    // El envío se cotiza según el destino y la garantía no es una política
    // de devoluciones: publicar cualquiera de los dos sería inventar.
    assert.ok(offers && !("shippingDetails" in offers));
    assert.ok(offers && !("hasMerchantReturnPolicy" in offers));
  });

  it("garantía: manda la que cargó el POS en la ficha; si no, la estándar", () => {
    assert.equal(mesesDeGarantia(undefined), 3);
    assert.equal(mesesDeGarantia({ ansi: 900 }), 3);
    assert.equal(mesesDeGarantia({ garantiaMeses: "" }), 3);
    assert.equal(mesesDeGarantia({ garantiaMeses: 12 }), 12);
    assert.equal(mesesDeGarantia({ extra: { garantiaMeses: "6" } }), 6);
    const json = productoJsonLd(
      producto({ name: "Algo", specs: { garantiaMeses: 12 } }),
      TASA,
    );
    assert.equal(json.offers?.warranty.durationOfWarranty.value, 12);
  });

  it("sin precio no publica una oferta, y sin marca no publica brand", () => {
    const json = productoJsonLd(producto({ name: "TRIPODE PARA PROYECTOR", precio: {} }), TASA);
    assert.equal(json.offers, undefined);
    assert.equal(json.brand, undefined);
  });

  it("fotos: la principal primero, sin repetidas y sin data URI", () => {
    assert.deepEqual(
      imagenesPublicas({
        heroImage: "https://i.imgur.com/a.jpg",
        gallery: [
          { url: "https://i.imgur.com/a.jpg" },
          { url: "data:image/png;base64,AAAA" },
          { url: "https://i.imgur.com/b.jpg", label: "Con luz" },
        ],
      }),
      ["https://i.imgur.com/a.jpg", "https://i.imgur.com/b.jpg"],
    );
  });

  it("tienda: horario de lunes a sábado, en 24 h y sin domingo", () => {
    const [tienda] = tiendaJsonLd()["@graph"];
    assert.deepEqual(
      (tienda.openingHoursSpecification ?? []).map((f) => [f.dayOfWeek.join(","), f.opens, f.closes]),
      [
        ["Monday,Tuesday,Wednesday,Thursday,Friday", "09:00", "18:00"],
        ["Saturday", "09:00", "17:00"],
      ],
    );
    assert.match(tienda.address?.streetAddress ?? "", /Colectivo Dreamy/);
  });

  it("horario visible: el mismo dato, en 12 h", () => {
    assert.equal(horaLegible("09:00"), "9:00 a.m.");
    assert.equal(horaLegible("18:00"), "6:00 p.m.");
    assert.equal(horaLegible("12:30"), "12:30 p.m.");
    assert.equal(horaLegible("00:15"), "12:15 a.m.");
    const linea = lineaHorario({ dias: "Sábados", abre: "09:00", cierra: "17:00" });
    assert.equal(linea.replace(/ /g, " "), "Sábados: 9:00 a.m. a 5:00 p.m.");
    // El rango no se parte por dentro ("6:00 / p.m." en el footer).
    assert.doesNotMatch(linea.split(": ")[1], / /);
  });

  it("migas: catálogo, categoría y producto, en orden", () => {
    const migas = migasJsonLd({ id: "abc", name: "Amazfit Active Max", categorySlug: "smartwatch" });
    assert.deepEqual(
      migas.itemListElement.map((m) => [m.position, m.name]),
      [
        [1, "Catálogo"],
        [2, "Smartwatches"],
        [3, "Amazfit Active Max"],
      ],
    );
    const sinCategoria = migasJsonLd({ id: "abc", name: "Algo" });
    assert.equal(sinCategoria.itemListElement.length, 2);
  });
});
