// Capturas de la UI con Edge (o Chrome) vía DevTools Protocol. Sirve para
// revisar cambios visuales en los anchos reales de un teléfono (360/390px:
// `msedge --screenshot` no baja de ~500), en los dos temas, pasando el mouse,
// haciendo clic y midiendo el DOM. Es la herramienta con la que se verificaron
// las fases de docs/plan-mejora-visual.md.
//
// SIEMPRE contra el servidor con datos de prueba, nunca contra producción ni
// contra un dev que lea Firestore (la cuota se comparte con la tienda y el POS):
//   CATALOG_SOURCE=fixture npm run dev
//   node scripts/capturar.mjs .capturas/antes http://localhost:3000 scripts/capturas-base.json
//
// Uso: node scripts/capturar.mjs <carpeta-salida> <base-url> <plan.json> [puerto] [archivo.css|-] [archivo.js|-]
// [puerto]: puerto de depuración del navegador (por defecto 9333). Si corren
//   varias capturas a la vez, cada una necesita el suyo (y usa su propio perfil).
// [archivo.css]: hoja de estilo que se inyecta después de CADA carga de página,
//   para previsualizar una propuesta en todas las tomas sin tocar el código.
// [archivo.js]: script que se evalúa después de cada carga (y del css), para
//   previsualizar cambios de marcado o simular estados (p. ej. una foto que
//   falla). Se envuelve en una función: puede usar `return` y `document`.
// NAVEGADOR (variable de entorno): ruta del ejecutable, si no es el Edge de
//   Windows por defecto.
// Siempre se oculta el indicador de desarrollo de Next ("N" abajo a la izquierda).
//
// plan.json: [{ nombre, ruta, ancho, alto, tema, css?, pasos: [...], clip? }]
//   tema: "dark" | "light" (se guarda en localStorage como lo hace el sitio).
//   ruta: si falta, la toma sigue sobre la página de la toma anterior.
//   css: hoja de estilo para esa toma (queda puesta para las siguientes sin `ruta`).
//   pasos: { hover: "selector-js" } | { click: "selector-js" } | { esperar: ms }
//        | { scroll: y } | { arriba: "selector-js", margen?: px } | { eval: "js" }
//   "selector-js" es una expresión que devuelve un Element.
//   arriba: desplaza la página para que el elemento quede arriba, debajo del
//        header (margen por defecto 140px).
//   eval: imprime lo que devuelve (medir el DOM, contar elementos…).
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [salida, base, planRuta, puertoArg, cssArg, jsArg] = process.argv.slice(2);
if (!salida || !base || !planRuta) {
  console.error("Uso: node scripts/capturar.mjs <carpeta-salida> <base-url> <plan.json> [puerto] [archivo.css|-] [archivo.js|-]");
  process.exit(1);
}
const plan = JSON.parse(readFileSync(planRuta, "utf8"));
const cssGlobal = cssArg && cssArg !== "-" ? readFileSync(cssArg, "utf8") : "";
const jsGlobal = jsArg && jsArg !== "-" ? readFileSync(jsArg, "utf8") : "";
mkdirSync(salida, { recursive: true });

const NAVEGADOR =
  process.env.NAVEGADOR ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PUERTO = Number(puertoArg ?? 9333);
const navegador = spawn(
  NAVEGADOR,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PUERTO}`,
    `--user-data-dir=${join(salida, `perfil-cdp-${PUERTO}`)}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function objetivo() {
  for (let i = 0; i < 50; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json();
      const pag = lista.find((t) => t.type === "page");
      if (pag) return pag.webSocketDebuggerUrl;
    } catch {
      // Todavía no abrió el puerto: se reintenta.
    }
    await dormir(200);
  }
  throw new Error("El navegador no abrió el puerto de depuración");
}

