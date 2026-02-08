# MariaMVC

Sitio estático multipágina del restaurante **Aurelia**.

## Ver en local

```bash
python3 -m http.server 4173
```

Rutas:
- `http://localhost:4173/`
- `http://localhost:4173/menu/`
- `http://localhost:4173/about/`
- `http://localhost:4173/reservations/`

## Publicar en GitHub Pages (acceso desde cualquier lugar)

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama (`main` o la que uses) y carpeta `/ (root)`.
5. Guarda.

Tu web quedará disponible normalmente en:

- `https://<tu-usuario>.github.io/<tu-repo>/`

Con esta estructura, las páginas internas funcionarán también en GitHub Pages:
- `https://<tu-usuario>.github.io/<tu-repo>/menu/`
- `https://<tu-usuario>.github.io/<tu-repo>/about/`
- `https://<tu-usuario>.github.io/<tu-repo>/reservations/`
