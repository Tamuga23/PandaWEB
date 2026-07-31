# PandaWEB — Plan del proyecto

**Fecha:** 2026-07-29
**Estado:** Fases 1–3 construidas. Fase 0 (seguridad) pendiente y **bloqueante
para publicar**. La web funciona hoy en local con datos reales.
**Repos relacionados:** `PandaFactoryPOS-main` (POS, fuente de verdad) · `PandaLink` (asistente de venta en tablet)

---

## 1. Objetivo

Catálogo virtual público de **Panda Store**, dirigido al cliente final. Muestra la misma información comercial que ve el asesor en PandaLink — características, imágenes, cuotas Banpro, disponibilidad — en una interfaz moderna, rápida en teléfono y consistente con la marca.

No procesa pagos todavía. Cada producto tiene un CTA que abre WhatsApp con un mensaje prellenado para que un asesor cierre la venta.

**Éxito v1** = un cliente encuentra un producto en Google, lo abre en su teléfono en menos de 3 segundos, entiende precio y cuotas, y escribe por WhatsApp sabiendo qué quiere.

---

## 2. Usuarios

| Quién | Qué hace |
|---|---|
| Cliente final (móvil, Nicaragua) | Navega, filtra, compara, consulta por WhatsApp |
| Asesor de ventas | Recibe el mensaje con el producto y SKU ya identificados |
| Carlos (admin) | Edita productos en el POS; la web se actualiza sola |

**El admin nunca toca el repo de PandaWEB para cambiar contenido.** Todo el contenido de producto se administra desde el POS.

---

## 3. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Stack | Next.js (App Router) + Tailwind + TypeScript |
| Fuente de datos | Firestore `catalogo_publico`, **lectura pública** |
| Seguridad | Se abre el espejo y **se cierran `products` y `sales`** en la misma tanda |
| Imágenes | URLs de Imgur ya cargadas en el catálogo maestro (migración a Cloudinary como deuda técnica) |
| Plan Firebase | **Spark** (sin Storage, sin Cloud Functions) |
| Frescura | Backfill automático diario mediante tarea programada |
| Precios visibles | Precio actual en C$ + cuotas Banpro. **El precio de efectivo NO se publica** |
| WhatsApp | +505 8372 5528, mensaje prellenado con producto y SKU |
| Hosting | Vercel, subdominio gratis; dominio propio después |
| Diseño | Oscuro, base zinc, acento cyan, emerald para precios |
| Alcance v1 | Catálogo + landing institucional |

---

## 4. Arquitectura

```
POS (Carlos edita productos)
        │  escribe
        ▼
  Firestore: products  ──── cost, stock real ──── CERRADO a admin
        │
        │  scripts/backfill_catalogo_publico.mjs  (Admin SDK, diario automático)
        ▼
  Firestore: catalogo_publico  ──── sin cost ──── LECTURA PÚBLICA
        │                    │
        │ lee                │ lee (sesión anónima)
        ▼                    ▼
   PandaWEB (Next.js)     PandaLink (tablet)
        │
        └──► WhatsApp +505 8372 5528
```

**Punto clave:** PandaWEB no inventa un modelo de datos nuevo. Consume el mismo espejo `catalogo_publico` que ya alimenta PandaLink, con el mismo normalizador de esquema. Un solo lugar donde arreglar los datos beneficia a los tres.

**Proyecto Firebase compartido**
- `projectId`: `gen-lang-client-0460782288`
- Base de datos **nombrada**: `ai-studio-5c0f20d4-1ed2-4741-aa36-9644b15dbb81` (us-east1)
- Obligatorio pasar el ID de base como tercer argumento de `initializeFirestore`. Es el error nº1 al conectar.

**Renderizado:** páginas estáticas con revalidación (ISR) leyendo Firestore desde el servidor. Da SEO, velocidad y vistas previas con foto al compartir por WhatsApp. La disponibilidad se refresca en el cliente al abrir la ficha, para no mostrar "Disponible" sobre un dato de hace horas.

---

## 5. Modelo de datos consumido

De `catalogo_publico/{id}` (definido en `PandaFactoryPOS-main/src/types.ts` → `PublicCatalogProduct`):

