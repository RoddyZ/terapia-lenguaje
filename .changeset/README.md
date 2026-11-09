# Changesets

Cada cambio que afecte a la app (feature, fix, contenido nuevo) debe llevar un changeset:

```bash
npm run changeset
```

- `patch` → correcciones, ajustes de contenido (palabras, sílabas).
- `minor` → actividades o funcionalidades nuevas.
- `major` → cambios que rompen datos guardados del usuario o rediseños completos.

Los changesets se acumulan en `develop` y se consumen (`npm run version`) al preparar
una release hacia `main`. Ver [CONTRIBUTING.md](../CONTRIBUTING.md).
