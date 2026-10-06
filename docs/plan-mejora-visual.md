# Plan: mejora visual de PandaWEB

Plan vivo: se actualiza y se commitea en cada paso, para poder retomar desde
acá si la sesión se corta. Las reglas de diseño están en [DESIGN.md](../DESIGN.md).

**Forma de trabajo:** una rama y un PR por fase; commit + push después de cada
paso que funcione. Fusionar a `main` solo con permiso explícito.

## Estado

| Fase | Qué | Estado |
|---|---|---|
| 0 | Mirar el sitio antes de tocarlo | Hecha (2026-10-05) |
| 1 | Datos de prueba locales (`CATALOG_SOURCE=fixture`) | Hecha y en producción (2026-10-05) — PR #46 |
| 2 | Profundidad: tokens de elevación | Hecha y en producción (2026-10-05) — PR #47 |
| 3 | Portada con producto real (vitrina en el hero + categorías con íconos) | Hecha y en producción (2026-10-05) — PR #48 |
| 4 | Catálogo: tratamiento de fotos (bandeja de foto) | Hecha (2026-10-06) — rama `mejora-visual-fase-4`, PR pendiente de fusionar |
| 5 | Cierre: limpiar `bg-marca-hover`, actualizar DESIGN.md | Pendiente |

## Fase 0 — lo que se vio (capturas de producción, tema oscuro)

- **Portada en móvil:** en las primeras dos pantallas no aparece ni un producto.
  Hero de solo texto → 4 ventajas apiladas → tarjetas de categoría sin foto, a
  una columna. Lo primero con foto ("Lo más pedido") queda muy abajo.
- **Portada en escritorio:** above the fold solo hay texto centrado, el
  resplandor cyan y mucho espacio vacío. Ningún producto.
- **Catálogo:** todas las fotos con foto tienen fondo blanco de estudio (en la
  captura de móvil parecía que el smartwatch y la dashcam eran fotos oscuras;
  la de escritorio lo desmintió). En tema oscuro cada tarjeta es un cuadrado
  blanco: el elemento más brillante de la pantalla, por encima del precio.
- **Agotados sin foto:** 12 de los 19 agotados no tienen ninguna imagen cargada
  en el POS (galería vacía), así que la sección "Agotados" es casi toda
  marcadores "Sin foto". Las fotos se cargan en el POS; acá solo se puede hacer
  que el marcador se vea mejor. Ambas cosas van a la Fase 4.
- **Descartado:** el fundido en la fila de categorías. La píldora cortada en el
  borde ya indica que se puede deslizar.
- **Ojo con las capturas:** Edge en modo headless no achica la ventana por
  debajo de ~500px. Una captura a 390px sale recortada a la derecha, pero no es
  un desborde real del sitio.

## Fase 1 — datos de prueba locales

**Por qué:** dev local, producción y el POS comparten la cuota de Firestore
(plan Spark, 50k lecturas/día). Una verificación visual con `next dev` contra
datos reales la agotó el 2026-10-04 y dejó caído el catálogo de producción.

- `CATALOG_SOURCE=fixture` → `getCatalogo` sirve `src/lib/fixture-catalogo.json`
  en vez de leer Firestore. Las cuotas se recalculan con el código actual.
- El JSON sale del catálogo público de producción (lo que ya ve cualquiera en
  el HTML): sin `cost` ni `precio.efectivo`, con un test que lo verifica.
- Con `VERCEL_ENV=production` el modo se niega a arrancar: precios de prueba en
  producción serían una promesa falsa.

**Verificado:** 56/56 pruebas; typecheck limpio; `CATALOG_SOURCE=fixture npm
run build` genera las 39 páginas sin leer Firestore; el mismo build con
`VERCEL_ENV=production` falla con el mensaje de la guarda; `next dev` con el
fixture muestra el catálogo con los mismos precios y cuotas que producción.
El lint marca 1 error y 2 avisos que ya estaban en `main`
(`TemaProvider.tsx`, `set-state-in-effect`), no de esta fase.

**Para regenerar el JSON** (si el catálogo cambia mucho): bajar
`/catalogo` de producción con el header `RSC: 1`, tomar las props
`{"productos":[...]}` de `CatalogoCliente`, decodificar `"$undefined"` y
`"$$"`, sacar `planes` y verificar que no haya `cost`/`efectivo`.

## Fase 2 — profundidad

