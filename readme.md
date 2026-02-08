# MariaMVC

Sitio multipágina de **Aurelia** con frontend de restaurante + CRM dashboard.

## Rutas
- `/` Inicio
- `/menu/` Menú
- `/about/` Historia
- `/reservations/` Reservas
- `/dashboard/` CRM funcional (estado local, filtros, altas y export)

## Ver en local

```bash
python3 -m http.server 4173
```

Abrir:
- `http://localhost:4173/`
- `http://localhost:4173/dashboard/`

## Publicar en GitHub Pages
1. Sube el repo a GitHub.
2. `Settings → Pages`.
3. `Deploy from a branch`.
4. Branch `main` (o la que uses) y carpeta `/ (root)`.
5. Guardar.

URL final:
- `https://<tu-usuario>.github.io/<tu-repo>/`
