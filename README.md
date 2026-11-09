# Boquitas 👄

Aplicación web de apoyo para **terapia de lenguaje infantil**. Los niños aprenden
vocales, abecedario, sílabas y palabras viendo **boquitas animadas** que muestran
la posición de labios, dientes y lengua de cada sonido, con voz sintetizada.

> Proyecto desarrollado a petición de una terapeuta de lenguaje. El contenido
> pedagógico (palabras, visemas, indicaciones) debe validarse con ella.

## Actividades

| Actividad      | Qué hace                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Vocales**    | Tarjetas tipo lámina; al tocarlas la boca se mueve y suena. Dos juegos: _Mira la boca_ (boca → letra) y _Busca la boca_ (letra → boca). |
| **Abecedario** | 27 letras + dígrafos ch, ll, rr. Ficha por letra con boca grande, indicación articulatoria y palabras de ejemplo.                       |
| **Sílabas**    | Constructor consonante + vocal (directas `ma` e inversas `am`), con reglas ortográficas (que/qui, ce/ci, ge/gi…) y la familia completa. |
| **Palabras**   | Ordenar sílabas para formar la palabra, 3 niveles de dificultad con distractores. La boca "dice" cada sílaba y la palabra al resolver.  |
| **Ajustes**    | Voz on/off y velocidad, velocidad de la boquita, mayúsculas/minúsculas, pronunciación de la z (distinción/seseo), borrar progreso.      |

## Puesta en marcha

Requisitos: Node ≥ 22 (ver `.nvmrc`).

```bash
npm install
npm run dev            # entorno development en http://localhost:5173
npm run dev:staging    # mismo servidor con variables de staging
npm run preview:staging # build de staging + servidor estático (lo más parecido a prod)
```

| Script               | Descripción                                          |
| -------------------- | ---------------------------------------------------- |
| `npm run validate`   | typecheck + lint + formato + tests (lo mismo que CI) |
| `npm run test:watch` | tests en modo watch                                  |
| `npm run build`      | build de producción (base `/terapia-lenguaje/`)      |
| `npm run changeset`  | registra un cambio para el CHANGELOG                 |

## Ramas y despliegue

```
feature/*  ──PR──▶  develop  ──PR──▶  staging  ──PR──▶  main  ──▶ GitHub Pages
                   (local)            (local)          (producción)
```

- **develop**: integración diaria. Se prueba en local con `npm run dev`.
- **staging**: candidata a release. Se prueba en local con `npm run preview:staging`
  (muestra la etiqueta `STAGING` en la cabecera).
- **main**: producción. **Solo esta rama despliega** a GitHub Pages
  (`.github/workflows/deploy.yml`).

Detalles en [CONTRIBUTING.md](CONTRIBUTING.md).

## Arquitectura

Arquitectura por capas con dependencias hacia dentro, reforzada por ESLint.
Resumen en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y decisiones en [docs/adr](docs/adr).

```
src/
├── domain/     Lógica pura en TypeScript: visemas, grafemas del español, sílabas, juegos
├── content/    Datos editables: abecedario y banco de palabras (validados por tests)
├── services/   Puertos y adaptadores: voz, almacenamiento, progreso, ajustes
├── shared/     UI reutilizable, boquita SVG, hooks, contenedor de dependencias
├── features/   Pantallas: home, vowels, alphabet, syllables, words, settings
└── app/        Composition root, router (lazy), layout
```

## Stack

React 19 · TypeScript (strict) · Vite 7 · React Router 7 · Motion · Vitest + Testing Library ·
ESLint 9 + Prettier · Changesets · Husky + lint-staged + commitlint · GitHub Actions.

Tipografías: [Andika](https://software.sil.org/andika/) (diseñada para lectores principiantes) y Fredoka.
