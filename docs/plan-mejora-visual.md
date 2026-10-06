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
| 4 | Catálogo: tratamiento de fotos | En curso — rama `mejora-visual-fase-4` |
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

## Fases 4–5 (resumen)

- **5. Cierre:** borrar `bg-marca-hover`, documentar en DESIGN.md y comparar con
  la situación inicial.

## Validación por fase

```bash
npm run typecheck && npm run lint && npm test
CATALOG_SOURCE=fixture npm run build   # sin lecturas de Firestore
```

Además, capturas a 1280px en los dos temas con `CATALOG_SOURCE=fixture npm run dev`.
