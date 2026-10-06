# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Cliente final** (móvil, Managua/Nicaragua): navega el catálogo, filtra por categoría, compara productos, y consulta por WhatsApp cuando decide. Llega mayormente desde un anuncio de Google (Búsqueda / Máximo Rendimiento) o, cada vez más, desde búsqueda orgánica — el sitio recién se abrió a indexación.
- **Asesor de ventas**: recibe el mensaje de WhatsApp con el producto y el SKU ya identificados, y cierra la venta en la conversación (precio de efectivo, condiciones finales, entrega).
- **Carlos (dueño/admin)**: edita productos, precios, stock y reglas de financiamiento desde el POS (`PandaFactoryPOS`). Nunca toca este repo para cambiar contenido comercial.

## Product Purpose

Catálogo virtual público de **Panda Store** (tecnología para el hogar y el negocio: proyectores, cámaras de seguridad, dashcams, smartwatches, parlantes, smart home, smart TV). Muestra la misma información comercial que ve el asesor en PandaLink — características, imágenes, precio, cuotas, disponibilidad — en una interfaz rápida en teléfono y consistente con la marca.

No procesa pagos ni tiene carrito. Cada producto lleva un CTA que abre WhatsApp con un mensaje prellenado (producto + SKU) para que un asesor humano cierre la venta.

**Éxito:** un cliente encuentra un producto (por Google Ads o, ahora, por búsqueda orgánica), lo abre en el teléfono en menos de 3 segundos, entiende precio y cuota mensual, y escribe por WhatsApp sabiendo exactamente qué quiere.

## Positioning

No compite por ser una tienda online con checkout — compite por ser la vidriera más rápida y confiable que termina en una conversación real. La conversión que importa no es "agregar al carrito", es "escribir por WhatsApp sabiendo qué producto y qué cuota". El precio de efectivo (el margen real de negociación del asesor) nunca se publica: es la ventaja que tiene el humano para cerrar.

## Operating Context

- **Fuente de datos compartida**: Firestore (proyecto `gen-lang-client-0460782288`, base nombrada), el mismo que usan el POS y PandaLink. PandaWEB lee `catalogo_publico` (espejo sin `cost` ni `precio.efectivo`), `config/financiamiento`, y `company/shared_store` (tasa de cambio, datos del negocio).
- **El backfill POS → `catalogo_publico` es manual**: Carlos corre `npm run backfill` en el repo del POS después de cambiar precios o stock. No hay tarea programada ni Cloud Functions (plan Firebase **Spark**, sin Storage ni Functions). Cambiar un precio en el POS puede tardar hasta que alguien corra el backfill en reflejarse acá.
- **Hosting**: Vercel (`panda-web-nine.vercel.app`, dominio propio pendiente). Páginas server-rendered con revalidación (ISR, 15 min) leyendo Firestore vía REST desde el servidor — no el SDK cliente de Firebase, así el navegador no carga nada de Firebase y las páginas quedan indexables.
- **Seguridad ya resuelta (2026-09-11)**: las reglas de Firestore exigen el custom claim `admin` para `products`/`sales`/etc.; solo `catalogo_publico`, `config`, y el `get()` puntual de `company/shared_store` son de lectura pública. La service account key del repo del POS ya fue rotada.
- **El sitio ya es público**: `robots.txt` permite indexación, verificado en Google Search Console, sitemap enviado (incluye home, catálogo, las 7 categorías con productos, y cada ficha).
- **Medición activa**: Google Ads (`AW-18193920387`) mide "Clic en WhatsApp" como conversión Principal, y "Llamada telefónica", "Cómo llegar" y "Ver ficha de producto" como Secundarias. Se atribuye el `gclid` del anuncio al mensaje de WhatsApp (ventana de 90 días) para poder importar ventas cerradas más adelante.

## Capabilities and Constraints

