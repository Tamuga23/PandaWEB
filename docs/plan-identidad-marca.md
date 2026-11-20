# Plan de identidad de marca (nov-2026)

Objetivo: que la web se vea como las piezas de Instagram y Facebook de Panda Store,
sin perder lo que ya funciona (SEO y JSON-LD, accesibilidad AA, una sola precarga
de imagen por página, tema claro y oscuro, lógica de cuotas, comparador, WhatsApp
con medición de conversiones, dirección y teléfono reales).

Rama: `identidad-marca`. Cada fase es un commit chico con push. Fusionar a `main`
requiere el permiso explícito de Carlos.

Verificación: SIEMPRE contra `CATALOG_SOURCE=fixture npx next start -p 3100`
(datos de prueba, cero lecturas de Firestore). Nunca capturas contra producción.

## De dónde sale

Once piezas de redes (Black Panda, GTA VI, tips y curiosidades, afiches de
A810 Lite, HY300 Pro+, Cubelite Ultra, HY320 Pro, HY350 Max, Bip 6, "Elegí tu
smartwatch", calendario de diciembre) y el logo. Las analizó un workflow de seis
agentes (2026-11-19): sistema visual, composición, UI UX Pro Max (sistema de
diseño, contraste WCAG, reglas de UX), Taste Skill (principios y sus
verificadores en navegador como línea base), brecha con el sitio actual y las
sub-skills `brand` y `design-system` (arquitectura de tokens).

## La marca, en una página

- **Lienzo:** negro azulado, nunca neutro ni negro puro (#090c11), con viñeta
  suave. Superficies azuladas un paso arriba (#111822, #1a2330), bordes finos.
- **Degradado de marca:** verde #10b981 → cian #06b6d4 → azul #0284c7. Es el que
  ya usa la web (no cambia). En texto corre horizontal (90deg) y en el tema claro
  usa paradas oscuras (#047857 → #0e7490 → #0369a1) para llegar a AA.
- **Verde precio:** #34d399 (oscuro), plano, nunca en degradado. Todo precio y el
  0% de interés (que sigue saliendo de la lógica de cuotas, nunca a ojo).
- **Titular de dos líneas:** primera línea en blanco, la segunda (el "remate") en
  degradado: "Elegí tu / smartwatch", "Tu pared / es tu cine". Inter 800 con
  tracking muy cerrado (-0.045em) e interlineado 0.95. Un remate por pantalla.
- **Eyebrow:** mayúsculas espaciadas (0.22em) en gris, "MAGCUBIC · HY350 MAX".
- **Escenario de producto:** el producto grande sobre un brillo radial (verde o
  azul) y un dial circular con marcas, como un velocímetro. Solo detrás del
  producto protagonista (hero y galería de la ficha), nunca detrás de texto.
- **Afiche de producto:** eyebrow marca · categoría, nombre enorme, una frase
  corta, datos clave en 2x2 con ícono de línea (cifra grande + bajada gris),
  precio enorme con "C$" chico arriba, cuotas al lado y fila de garantías con
  check (Cuotas con Banpro · Garantía 3 meses · Entrega inmediata · Con factura).
- **Firma:** logo + "Colectivo Dreamy · Managua" a la izquierda; círculo de
  WhatsApp en degradado + "Escribinos por WhatsApp" + 8372 5528 enorme.
- **Voz:** voseo, frases cortas con punto final ("Tu primer cine en casa.").

## Lo que NO se traduce

Paginación de carrusel ("1/6", "DESLIZÁ"), íconos de reel, texto metido en
imágenes, precios o vigencias escritas a mano (la web los lee del POS), cinta
diagonal animada, tipografía condensada de los lanzamientos (sería otra fuente),
el escenario completo en cada tarjeta del catálogo (ruido y costo de pintado),
más de un remate en degradado por pantalla, fondos con grilla en todo el sitio.

De Taste Skill se ignora: el sorteo de paleta/tipografía (la marca ya existe), su
regla 9 (aquí dirección, teléfono y coordenadas reales son obligatorios para el
SEO local), su kit de assets y el gate/hook Stop.

## Reglas de DESIGN.md que cambian

1. "Nada de gradientes de fondo decorativos" → excepción con nombre: **Escenario
   de producto** (un brillo por vista, solo detrás del producto protagonista).
2. "No aplicar text-marca a nada nuevo" → **Regla del Remate**: solo en la última
   línea de un titular display, una vez por pantalla, nunca en párrafos ni precios.
3. Paleta neutra zinc → **escala azulada** (mismos nombres de token, otros valores).
4. Display solo en el h1 de portada → escala **display / titular / sección / cifra
   / eyebrow** en Inter 800 (misma fuente variable, sin descarga extra).
5. "Plano en reposo" → se aclara que la profundidad del escenario es ambiental y
   decorativa (aria-hidden); las tarjetas siguen planas en reposo.
6. Se mantienen: la Regla de la Bandeja (las fotos del POS tienen fondo blanco),
   los tres semánticos, el patrón de hover sin temblor y los tokens de elevación.

## Fases

| # | Fase | Estado |
|---|------|--------|
| 1 | Tokens: lienzo azulado, AA del tema claro, text-marca por tema, escala display, theme-color y OG | hecho |
| 2 | Escenario de producto: brillo + dial (CSS/SVG), en hero y galería | hecho |
| 3 | Portada: hero (eyebrow, remate, pastilla), vitrina, encabezados de sección, ubicación | hecho |
| 4 | Ficha tipo afiche: eyebrow, h1, datos clave 2x2, precio protagonista, fila de garantías | hecho |
| 5 | Catálogo y tarjeta: jerarquía, precio, foco visible en filtros | hecho |
| 6 | Firma de marca en el footer, skip link, áreas táctiles | hecho (skip link en fase 5) |
| 7 | QA: verificadores de Taste, checklist de UI UX Pro Max, AA en ambos temas, regresión funcional | hecho (ver "Resultado del QA") |

## Línea base (antes de tocar nada)

Verificadores de Taste sobre el fixture (portada y ficha del HY450MAX, 1440 y 390):
- FAIL reales: "Comparar" en --tenue sobre --superficie2 da 4.13:1; 3 estilos de
  botón y 2 alturas; `focus:outline-none` sin reemplazo en CatalogoCliente; en la
  ficha a 390 el precio (36px) supera al h1 (30px).
- WARN reales: sin skip link; links del nav en 14 y 16px; links del footer de
  17-20px de alto (bajo 44px); "Por qué te sirve" en 14px.
- Tema claro: --acento #0891b2 (3.5:1), --precio #059669 (3.6:1) y --promo
  #d97706 (3.2:1) fallan AA como texto chico.

## Resultado del QA

Un workflow de revisión (Taste, fidelidad a las piezas, accesibilidad y
regresión, con verificación adversarial de cada hallazgo) confirmó 11
hallazgos y descartó 0. Todos quedaron resueltos y medidos en el servidor con
datos de prueba:

- **Alto:** el hero de la portada medía 676px en el celular y cortaba el h1
  (el escenario, como ítem de grid, tomaba el ancho de la vitrina). Ahora
  358px a 390.
- **Ficha:** "Lo quiero" volvió a la primera pantalla (CTA entre el precio y
  las cuotas; el código del producto pasó a la fila de estado), la cuota más
  baja al lado de la cifra, sello 0% en verde plano, escenario solo en la foto
  principal, la marca dentro del h1 sin repetirse en el eyebrow, datos clave
  alineados y con las cifras de los valores sin unidad, h2 en text-2xl.
- **Consistencia:** un solo botón secundario y un solo estilo de Comparar,
  remates en degradado que llegan al azul, eyebrow del financiamiento en gris,
  eyebrow de la tarjeta en una línea, garantías en 2x2, copyright alineado.
- **AA en claro:** grises secundarios a #5b6779 (de 4.34 a 5.24:1 sobre
  superficie2) y token --precio-sello para el verde sobre tinte (de 4.57 a
  6.40:1).

Quedan, sin tocar a propósito:

- El titular del hero ocupa tres líneas a 1440 y la marca usa dos: es una
  decisión de copy para Carlos ("Tecnología para tu casa / y tu negocio").
- Los links del nav en 14 y 16px y los del footer de 17-20px de alto en el
  celular (ya estaban en main; pasan AA por el espacio entre ellos).
- La franja vertical en el borde derecho de las capturas en claro: también
  está en producción y no sale del DOM. Mirarla en un teléfono real.

## Lo que respondió Carlos (resuelto)

- **Logo:** no hay SVG. El panda se recortó de la imagen del logo (12.jpg) y va
  sin baldosa, en dos capas del mismo lienzo (`public/marca/`, componente
  `LogoPanda`): `panda.png` es solo lo blanco, y en oscuro va solo, como en los
  afiches; `panda-tinta.png` es la máscara de lo negro del panda (orejas, ojos,
  boca, brazo) más un contorno fino, que en claro se pinta debajo con
  `--texto`. El wordmark sigue siendo texto en Inter: nítido a cualquier tamaño
  y legible para lectores de pantalla. Los íconos de la app (`icon.png`,
  `apple-icon.png`) conservan la baldosa: un ícono necesita fondo propio.
- **Fotos sin fondo de los productos:** no hay. El escenario trabaja con las
  fotos del POS dentro de su bandeja.
- **Dirección:** lleva "Módulo 2" (`CONTACTO.direccion`, que alimenta el
  footer, la portada y el JSON-LD).