- Tokens `shadow-elevada`, `shadow-flotante`, `shadow-modal`, con valores por
  tema en `globals.css` (en oscuro, sombra + brillo de 1px arriba). Documentado
  en DESIGN.md → Elevation & Depth.
- Tarjetas de producto y de categoría suben 2px en hover con `shadow-elevada`.
  El hover lo detecta un envoltorio que no se mueve (sin temblor en el borde).
- Barra del comparador y toast: `shadow-2xl` → `shadow-flotante`. Modal:
  `shadow-modal`. Badges y píldora activa siguen con `shadow-md`.
- No cambió ninguna altura (header, barras, `--reserva-barras` intactos).

**Verificado** con `CATALOG_SOURCE=fixture` y Edge por DevTools Protocol
(emula 390px reales, pasa el mouse y hace clic): hover en catálogo y portada,
oscuro y claro (`translate: 0 -2px` solo en la tarjeta bajo el mouse); barra
del comparador y modal en los dos temas; móvil a 390px sin desborde
horizontal (scrollWidth = 390). 56/56 pruebas, typecheck limpio.

**Para la Fase 3:** en hover, la tarjeta de categoría pasa a `bg-superficie2`,
el mismo color de la pastilla del conteo ("6"), que desaparece. Ya pasaba antes
de esta fase.

**Ojo al capturar:** el sitio usa `scroll-behavior: smooth`. Un script que hace
`scrollIntoView` y mide enseguida mide antes de que termine el desplazamiento;
usar `behavior: "instant"`.

## Fase 3 — portada con producto real

- **Hero:** texto a la izquierda y vitrina a la derecha en escritorio (mosaico:
  uno ancho arriba, dos abajo); en el celular, tira horizontal de 4 productos
  debajo de los botones. Uno por categoría antes de repetir
  (`elegirHero`, `lib/portada.ts`). Sin el resplandor cyan.
- **Título:** sin `<br>` y con `text-balance`: dos líneas parejas en vez de
  "casa" sola en una línea (pasaba en el celular desde antes).
- **Categorías:** 2 columnas desde el celular, sin cambio de fondo en hover
  (arregla la pastilla del conteo que desaparecía). Primero llevaban la foto
  de un producto; a pedido de Carlos pasaron a **íconos propios de cada
  categoría pintados con el degradado de marca** (`IconoCategoria`): cada
  tarjeta toma un tramo según su posición y la grilla recorre esmeralda →
  cian → azul. Verificado: los 10 puntos de color van seguidos de `#10b981`
  a `#0284c7`, en oscuro y en claro.
- **Ventajas:** 2 columnas en el celular (antes ocupaban una pantalla).
- **"Lo más pedido":** no repite los de la vitrina; sin `priority`.

**Verificado** (fixture): capturas a 1280, 1024, 390 y 360px, oscuro y claro;
sin desborde horizontal; a 360×740 la vitrina asoma en la primera pantalla
(arranca a 573px). 63/63 pruebas, typecheck y lint limpios, build 39/39.

**Lighthouse móvil** (build de producción con fixture, Edge):

| | Antes (1 corrida) | Después (3 corridas) |
|---|---|---|
| Puntaje | 96 | 95 / 98 / 99 |
| LCP | 2.8 s (H1) | 2.3 / 2.3 / 2.9 s (H1) |
| CLS | 0 | 0 |
| Peso | 453 KiB | ~509 KiB |

**Para el POS (no es código):** la categoría Smart TV no tiene ninguna foto
cargada (sus 2 productos están agotados y sin imágenes), y la foto que
representa "Smart home" es un parlante Anker cargado en esa categoría.

## Fase 4 — fotos del catálogo (en curso)

**Problema confirmado en capturas** (fixture, 390 y 1280px, dos temas):
- En oscuro cada foto (estudio, fondo blanco, viene del POS) es un cuadrado
  blanco de borde a borde: lo más brillante de la pantalla, por encima del
  precio. En la ficha, un cuadrado blanco enorme.
- `next/image` con `fill` es `absolute inset-0`: ignora el `p-4`/`p-6`/`p-3`
  del contenedor, así que el producto toca los bordes, sin aire.
- "Sin foto" (12 de los 19 agotados): el marcador sí respeta el padding y
  queda como caja dentro de caja; en la ficha es la caja gris más grande de la
  pantalla.
- Los 6 lugares que usan `ProductImage` tienen 6 fondos distintos.

