// Pruebas de la lógica que traduce Firestore → pantalla.
//
// Correr con:  npm test
//
// Las formas de documento usadas acá son las reales de `catalogo_publico` y las
// variantes heredadas que todavía existen en la base. No son inventadas: salen
// de PublicCatalogProduct (POS) y del normalizador de PandaLink.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeDocument } from "../src/lib/firestore-decode";
import {
  CONFIG_FINANCIAMIENTO_DEFAULT,
  calcularPlanes,
  esCategoriaSinInteres,
  planMasBajo,
  todosSinInteres,
} from "../src/lib/financiamiento";
import {
  beneficioDesdeSpecs,
  cordobas,
  linkWhatsApp,
  porcentajeDescuento,
  youTubeId,
} from "../src/lib/format";
import { canonizarSlug, normalizarProducto } from "../src/lib/normalize";

const TASA = 36.6243;

// ---------------------------------------------------------------------------
describe("decodificador REST de Firestore", () => {
  it("saca el id del campo name", () => {
    const doc = decodeDocument({
      name: "projects/p/databases/d/documents/catalogo_publico/HY310X",
      fields: { name: { stringValue: "Proyector HY310X" } },
    });
    assert.equal(doc.id, "HY310X");
    assert.equal(doc.name, "Proyector HY310X");
  });

  it("convierte enteros que llegan como string", () => {
    // Firestore manda integerValue como string. Sin convertir, 'stock > 0'
    // compararía texto y daría resultados absurdos.
    const doc = decodeDocument({ fields: { stock: { integerValue: "5" } } });
    assert.equal(doc.stock, 5);
    assert.equal(typeof doc.stock, "number");
  });

  it("decodifica mapas y arreglos anidados", () => {
    const doc = decodeDocument({
      fields: {
        precio: {
          mapValue: {
            fields: {
              lista: { doubleValue: 250 },
              actual: { doubleValue: 199.99 },
            },
          },
        },
        bullets: {
          arrayValue: {
            values: [
              { mapValue: { fields: { text: { stringValue: "Muy brillante" } } } },
            ],
          },
        },
      },
    });
    assert.deepEqual(doc.precio, { lista: 250, actual: 199.99 });
    assert.deepEqual(doc.bullets, [{ text: "Muy brillante" }]);
  });

  it("no se cae con un documento vacío", () => {
    assert.deepEqual(decodeDocument({}), { id: "" });
  });
});

// ---------------------------------------------------------------------------
describe("canonización de categorías", () => {
  it("acepta los slugs en español del POS", () => {
    assert.equal(canonizarSlug("proyector"), "proyector");
  });

  it("traduce los slugs en inglés de PandaLink", () => {
    assert.equal(canonizarSlug("projector"), "proyector");
    assert.equal(canonizarSlug("security-cam"), "camara");
    assert.equal(canonizarSlug("speaker"), "parlante");
  });

  it("cubre dashcam, que PandaLink deja sin mapear", () => {
    assert.equal(canonizarSlug("dashcam"), "dashcam");
    assert.equal(canonizarSlug("dash-cam"), "dashcam");
  });

  it("ignora mayúsculas y espacios", () => {
    assert.equal(canonizarSlug("  Proyector "), "proyector");
  });

  it("respeta una categoría desconocida en vez de descartarla", () => {
    assert.equal(canonizarSlug("tablet"), "tablet");
  });
});

