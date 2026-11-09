# Guía de contribución

## Flujo de ramas

| Rama        | Propósito               | Cómo se prueba            | Despliega       |
| ----------- | ----------------------- | ------------------------- | --------------- |
| `feature/*` | Una funcionalidad o fix | `npm run dev`             | —               |
| `develop`   | Integración             | `npm run dev`             | —               |
| `staging`   | Candidata a release     | `npm run preview:staging` | — (local)       |
| `main`      | Producción              | —                         | ✅ GitHub Pages |

1. Crear rama desde `develop`: `git switch -c feature/juego-memoria develop`.
2. Commits con [Conventional Commits](https://www.conventionalcommits.org/es/) (lo valida commitlint):
   `feat(words): añadir nivel 4`, `fix(mouth): corregir visema de la f`, `content: nuevas palabras con r`.
3. Añadir un changeset: `npm run changeset` (CI lo exige en PRs hacia `develop`).
4. PR hacia `develop`. CI ejecuta typecheck, lint, formato, tests y build.
5. Para preparar una release: PR `develop → staging`, probar con `npm run preview:staging`.
6. Release: en `staging`, ejecutar `npm run version` (consume los changesets, sube la
   versión y actualiza `CHANGELOG.md`), commit `chore(release): vX.Y.Z`, y PR `staging → main`.
   Al fusionar, GitHub Actions despliega a Pages.

## Changesets

- `patch`: correcciones y ajustes de contenido.
- `minor`: actividades o funcionalidades nuevas.
- `major`: cambios que invalidan datos guardados o rediseños completos.

## Reglas de arquitectura

- `domain/` es TypeScript puro: **no** importa React, servicios ni features (ESLint lo impide).
- `content/` solo depende de `domain/`.
- Las features usan servicios a través de `useServices()`, nunca instanciándolos.
- Las implementaciones concretas se eligen en `src/app/composition.ts`.

## Contenido terapéutico

- Palabras: `src/content/es/words.ts`. Los tests verifican que las sílabas formen la palabra.
- Letras e indicaciones: `src/content/es/alphabet.ts`.
- Forma de cada boca: `src/domain/phonetics/visemes.ts` (valores 0..1).

Cualquier cambio pedagógico debe revisarlo la terapeuta (casilla en la plantilla de PR).

## Configuración de GitHub (una sola vez)

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Branches**: proteger `main` y `staging` (PR obligatorio + check `CI` en verde).
3. Rama por defecto: `develop`.
