# Arquitectura

## Capas

```
            ┌──────────────────────────────────────────┐
            │ app/  composition root · router · layout │
            └──────────────┬───────────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │ features/  pantallas         │
            └──────┬───────────────┬──────┘
                   │               │
     ┌─────────────▼───┐   ┌───────▼─────────────┐
     │ shared/  UI,     │   │ content/  datos     │
     │ boquita, DI      │   │ (abecedario, palabras)
     └──┬───────────┬──┘   └───────┬─────────────┘
        │           │              │
┌───────▼──────┐ ┌──▼──────────────▼──┐
│ services/    │ │ domain/  lógica pura│
│ puertos +    │ │ (sin React)         │
│ adaptadores  │ └─────────────────────┘
└──────────────┘
```

Las dependencias apuntan hacia `domain/`. ESLint (`no-restricted-imports`) impide que
`domain/` o `content/` importen capas externas.

## La boquita: de texto a animación

```
"perro" ──tokenize()──▶ [p][e][rr][o]          domain/text/graphemes.ts
          (dígrafos, qu/gu, c/g+e/i, h muda, y final)
        ──visema──────▶ bilabial, e, vibrant, o   domain/phonetics/visemes.ts
        ──buildTimeline()─▶ keyframes (transición 40% + pose mantenida 60%)
        ──sampleTimeline(t)─▶ MouthShape (9 parámetros 0..1)
        ──computeMouth()──▶ paths SVG               shared/mouth/geometry.ts
        ──<Mouth/>────────▶ pantalla                shared/mouth/Mouth.tsx
```

- **MouthShape** es un vector numérico (apertura, ancho, redondez, dientes, lengua…),
  así cualquier par de bocas se puede interpolar: no hay que dibujar transiciones.
- Mantener la pose es intencional: el niño necesita _ver_ la posición, no solo el movimiento.
- Con `prefers-reduced-motion` las transiciones son instantáneas.
- La velocidad (ms por sonido) es configurable en Ajustes.

## Servicios (puertos y adaptadores)

| Puerto                                      | Adaptador actual      | Futuro posible                              |
| ------------------------------------------- | --------------------- | ------------------------------------------- |
| `SpeechService`                             | `WebSpeechService`    | Audios grabados por la terapeuta + fallback |
| `KeyValueStore`                             | `LocalStorageStore`   | API remota (cuentas, varios pacientes)      |
| `ProgressRepository` / `SettingsRepository` | sobre `KeyValueStore` | igual, cambiando el store                   |

Los repositorios son observables y compatibles con `useSyncExternalStore`.
Los datos llevan `version` para poder migrar sin perder progreso.

## Rutas

Hash router (`/#/vocales`) para funcionar en GitHub Pages sin configuración de servidor.
Cada feature se carga de forma diferida (`lazy`), así el bundle inicial no crece con
cada actividad nueva.

## Tests

- `domain/`: lógica pura, tests unitarios exhaustivos.
- `content/`: tests de integridad (ids únicos, sílabas que forman la palabra, visemas válidos).
- `services/`: con `MemoryStore`.
- Componentes y navegación: Testing Library con `createTestServices()` (voz silenciosa
  que registra lo que "diría").

## Escalado previsto

1. **PWA offline** (las consultas no siempre tienen buena conexión).
2. **Audios grabados** por la terapeuta → `RecordedAudioService`.
3. **Modo terapeuta**: perfiles de niños, sesiones, informes de progreso → backend
   (p. ej. Supabase) implementando `KeyValueStore`/repositorios remotos.
4. **Más actividades** reutilizando `ChoiceQuiz` y `wordPuzzle`: sílabas trabadas
   (bra, pla), pares mínimos (pato/gato), memoria.
5. Hosting con previews por PR (Vercel/Netlify/Cloudflare) si se quiere desplegar staging.