```ts
{
  id, sku, name, description?, category, categorySlug,
  precio: { lista, promo?, actual, descEfectivoPct?, efectivo },  // USD
  disponible: boolean,        // stock > 0 && publicar !== false
  campania?, beneficio?,
  bullets?: [{ text, icon?, order? }],
  specsProyector?: { ansi?, throwRatio?, resolucion?, autofoco?, ... },
  media?: { heroImage?, gallery?: (string|{url,label})[], videoUrl? },
  updatedAt
}
```

**Reglas de exposición**
- `cost` no existe en el espejo y nunca debe existir. Regla dura.
- `precio.efectivo` **llega en el documento pero NO se renderiza en la web**. Es la carta del asesor al cerrar. Debe filtrarse en la capa de datos del servidor, no solo ocultarse en la UI — si viaja al navegador, es visible en el HTML.
- `stock` numérico no se publica: solo el booleano `disponible`.

**Categorías reales:** `proyector`, `dashcam`, `smartwatch`, `smarthome`, `camara`, `parlante`.
Hay un doble esquema ES/EN heredado (PandaLink mapea solo tres slugs y deja `dashcam` sin mapear). PandaWEB debe normalizar las seis, y conviene unificarlo también en PandaLink.

---

## 6. Reglas de negocio

**Precio en pantalla**
- Tasa `USD_TO_NIO = 36.6243`. Hoy está duplicada en tres lugares. **PandaWEB la lee de `company/shared_store.defaultExchangeRate`**, no la hardcodea.
- Se muestra el precio en C$ redondeado a la decena. Si hay `promo`, se muestra el de lista tachado.

**Cuotas Banpro**
- Solo si `precio.actual >= USD 100`
- Plazos: 3 y 6 meses · 0% interés · sin prima
- `cuota = precio.actual × tasa / meses`, redondeada al córdoba
- En la tarjeta del catálogo se muestra la cuota más baja: "desde C$X/mes"

**Disponibilidad**
- `disponible: true` → "Disponible" (verde) + CTA "Consultar por WhatsApp"
- `disponible: false` → "Agotado" (rojo) + CTA "Avisarme cuando llegue"
- Nota permanente en la ficha: precio y disponibilidad se confirman por WhatsApp

**WhatsApp**
`https://wa.me/50583725528?text=` con: `Hola, me interesa el {name} (SKU {sku}) que vi en la web.`
El número vive en **un solo archivo de configuración**.

**Garantía:** 3 meses, dato ya establecido en el POS.

---

## 7. Alcance v1

**Landing**
Hero con propuesta de valor · destacados · categorías · financiamiento Banpro · ubicación con mapa (Camino de Oriente, detrás de INISER, Colectivo Dreamy) · garantía y formas de pago · footer con contacto

**Catálogo**
Grid responsive · filtro por categoría · orden por precio · buscador por nombre y SKU · disponibles primero · estados de carga y de vacío

**Ficha de producto**
Galería con zoom · nombre, SKU, beneficio · precio y cuotas · bullets de venta · specs (tabla adaptada por categoría) · video de YouTube si existe · badge de disponibilidad · CTA WhatsApp fijo en móvil · relacionados de la misma categoría

**Transversal**
Metadatos Open Graph por producto (vista previa con foto al compartir por WhatsApp) · sitemap · datos estructurados de producto para Google · analítica

### Fuera de v1
Carrito · pasarela de pagos · cuentas de usuario · reseñas · blog · multi-idioma

---

## 8. Fases

**Fase 0 — Seguridad y datos** *(bloqueante, va primero)*
1. Reescribir `firestore.rules`: `catalogo_publico` y objeciones con lectura pública; `products`, `sales`, `purchases`, `customers` solo admin
2. Login admin con email en el POS + custom claim `admin`
3. Rotar la llave de service account expuesta en el repo del POS
4. Verificar que PandaLink sigue funcionando tras el cambio

**Fase 1 — Base de PandaWEB**
Scaffold Next.js · cliente Firestore con la base nombrada · capa de datos que filtra `efectivo` · normalizador de esquema compartido · sistema de diseño (colores, tipografía, componentes)