// ---------------------------------------------------------------------------
describe("normalizador de productos", () => {
  const docCompleto = {
    id: "HY310X",
    sku: "PRY-HY310X",
    name: "Proyector HY310X",
    category: "proyector",
    categorySlug: "proyector",
    precio: { lista: 250, promo: 199, actual: 199, efectivo: 179, descEfectivoPct: 10 },
    disponible: true,
    beneficio: "Cine en casa sin gastar de más",
    bullets: [
      { text: "Segundo bullet", order: 2 },
      { text: "Primer bullet", order: 1 },
    ],
    specsProyector: { ansi: 320, resolucion: "1080p", autofoco: true },
    media: {
      heroImage: "https://i.imgur.com/abc.jpg",
      gallery: ["https://i.imgur.com/def.jpg", { url: "https://i.imgur.com/ghi.jpg", label: "A oscuras" }],
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    updatedAt: 1750000000000,
  };

  it("NUNCA expone el precio de efectivo", () => {
    const p = normalizarProducto(docCompleto)!;
    const serializado = JSON.stringify(p);
    assert.ok(!serializado.includes("179"), "el precio de efectivo llegó al cliente");
    assert.ok(!serializado.includes("efectivo"));
    assert.ok(!serializado.includes("descEfectivoPct"));
  });

  it("NUNCA expone el costo interno", () => {
    const p = normalizarProducto({ ...docCompleto, cost: 120 })!;
    const serializado = JSON.stringify(p);
    assert.ok(!serializado.includes("cost"));
    assert.ok(!serializado.includes("120"));
  });

  it("mapea lista y actual del esquema del espejo", () => {
    const p = normalizarProducto(docCompleto)!;
    assert.equal(p.precio.lista, 250);
    assert.equal(p.precio.actual, 199);
  });

  it("mapea el esquema viejo de campos sueltos", () => {
    const p = normalizarProducto({
      id: "X1",
      name: "Cámara",
      price: 100,
      precioPromo: 80,
      category: "camara",
    })!;
    assert.equal(p.precio.lista, 100);
    assert.equal(p.precio.actual, 80);
    assert.equal(p.categorySlug, "camara");
  });

  it("no muestra precio tachado si el descuento no descuenta nada", () => {
    const p = normalizarProducto({
      id: "X2",
      name: "Parlante",
      precio: { lista: 100, actual: 100 },
    })!;
    assert.equal(p.precio.lista, undefined, "un tachado igual al precio confunde");
    assert.equal(p.precio.actual, 100);
  });

  it("usa description como nombre en documentos viejos", () => {
    const p = normalizarProducto({ id: "X3", description: "Smartwatch T500" })!;
    assert.equal(p.name, "Smartwatch T500");
    // Y no lo repite como descripción aparte.
    assert.equal(p.description, undefined);
  });

  it("ordena los bullets por el campo order del POS", () => {
    const p = normalizarProducto(docCompleto)!;
    assert.deepEqual(
      p.bullets.map((b) => b.texto),
      ["Primer bullet", "Segundo bullet"],
    );
  });

  it("unifica la galería: strings y objetos conviven", () => {
    const p = normalizarProducto(docCompleto)!;
    const urls = p.media.gallery!.map((g) => g.url);
    // La hero va primero y no se duplica.
    assert.equal(urls[0], "https://i.imgur.com/abc.jpg");
    assert.equal(urls.length, 3);
    assert.equal(p.media.gallery![2].label, "A oscuras");
  });

  it("descarta URLs de imagen inválidas", () => {
    const p = normalizarProducto({
      id: "X4",
      name: "Algo",
      media: { heroImage: "  ", gallery: ["no-es-una-url", "", null, { url: 42 }] },
    })!;
    assert.equal(p.media.heroImage, undefined);
    assert.deepEqual(p.media.gallery, []);
  });

  it("acepta imágenes en base64 si el POS las manda", () => {
    const p = normalizarProducto({
      id: "X5",
      name: "Algo",
      imageBase64: "data:image/png;base64,iVBORw0KGgo=",
    })!;
    assert.ok(p.media.heroImage?.startsWith("data:image/"));
  });

  it("junta las specs sueltas de la raíz con las del objeto", () => {
    const p = normalizarProducto({
      id: "X6",
      name: "Proyector viejo",
      lumens: 200,
      resolucion: "720p",
    })!;
    assert.equal(p.specs?.ansi, 200, "lumens debe caer en ansi");
    assert.equal(p.specs?.resolucion, "720p");
  });

  it("deja specs en undefined cuando no hay ninguna", () => {
    const p = normalizarProducto({ id: "X7", name: "Parlante simple" })!;
    assert.equal(p.specs, undefined);
  });

  describe("disponibilidad", () => {
    it("respeta el booleano calculado del espejo", () => {
      assert.equal(normalizarProducto({ id: "a", name: "n", disponible: false })!.disponible, false);
    });

    it("cae a stock cuando no hay booleano", () => {
      assert.equal(normalizarProducto({ id: "a", name: "n", stock: 0 })!.disponible, false);
      assert.equal(normalizarProducto({ id: "a", name: "n", stock: 3 })!.disponible, true);
    });

    it("saca del catálogo lo marcado como no publicar", () => {
      assert.equal(normalizarProducto({ id: "a", name: "n", publicar: false }), null);
    });
  });

  it("descarta documentos sin id o sin nombre", () => {
    assert.equal(normalizarProducto({ name: "Sin id" }), null);
    assert.equal(normalizarProducto({ id: "sin-nombre" }), null);
  });
});

// ---------------------------------------------------------------------------
describe("precios y cuotas", () => {
  it("redondea el precio a la decena de córdobas", () => {
    // 199 × 36.6243 = 7288.2 → 7290
    assert.equal(cordobas(199, TASA), "C$7,290");
  });

  it("dice Consultar cuando no hay precio", () => {
    assert.equal(cordobas(undefined, TASA), "Consultar");
  });

  // El 0% dejó de ser parejo: los proyectores lo mantienen y las demás
  // categorías llevan recargo. Ver src/lib/financiamiento.ts.
  const CFG = CONFIG_FINANCIAMIENTO_DEFAULT;
  const planes = (usd: number | undefined, categoria: string) =>
    calcularPlanes(usd, TASA, { config: CFG, categoria });

  it("no ofrece cuotas por debajo del mínimo", () => {
    assert.deepEqual(planes(99, "proyector"), []);
  });

  it("ofrece cuotas justo en el mínimo", () => {
    assert.equal(planes(100, "proyector").length, 2);
  });

  it("en proyectores divide el precio entre los meses, sin recargo", () => {
    const p = planes(199, "proyector");
    assert.deepEqual(
      p.map((x) => ({ meses: x.meses, cuotaNio: x.cuotaNio })),
      [
        { meses: 3, cuotaNio: 2430 },
        { meses: 6, cuotaNio: 1215 },
      ],
    );
    assert.ok(todosSinInteres(p));
    // Sin recargo: 3 cuotas × monto ≈ precio de contado.
    assert.ok(Math.abs(p[0].cuotaNio * 3 - 199 * TASA) < 5);
  });

  it("en las demás categorías suma el recargo al total, no al precio de lista", () => {
    const p = planes(199, "smartwatch");
    assert.equal(p[0].recargoPct, 3);
    assert.equal(p[1].recargoPct, 6);
    assert.ok(!todosSinInteres(p));
    // El total a plazos supera al de contado; el precio de lista no cambió.
    assert.ok(p[0].totalNio > 199 * TASA);
    assert.ok(p[1].totalNio > p[0].totalNio);
  });

  it("el total mostrado siempre es cuota × meses", () => {
    for (const categoria of ["proyector", "smartwatch", "dashcam"]) {
      for (const x of planes(199, categoria)) {
        assert.equal(x.cuotaNio * x.meses, x.totalNio, `${categoria} a ${x.meses} meses`);
      }
    }
  });

  it("la cuota mínima es la del plazo más largo", () => {
    const min = planMasBajo(planes(199, "proyector"));
    assert.equal(min?.meses, 6);
    assert.equal(min?.cuotaNio, 1215);
    assert.equal(planMasBajo(planes(50, "proyector")), null);
  });

  it("solo los proyectores se anuncian como 0% interés", () => {
    assert.equal(esCategoriaSinInteres(CFG, "proyector"), true);
    for (const c of ["smartwatch", "camara", "dashcam", "parlante", "smarthome"]) {
      assert.equal(esCategoriaSinInteres(CFG, c), false, c);
    }
  });

  it("calcula el porcentaje de descuento", () => {
    assert.equal(porcentajeDescuento(250, 199), 20);
    assert.equal(porcentajeDescuento(100, 100), null);
    assert.equal(porcentajeDescuento(undefined, 100), null);
  });

  it("arma un beneficio corto con las specs cuando el POS no cargó uno", () => {
    const resumen = beneficioDesdeSpecs([
      { valor: "1100 lúmenes ANSI" },
      { valor: "1080p Full HD" },
      { valor: "12 W, suficiente para una sala" },
    ]);
    assert.equal(resumen, "1100 lúmenes ANSI · 1080p Full HD");
  });

  it("no inventa un beneficio si no hay specs", () => {
    assert.equal(beneficioDesdeSpecs([]), undefined);
  });
});

// ---------------------------------------------------------------------------
describe("enlaces", () => {
  it("arma el WhatsApp con el producto y el SKU", () => {
    const link = linkWhatsApp("50583725528", { name: "Proyector HY310X", sku: "PRY-1" });
    assert.ok(link.startsWith("https://wa.me/50583725528?text="));
    const texto = decodeURIComponent(link.split("text=")[1]);
    assert.ok(texto.includes("Proyector HY310X"));
    assert.ok(texto.includes("PRY-1"));
  });

  it("funciona sin producto, para el botón general", () => {
    const link = linkWhatsApp("50583725528");
    assert.ok(link.includes("text="));
  });

  it("no pregunta '¿Está disponible?' si el producto está agotado", () => {
    const link = linkWhatsApp("50583725528", {
      name: "Proyector HY310X",
      sku: "PRY-1",
      disponible: false,
    });
    const texto = decodeURIComponent(link.split("text=")[1]);
    assert.ok(!texto.includes("¿Está disponible?"));
    assert.ok(texto.includes("Avísenme cuando llegue"));
    assert.ok(texto.includes("Proyector HY310X"));
    assert.ok(texto.includes("PRY-1"));
  });

  it("escapa caracteres especiales del nombre", () => {
    const link = linkWhatsApp("505", { name: "Proyector 4K & HDR" });
    assert.ok(!link.includes(" & "), "un & sin escapar rompe el mensaje");
  });

  it("extrae el id de YouTube en cualquier formato", () => {
    assert.equal(youTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    assert.equal(youTubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    assert.equal(youTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    assert.equal(youTubeId("https://vimeo.com/123"), null);
    assert.equal(youTubeId(undefined), null);
  });
});
