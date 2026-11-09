# ADR 0002 · SPA estática en GitHub Pages, sin backend (por ahora)

- Estado: aceptada
- Fecha: 2026-11-08

## Contexto

Necesitamos algo usable pronto, gratis y sin mantenimiento de servidores. El progreso
por ahora es por dispositivo.

## Decisión

- SPA estática (Vite) desplegada en GitHub Pages solo desde `main`.
- Hash router para evitar 404 al recargar rutas.
- Persistencia en `localStorage` detrás del puerto `KeyValueStore`.
- Voz con Web Speech API detrás del puerto `SpeechService`.

## Consecuencias

- ✅ Coste cero, despliegue automático, sin datos personales en servidores.
- ✅ Cambiar a backend implica nuevos adaptadores en `src/app/composition.ts`, no reescribir features.
- ⚠️ La calidad de la voz depende del dispositivo (las voces en español varían).
- ⚠️ `develop` y `staging` no tienen URL pública; se prueban en local.