**Fase 2 — Catálogo**
Grid, filtros, buscador, ficha, galería, cuotas, WhatsApp

**Fase 3 — Landing y pulido**
Secciones institucionales · SEO y Open Graph · rendimiento · pruebas en móvil real

**Fase 4 — Publicación**
Deploy en Vercel · tarea programada del backfill diario · analítica · revisión final

**Después:** dominio propio · migrar imágenes a Cloudinary · carrito y pasarela · pasar a Blaze para sincronización en vivo

---

## 9. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Reglas abiertas a anónimos exponen `cost` y `sales` | **Crítico** | Fase 0 antes de publicar nada |
| Service account en el repo del POS | **Crítico** | Rotar la llave en Google Cloud Console |
| Imgur bloquea el hotlinking o borra imágenes | Alto | Imagen de reemplazo + migración planificada a Cloudinary |
| Backfill no corre (PC apagada) → datos viejos | Alto | Indicador de "actualizado hace X" + la nota de confirmar por WhatsApp |
| Productos sin foto se ven rotos en el grid | Alto | Auditar cobertura de imágenes antes de publicar; ocultar los que no tengan |
| Cerrar reglas rompe PandaLink | Medio | Probar la tablet en el mismo despliegue |
| Índice compuesto faltante en Firestore | Bajo | Filtrar en cliente, como ya hace PandaLink |

---

## 10. Criterios de calidad

- Carga inicial bajo 3 s en 4G nicaragüense; Lighthouse móvil ≥ 90 en rendimiento y SEO
- Ninguna respuesta del servidor contiene `cost` ni `efectivo` — verificable inspeccionando el HTML
- Compartir un producto por WhatsApp muestra foto, nombre y precio
- Todo funciona con el pulgar en una pantalla de 360 px
- Cambiar un precio en el POS se refleja en la web en menos de 24 h
- Cero textos en inglés de cara al cliente

---

## 11. Pendientes

1. **Logo de Panda Store en alta resolución.** El archivo actual (`Logo Panda Store.png`) dice "PandaLink" — es la marca de la herramienta interna, no la comercial. Hace falta el logotipo de la tienda, idealmente en SVG.
2. **Auditar cobertura de imágenes**: cuántos productos publicables tienen `heroImage` cargada. Define si hay catálogo suficiente para publicar.
3. **Dominio**: confirmar si existe uno o hay que registrarlo.
4. La campaña `"🎯 Mundial 2026"` venció el 2026-07-19. Definir si se retira o se reemplaza.
5. Horario de atención, para mostrarlo junto al CTA de WhatsApp.

---

## 12. Siguiente acción

Correr `npm install && npm run dev` y revisar el sitio con los datos reales del catálogo. Eso responde de una vez las dos preguntas abiertas: cuántos productos tienen foto y qué tan al día está el espejo.

Después, y **antes de publicar**, la Fase 0: hoy cualquier visitante anónimo puede leer los costos y todas las ventas, y una web pública solo amplifica esa exposición.

---

## 13. Estado de la construcción

**Hecho**

- Proyecto Next.js 16 + React 19 + Tailwind 4, tema oscuro con acento cyan
- Capa de datos por REST en el servidor, con los dos modos de acceso (`anon` hoy, `public` tras la Fase 0)
- Normalizador que cubre los tres esquemas de documento que existen en la base y canoniza las seis categorías
- Portada, catálogo con filtros y buscador, ficha de producto con galería y video
- Cuotas Banpro con la misma fórmula que PandaLink, leyendo la tasa de `company/shared_store`
- CTA de WhatsApp con producto y SKU prellenados; barra fija en móvil
- Open Graph por producto, datos estructurados para Google, sitemap
- Indexación bloqueada mientras la web no sea pública
- 36 pruebas sobre la lógica de datos, incluidas las que verifican que `cost` y `efectivo` no se filtren

**Verificado**

- Tipos: `tsc` sin errores sobre la lógica de datos
- Pruebas: 36/36 en verde

**Sin verificar todavía** (no se pudo desde el entorno de trabajo)

- `next build` completo
- Conexión real a Firestore: el proxy del entorno bloquea `googleapis.com`. Se comprueba con `npm run dev` en tu máquina.