const ws = new WebSocket(await objetivo());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pendientes = new Map();
const eventos = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pendientes.has(m.id)) {
    const { resolver, rechazar } = pendientes.get(m.id);
    pendientes.delete(m.id);
    if (m.error) rechazar(new Error(m.error.message));
    else resolver(m.result);
  } else if (m.method) eventos.push(m.method);
});
const cdp = (method, params = {}) =>
  new Promise((resolver, rechazar) => {
    const n = ++id;
    pendientes.set(n, { resolver, rechazar });
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluar = async (expr) => {
  const r = await cdp("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) {
    throw new Error(`${expr}: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
  }
  return r.result.value;
};

async function cargar(url) {
  eventos.length = 0;
  await cdp("Page.navigate", { url });
  for (let i = 0; i < 150 && !eventos.includes("Page.loadEventFired"); i++) await dormir(100);
  // Fotos: next/image en dev las optimiza en la primera visita, tarda.
  for (let i = 0; i < 60; i++) {
    const listas = await evaluar("Array.from(document.images).every(i => i.complete)");
    if (listas) break;
    await dormir(250);
  }
  await dormir(600);
  const css = "nextjs-portal { display: none !important; }\n" + cssGlobal;
  await evaluar(
    `(() => { const s = document.createElement("style"); s.id = "css-global"; s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); return true; })()`,
  );
  if (jsGlobal) {
    const r = await evaluar(`(() => { ${jsGlobal}\n })()`);
    if (r !== undefined) console.log("js →", JSON.stringify(r));
  }
  await dormir(300);
}

// El sitio usa `scroll-behavior: smooth`: sin behavior "instant", el rect se
// medía antes de que terminara el desplazamiento y el mouse caía en otro lado.
async function centro(selector) {
  await evaluar(
    `(() => { const el = ${selector}; if (!el) throw new Error("no encontré: " + ${JSON.stringify(selector)}); el.scrollIntoView({ block: "center", behavior: "instant" }); })()`,
  );
  await dormir(150);
  return evaluar(
    `(() => { const r = (${selector}).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`,
  );
}

await cdp("Page.enable");
await cdp("Runtime.enable");

let temaActual = null;
for (const toma of plan) {
  const movil = toma.ancho < 640;
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: toma.ancho,
    height: toma.alto,
    deviceScaleFactor: 1,
    mobile: movil,
  });
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: movil });
  if (toma.tema !== temaActual) {
    await cargar(base + "/");
    await evaluar(`localStorage.setItem("pandaweb-tema", ${JSON.stringify(toma.tema)})`);
    temaActual = toma.tema;
  }
  if (toma.ruta) await cargar(base + toma.ruta);
  if (toma.css) {
    await evaluar(
      `(() => { let s = document.getElementById("css-propuesta"); if (!s) { s = document.createElement("style"); s.id = "css-propuesta"; document.head.appendChild(s); } s.textContent = ${JSON.stringify(toma.css)}; return true; })()`,
    );
    await dormir(300);
  }
  for (const paso of toma.pasos ?? []) {
    if (paso.hover) {
      const { x, y } = await centro(paso.hover);
      await cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
      await dormir(450);
    } else if (paso.click) {
      await evaluar(`(${paso.click}).click()`);
      await dormir(450);
    } else if (paso.scroll != null) {
      await evaluar(`window.scrollTo({ top: ${paso.scroll}, behavior: "instant" })`);
      await dormir(300);
    } else if (paso.arriba) {
      const margen = paso.margen ?? 140;
      await evaluar(
        `(() => { const el = ${paso.arriba}; if (!el) throw new Error("no encontré: " + ${JSON.stringify(paso.arriba)}); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ${margen}, behavior: "instant" }); })()`,
      );
      await dormir(400);
    } else if (paso.esperar) {
      await dormir(paso.esperar);
    } else if (paso.eval) {
      console.log(toma.nombre, "→", JSON.stringify(await evaluar(paso.eval)));
    }
  }
  const { data } = await cdp("Page.captureScreenshot", {
    format: "png",
    ...(toma.clip && { clip: { ...toma.clip, scale: 1 } }),
  });
  writeFileSync(join(salida, toma.nombre + ".png"), Buffer.from(data, "base64"));
  console.log("ok", toma.nombre);
}

ws.close();
navegador.kill();
process.exit(0);