**Panel de diseño** (workflow: diseñadores que previsualizan inyectando CSS en
el sitio real → jueces → síntesis). Terminaron 3 propuestas antes de que la
sesión llegara a su límite de uso; el diseñador "audaz", los jueces y la
síntesis quedaron por correr.

| Propuesta | Brillo en oscuro | Marco | Agotado | Sin foto |
|---|---|---|---|---|
| Sistema — "Bandeja de estudio velada" | blanco velado con `color-mix` (≈ #dadada) + `mix-blend-multiply` | de borde a borde | `opacity-70` solo en la foto | ícono de categoría gris sobre `bg-fondo`; en la ficha 2:1 con leyenda |
| Conversión — "Bandeja de mostrador" | gris neutro #e5e5e5 + `mix-blend-multiply` | 4px, radio concéntrico | `opacity-70` en toda la bandeja | ícono gris; ficha 3:1 en el celular, 4:3 en `lg` |
| Accesibilidad/rendimiento — "Bandeja con velo" | bandeja blanca + velo de color con alfa (≈ #dcdcdd), sin blend ni filter | 4px, radio concéntrico | velo más fuerte | ícono gris en `bg-superficie2`; ficha 2:1 |

Coinciden en: una sola bandeja que dibuja `ProductImage`, aire con un
contenedor `absolute inset-[5–8%]`, e `IconoCategoria` monocromo para el
marcador (evita además `id` de degradado repetidos).

**Bugs que ya existían, encontrados por el panel:**
- `Galeria`: si una foto falla, el estado `fallo` de `ProductImage` queda
  pegado al cambiar de miniatura (falta `key` por URL).
- `BarraComparar`: el `div` interno no está posicionado, así que la imagen
  `fill` se ubica contra el de afuera y pisa el borde y el radio.

**Jueces** (cliente en el celular, director de arte, ingeniería; miraron las
capturas y midieron píxeles): votos conversión 2, accesibilidad/rendimiento 1;
puntaje sumado conversión 67, a11y-perf 65.5, sistema 64. Coinciden en la
combinación:
- **Diseño de conversión:** marco de 4px concéntrico (la tarjeta oscura vuelve
  a contener la foto); agotados en tres niveles (disponible claro > agotado con
  foto apagado > agotado sin foto oscuro); ficha sin foto como banda baja.
- **Técnica de a11y-perf:** bandeja blanca + velo plano (`::after` de color con
  alfa) en vez de `mix-blend-multiply`: mismos píxeles, sin el riesgo de iOS con
  el zoom ni capas de composición. Brillo en oscuro ≈ #dcdcdd (14%), más bajo
  que el #e5e5e5 de conversión.
- **Ajustes:** aire 5–6% (no 8%); `className` sigue en la foto y el radio de la
  bandeja va por otra prop; `span` en vez de `div` (vive dentro de `<button>`
  en las miniaturas); `rounded-xl` en miniaturas, barra y hueco punteado;
  leyenda "Sin foto" solo en la ficha (AA en los dos temas); ficha sin foto 3:1
  en el celular y 2:1 en `lg`; zoom con `motion-safe`; tokens dentro de los
  bloques de tema existentes; arreglar los dos bugs.
- Sistema perdió en pantalla: sus agotados con foto quedaban más claros que los
  disponibles y la sección de agotados se veía como un damero claro/negro.

**Confirmado (no es CSS):** la foto del MagCubic HY450MAX tiene la sombra de
piso cortada contra su borde derecho; con el aire nuevo el corte se ve en la
vitrina, la primera tarjeta y la ficha, en las tres propuestas. Lo mismo, más
leve, en el HY450GT, la Amazfit Active 2 y el ANKER SoundCore 2. Arreglo:
volver a cargar esas fotos con margen blanco desde el POS.
**Decisión de Carlos (2026-10-06): se acepta el corte por ahora** y la fase
sigue; recargar esas fotos queda como pendiente del POS, no bloquea la fusión.

**Síntesis** (el agente de síntesis llegó a previsualizar su versión final y
sacar sus 12 capturas antes de que la sesión volviera a llegar al límite; se
implementa a partir de esa previsualización y de los veredictos):
- Token `--bandeja` (#fff, igual en los dos temas: es el blanco de estudio de
  las fotos) y `--velo-foto` por tema: `rgb(9 9 11 / .14)` en oscuro (bandeja ≈
  #dcdcdd), `rgb(15 23 42 / .04)` en claro. Utilidad `bandeja-foto`: fondo
  `--bandeja` + un `::after` del velo. Sin `mix-blend-mode` ni `filter`.
- `ProductImage` dibuja la bandeja en los 6 lugares: `span` relativo con
  `overflow-hidden`, aire `absolute inset-[5%]`, `className` sigue en la foto y
  el radio entra por `bandeja`.
- Agotado en listas (`apagada`): capa `bg-superficie/30` encima. Sin foto: el
  ícono de su categoría (`IconoCategoria` monocromo, `text-tenue`, 40% de la
  bandeja con tope de 64px); el agotado sin foto va sobre `bg-superficie2`.
  Resultado en oscuro: disponible ≈ #dcdcdd > agotado con foto apagado >
  agotado sin foto ≈ #222225.
- Fotos de escena (las de la galería que traen etiqueta del POS: "Con Luz", "A
  Oscuras", "Funciones"…; en el catálogo de prueba la foto del héroe nunca la
  tiene) van sobre `bg-superficie`, no sobre blanco: así no quedan con bandas
  gris claro.
- Marco de 4px (`p-1`) y bandeja `rounded-xl` en tarjeta, vitrina y ficha; en
  miniaturas, barra y modal la bandeja llena la caja. Barra y hueco punteado a
  `rounded-xl`; el modal suma `border-borde`.
- Ficha sin foto: banda `aspect-[3/1]` (2:1 en `lg`) en `bg-superficie2` con el
  ícono y la leyenda "Sin foto" en `text-texto` (AA en los dos temas).
- Pastilla "Agotado" de la tarjeta: `bg-superficie/95` (en claro, sobre la
  bandeja, `bg-fondo/90` dejaba el rosa en ~4.48:1).
- Zoom del hover con `motion-safe:`. Arreglos: `key` por URL en la foto grande
  de la galería; la barra del comparador deja de posicionar la foto contra el
  `div` de afuera.

**Implementado** (rama `mejora-visual-fase-4`): globals.css (tokens y
`bandeja-foto`), `IconoCategoria` (variante monocroma), `ProductImage` (la
bandeja), `ProductCard`, vitrina, `Galeria`, ficha, `BarraComparar`,
`ModalComparar`; sale `IconoImagen`. DESIGN.md: "Foto de producto" con **La
Regla de la Bandeja**.

**Verificado** (fixture, código real, sin CSS inyectado): las 12 tomas base y
22 extra coinciden con la previsualización aprobada. Falla de Imgur simulada
(data URI inválido → `onError` real) cae al ícono de la categoría. Ficha sin
foto: banda 358×119 a 390px (precio a 514px, dentro de la primera pantalla) y
540×270 a 1280px. Foto de escena "Con Luz" sobre la superficie, sin bandas.
Sin desborde horizontal a 390. 63/63 pruebas (3 nuevas del ícono), typecheck,
lint, `CATALOG_SOURCE=fixture npm run build` 39/39; el CSS del build sale plano
(`.bandeja-foto:after{…}`, sin anidado).

**Revisión adversarial** (2 revisores, código y visual, y un verificador que
intentó refutar cada hallazgo): la implementación coincide píxel a píxel con la
previsualización aprobada. Confirmó 4 hallazgos medios, ya arreglados:
- con Imgur caído, la foto grande de la ficha volvía a ser un cuadrado claro
  sin leyenda (regresión frente a `main`) → `leyenda` en la galería;
- en el comparador, el agotado sin foto salía en la bandeja clara → sin foto
  en el POS va siempre a `superficie2`;
- la infografía "Funciones" se pintaba #fff puro en oscuro → el velo pasa a su
  propia utilidad (`velo-foto`) y también lo llevan las fotos de escena;
- (bajo) la capa de agotado tapaba el ícono del sin foto → solo sobre fotos.
Se aceptó y quedó escrito en DESIGN.md que en claro los agotados se lavan hacia
el blanco sin escalón de bandeja. Suma 5 pruebas de `ProductImage` (68/68).

## Fase 5 (resumen)

- **5. Cierre:** borrar `bg-marca-hover`, documentar en DESIGN.md y comparar con
  la situación inicial.

## Validación por fase

```bash
npm run typecheck && npm run lint && npm test
CATALOG_SOURCE=fixture npm run build   # sin lecturas de Firestore
```

Además, capturas a 1280px en los dos temas con `CATALOG_SOURCE=fixture npm run dev`.