- **Categorías reales** (siete, canonizadas en español): `proyector`, `camara`, `dashcam`, `smartwatch`, `parlante`, `smarthome`, `smarttv`. PandaLink todavía usa un esquema parcialmente en inglés y deja `dashcam` sin mapear — deuda técnica de ese repo, no de este.
- **Precio**: se muestra el precio actual en córdobas (redondeado a la decena) más la cuota mensual. El precio de lista tachado aparece solo si hay una promo activa cargada en el POS. **El precio de efectivo (`precio.efectivo`) nunca llega al HTML** — se descarta en la capa de datos del servidor, no solo se oculta en la UI. `cost` tampoco existe en el espejo público. Ambas reglas tienen pruebas automatizadas que las verifican.
- **Financiamiento (Banpro)** — cambió respecto al plan original: ya **no** es 0% parejo para todo. Los plazos, el mínimo de compra y el recargo por categoría viven en Firestore (`config/financiamiento`, editable desde el POS) y se calculan una sola vez en el servidor. Solo los **proyectores** están confirmados en 0% de interés hoy; otras categorías pueden llevar recargo. Ningún texto del sitio puede prometer "sin intereses" de forma general — el badge "0% interés" se muestra producto por producto, solo cuando aplica de verdad.
- **Disponibilidad**: booleano público (`disponible`), nunca el stock numérico exacto. "Disponible" → CTA "Lo quiero"/"Consultar por WhatsApp"; "Agotado" → CTA "Avisarme cuando llegue".
- **Fuera de alcance (v1)**: carrito, pasarela de pagos, cuentas de usuario, reseñas, blog, multi-idioma. Cero texto en inglés de cara al cliente.
- **Garantía**: 3 meses, dato fijo establecido en el POS (no configurable desde acá).
- **Rendimiento objetivo**: carga inicial bajo 3 s en 4G nicaragüense; pensado primero para una pantalla de ~360px operado con el pulgar.

## Brand Commitments

- Nombre comercial: **Panda Store**. Tagline: "Tecnología para tu casa y tu negocio".
- Logo real de Panda Store ya está en uso (`public/logo.png`) — el marcador de PandaLink que señalaba el plan original ya fue reemplazado.
- Contacto único de venta: WhatsApp **+505 8372 5528** (número real del negocio, vive en un solo archivo de configuración). El mensaje prellenado siempre identifica el producto por nombre y SKU.
- Ubicación real: Colectivo Dreamy, Camino de Oriente, detrás de INISER, Managua — con coordenadas exactas (no el pin del punto de referencia, que queda a varias cuadras).
- Redes: Instagram y Facebook reales, enlazadas en el footer y en los datos estructurados (`sameAs`) para Google.

## Evidence on Hand

- Catálogo real vía el espejo Firestore (`catalogo_publico`), no datos de muestra.
- WhatsApp, dirección, coordenadas de Maps, redes sociales: todos reales, ya cargados en `src/config/site.ts`.
- Cuenta de Google Ads real y activa (`117-281-0027` / `AW-18193920387`), con campaña de Máximo Rendimiento corriendo desde 2026-05-27.
- **Ausente, no inventar**: no hay testimonios de clientes, casos de estudio, ni menciones de prensa. No hay carrito ni historial de compra propio del sitio (las ventas se cierran y registran fuera, por WhatsApp y en el POS).

## Product Principles

1. **El admin nunca toca este repo para cambiar contenido.** Todo precio, stock y texto de producto se edita en el POS; un deploy de código nunca debería ser el camino para corregir un precio.
2. **Ninguna promesa financiera puede ser más generosa que la real.** Un fallback de datos (tasa de cambio, reglas de financiamiento) nunca puede mostrar mejores condiciones que las vigentes — mejor una cifra vieja que una promesa falsa de 0% de interés.
3. **`cost` y `precio.efectivo` no salen del servidor, nunca.** Es la regla de negocio más dura del proyecto: el margen de negociación del asesor es lo que permite cerrar por WhatsApp.
4. **La conversación de WhatsApp es el producto, no un accesorio.** Cualquier fricción entre "encontrar el producto" y "escribir por WhatsApp sabiendo qué pedir" es un defecto, no un detalle menor.
5. **Un solo dato, consumido por tres sistemas.** PandaWEB no inventa su propio modelo de datos: lee el mismo espejo y el mismo normalizador que ya usa PandaLink, para que arreglar un problema de datos beneficie a los tres a la vez.
