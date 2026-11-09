# ADR 0001 · Boquitas en SVG paramétrico en lugar de fotografías

- Estado: aceptada
- Fecha: 2026-11-08

## Contexto

Las láminas de referencia de la terapeuta usan fotografías de bocas reales. Queremos
además animar la transición entre sonidos (sílabas y palabras), y las fotos tienen
derechos de autor de terceros.

## Decisión

Dibujar la boca en SVG a partir de un vector de 9 parámetros normalizados (`MouthShape`).
Cada visema es un preset; las animaciones se obtienen interpolando vectores.

## Consecuencias

- ✅ Animaciones fluidas entre cualquier par de sonidos, sin dibujar cada transición.
- ✅ Sin problemas de licencias; ligero (≈4 kB gzip) y nítido a cualquier tamaño.
- ✅ Calibrable por la terapeuta editando números en un único fichero.
- ⚠️ Menos realista que una foto. Si hiciera falta, el componente `LetterCard`
  admite cualquier contenido visual y se pueden añadir fotos propias con licencia.
