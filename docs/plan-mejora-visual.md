# Plan: mejora visual de PandaWEB

Plan vivo: se actualiza y se commitea en cada paso, para poder retomar desde
acá si la sesión se corta. Las reglas de diseño están en [DESIGN.md](../DESIGN.md).

**Forma de trabajo:** una rama y un PR por fase; commit + push después de cada
paso que funcione. Fusionar a `main` solo con permiso explícito.

## Estado

| Fase | Qué | Estado |
|---|---|---|
| 0 | Mirar el sitio antes de tocarlo | Hecha (2026-10-05) |
| 1 | Datos de prueba locales (`CATALOG_SOURCE=fixture`) | En curso — rama `mejora-visual-fase-1` |
| 2 | Profundidad: tokens de elevación | Pendiente |
| 3 | Portada con producto real (hero + categorías con foto) | Pendiente |
| 4 | Catálogo: tratamiento de fotos | Pendiente |
| 5 | Cierre: limpiar `bg-marca-hover`, actualizar DESIGN.md | Pendiente |

## Fase 0 — lo que se vio (capturas de producción, tema oscuro)

- **Portada en móvil:** en las primeras dos pantallas no aparece ni un producto.
  Hero de solo texto → 4 ventajas apiladas → tarjetas de categoría sin foto, a
  una columna. Lo primero con foto ("Lo más pedido") queda muy abajo.
- **Portada en escritorio:** above the fold solo hay texto centrado, el
  resplandor cyan y mucho espacio vacío. Ningún producto.
- **Catálogo:** las fotos mezclan fondo blanco de estudio (proyectores) con
  fotos de ambiente oscuras (smartwatch, dashcam): las tarjetas se ven
  disparejas. Candidato para la Fase 4.
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

## Fases 2–5 (resumen)

- **2. Profundidad:** `--sombra-1/2/3` por tema (en oscuro, sombra + brillo de
  1px arriba). Tarjetas que suben en hover; las barras flotantes y el modal usan
  los tokens. Sin cambiar alturas de header ni barras (`--reserva-barras`).
- **3. Portada:** hero con fotos de destacados (tira horizontal en móvil, dos
  columnas en escritorio) y sin el resplandor; categorías con la foto de su
  primer producto disponible, a 2 columnas en móvil. El H1 sigue siendo el LCP.
- **4. Catálogo:** área de foto uniforme para fotos de estudio y de ambiente.
- **5. Cierre:** borrar `bg-marca-hover`, documentar en DESIGN.md y comparar con
  la situación inicial.

## Validación por fase

```bash
npm run typecheck && npm run lint && npm test
CATALOG_SOURCE=fixture npm run build   # sin lecturas de Firestore
```

Además, capturas a 1280px en los dos temas con `CATALOG_SOURCE=fixture npm run dev`.
